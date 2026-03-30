import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

type PageInput = { page_number: number; text: string };

type QuestionOut = {
  question_number?: string;
  question_type: "mcq" | "open" | "true_false" | "essay";
  stem: string;
  options?: Array<{ key: string; text: string }>;
  answer?: { correct_option_key?: string; correct_text?: string; explanation?: string };
  page_number?: number;
};

type ExtractPayload = {
  topic_intro?: { title?: string; text?: string };
  questions: QuestionOut[];
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function callOpenAI(apiKey: string, model: string, text: string): Promise<ExtractPayload> {
  const prompt = `Extract psychometric questions from Hebrew text.
Return ONLY valid JSON with this shape:
{
  "topic_intro": { "title": string | null, "text": string | null },
  "questions": [
    {
      "question_number": string | null,
      "question_type": "mcq" | "open" | "true_false" | "essay",
      "stem": string,
      "options": [{"key": string, "text": string}],
      "answer": {"correct_option_key": string | null, "correct_text": string | null, "explanation": string | null},
      "page_number": number | null
    }
  ]
}
If no questions are found, return {"topic_intro": null, "questions": []}.`; 

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || "gpt-4.1-mini",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You are a strict data extraction engine." },
        { role: "user", content: `${prompt}\n\nTEXT:\n${text}` },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return JSON.parse(data.choices?.[0]?.message?.content || "{\"questions\":[]}");
}

async function callGemini(apiKey: string, model: string, text: string): Promise<ExtractPayload> {
  const chosenModel = model || "gemini-1.5-flash";
  const prompt = `Extract psychometric questions from Hebrew text and output JSON only.
Schema:
{"topic_intro":{"title":string|null,"text":string|null},"questions":[{"question_number":string|null,"question_type":"mcq"|"open"|"true_false"|"essay","stem":string,"options":[{"key":string,"text":string}],"answer":{"correct_option_key":string|null,"correct_text":string|null,"explanation":string|null},"page_number":number|null}]}`;

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${chosenModel}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${prompt}\n\nTEXT:\n${text}` }] }],
      generationConfig: {
        temperature: 0,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{\"questions\":[]}";
  return JSON.parse(content);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    const geminiKey = Deno.env.get("GEMINI_API_KEY");

    const body = await req.json();
    const sourceId = body.source_id as string;
    const jobId = body.job_id as string;
    const provider = (body.provider || "openai") as "openai" | "gemini";
    const model = body.model as string | undefined;
    const pages = (body.pages || []) as PageInput[];

    if (!sourceId || !jobId || !pages.length) {
      return new Response(JSON.stringify({ error: "source_id, job_id, and pages are required" }), { status: 400, headers: corsHeaders });
    }

    const supabase = createClient(supabaseUrl, serviceRole);

    await supabase.from("import_jobs").update({ status: "running", started_at: new Date().toISOString(), pages_total: pages.length }).eq("id", jobId);

    // Store page text first for auditability.
    const pageRows = pages.map((p) => ({ source_id: sourceId, page_number: p.page_number, raw_text: p.text, ocr_text: null, has_images: false }));
    const { error: pageErr } = await supabase.from("document_pages").upsert(pageRows, { onConflict: "source_id,page_number" });
    if (pageErr) throw pageErr;

    const textForAi = pages.map((p) => `Page ${p.page_number}:\n${p.text}`).join("\n\n").slice(0, 120000);

    const extracted = provider === "gemini"
      ? await callGemini(geminiKey || "", model || "", textForAi)
      : await callOpenAI(openAiKey || "", model || "", textForAi);

    let topicSectionId: string | null = null;
    if (extracted.topic_intro?.title || extracted.topic_intro?.text) {
      const { data: topicRows, error: topicErr } = await supabase
        .from("topic_sections")
        .insert({
          source_id: sourceId,
          topic_name: extracted.topic_intro.title || "Imported Topic",
          intro_title: extracted.topic_intro.title || null,
          intro_text: extracted.topic_intro.text || null,
        })
        .select("id")
        .limit(1);
      if (topicErr) throw topicErr;
      topicSectionId = topicRows?.[0]?.id || null;
    }

    let insertedQuestions = 0;

    for (const q of extracted.questions || []) {
      if (!q?.stem) continue;

      const { data: qRows, error: qErr } = await supabase
        .from("questions")
        .insert({
          source_id: sourceId,
          topic_section_id: topicSectionId,
          question_number: q.question_number || null,
          question_type: q.question_type || "mcq",
          stem: q.stem,
          status: "extracted",
          page_start: q.page_number || null,
          page_end: q.page_number || null,
        })
        .select("id")
        .limit(1);

      if (qErr) throw qErr;
      const questionId = qRows?.[0]?.id;
      if (!questionId) continue;
      insertedQuestions += 1;

      if (q.options?.length) {
        const optionsRows = q.options.map((opt, idx) => ({
          question_id: questionId,
          option_key: opt.key,
          option_text: opt.text,
          sort_order: idx + 1,
        }));
        const { error: optErr } = await supabase.from("question_options").insert(optionsRows);
        if (optErr) throw optErr;
      }

      if (q.answer?.correct_option_key || q.answer?.correct_text || q.answer?.explanation) {
        const { error: answerErr } = await supabase.from("answer_keys").insert({
          question_id: questionId,
          correct_option_key: q.answer.correct_option_key || null,
          correct_text: q.answer.correct_text || null,
          explanation: q.answer.explanation || null,
          source_solution_doc_id: null,
          confidence: 0.85,
        });
        if (answerErr) throw answerErr;
      }

      const { error: provErr } = await supabase.from("question_provenance").insert({
        question_id: questionId,
        source_id: sourceId,
        page_number: q.page_number || 1,
        snippet: q.stem.slice(0, 1200),
        extraction_method: "text",
      });
      if (provErr) throw provErr;
    }

    await supabase.from("import_jobs").update({
      status: "succeeded",
      finished_at: new Date().toISOString(),
      pages_processed: pages.length,
      error_log: null,
    }).eq("id", jobId);

    return new Response(JSON.stringify({ ok: true, inserted_questions: insertedQuestions }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

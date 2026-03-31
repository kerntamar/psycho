import { createClient } from '@supabase/supabase-js';
import pdf from 'pdf-parse';

const {
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  PROCESS_BATCH_SIZE = '5',
  EXTRACT_PROVIDER = 'openai',
  EXTRACT_MODEL = '',
  PAGE_LIMIT = '12',
} = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function toPages(rawText, pageLimit) {
  const byFormFeed = rawText.split('\f').map((s) => s.trim()).filter(Boolean);
  const pages = byFormFeed.length
    ? byFormFeed
    : rawText
        .split(/\n{3,}/)
        .map((s) => s.trim())
        .filter(Boolean)
        .reduce((acc, chunk, idx) => {
          const pageIdx = Math.floor(idx / 4);
          acc[pageIdx] = (acc[pageIdx] || '') + `\n${chunk}`;
          return acc;
        }, []);

  return pages.slice(0, pageLimit).map((text, i) => ({ page_number: i + 1, text }));
}

async function markFailed(jobId, message) {
  await supabase
    .from('import_jobs')
    .update({
      status: 'failed',
      finished_at: new Date().toISOString(),
      error_log: { message },
    })
    .eq('id', jobId);
}

async function processJob(job) {
  const { id: jobId, source_id: sourceId, document_sources: source } = job;
  const url = source?.url;

  if (!url) {
    await markFailed(jobId, 'Missing source URL');
    return;
  }

  console.log(`Processing job ${jobId} -> ${url}`);

  const pdfResp = await fetch(url);
  if (!pdfResp.ok) {
    await markFailed(jobId, `Failed to download PDF: ${pdfResp.status}`);
    return;
  }

  const pdfBuffer = Buffer.from(await pdfResp.arrayBuffer());
  const parsed = await pdf(pdfBuffer);

  const pages = toPages(parsed.text || '', Number(PAGE_LIMIT));
  if (!pages.length) {
    await markFailed(jobId, 'No text extracted from PDF');
    return;
  }

  const fnResp = await fetch(`${SUPABASE_URL}/functions/v1/extract-pdf`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({
      source_id: sourceId,
      job_id: jobId,
      provider: EXTRACT_PROVIDER,
      model: EXTRACT_MODEL,
      pages,
    }),
  });

  if (!fnResp.ok) {
    const errText = await fnResp.text();
    await markFailed(jobId, `extract-pdf failed: ${errText}`);
    return;
  }

  const result = await fnResp.json();
  console.log(`Job ${jobId} completed. Inserted questions: ${result.inserted_questions ?? 'n/a'}`);
}

async function main() {
  const { data: jobs, error } = await supabase
    .from('import_jobs')
    .select('id, source_id, status, document_sources:source_id(url)')
    .eq('status', 'queued')
    .limit(Number(PROCESS_BATCH_SIZE));

  if (error) {
    console.error('Failed to fetch queued jobs:', error.message);
    process.exit(1);
  }

  if (!jobs?.length) {
    console.log('No queued jobs found.');
    return;
  }

  for (const job of jobs) {
    try {
      await processJob(job);
    } catch (err) {
      await markFailed(job.id, err.message || String(err));
      console.error(`Job ${job.id} failed:`, err.message || err);
    }
  }
}

main();

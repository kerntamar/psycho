"use server";

import { generateContent, extractFromPDF } from "@/lib/gemini";

export async function generateSimilarQuestions(questionId: string) {
  const prompt = `Based on the psychometric question with ID ${questionId}, generate 3 similar questions in the same style, following the logic and difficulty levels. Return in JSON format.`;
  const response = await generateContent(prompt);

  // Clean AI response from potential markdown blocks
  const cleanResponse = response.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleanResponse);
}

export async function processPDFUpload(pdfPath: string) {
  // Logic to fetch PDF from Supabase and call Gemini
  // const prompt = "Extract chapters, explanations, and practice questions from this PDF.";
  // const result = await extractFromPDF(base64, prompt);
  // ... process and save to DB
}

export async function simplifyExplanation(originalText: string) {
  const prompt = `Simplify the following psychometric explanation for a student, while keeping the core mathematical or logical reasoning intact: "${originalText}"`;
  return await generateContent(prompt);
}

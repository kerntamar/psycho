"use server";
;

import { generateContent, extractFromPDF } from "@/lib/gemini";

export async function generateSimilarQuestions(questionId: string) {
  const prompt = `Based on the psychometric question with ID ${questionId}, generate 3 similar questions in the same style, following the logic and difficulty levels. Return in JSON format.`;
  const response = await generateContent(prompt);

  // Clean AI response from potential markdown blocks
  const cleanResponse = response.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleanResponse);
}

export async function processPDFUpload(pdfBase64: string) {
  const prompt = `
    Analyze this psychometric study material PDF.
    Extract the following information in a structured JSON format:
    1. Lesson Title
    2. Subject (one of: "math", "english", "hebrew", "vocabulary")
    3. A simplified, student-friendly explanation of the core concept.
    4. A set of 5 practice questions based on the content.

    Each question should include:
    - Content (the question text)
    - 4 options (A, B, C, D)
    - Correct Answer (the option text)
    - Detailed explanation of the solution
    - Difficulty level (1-5)

    Return ONLY the JSON object.
  `;

  try {
    const response = await extractFromPDF(pdfBase64, prompt);
    const cleanResponse = response.replace(/```json\n?|\n?```/g, "").trim();
    return { success: true, data: JSON.parse(cleanResponse) };
  } catch (error) {
    console.error("AI Extraction Error:", error);
    return { success: false, error: "Failed to extract content from PDF" };
  }
}

export async function simplifyExplanation(originalText: string) {
  const prompt = `Simplify the following psychometric explanation for a student, while keeping the core mathematical or logical reasoning intact: "${originalText}"`;
  return await generateContent(prompt);
}

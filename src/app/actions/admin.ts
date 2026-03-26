"use server";

import { supabase } from "@/lib/supabase";

interface ExtractedQuestion {
  content: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: number;
}

interface ExtractedData {
  lessonTitle: string;
  subject: string;
  explanation: string;
  questions: ExtractedQuestion[];
}

export async function saveExtractedContent(data: ExtractedData) {
  const { lessonTitle, subject, explanation, questions } = data;

  try {
    // Get subject ID
    const { data: subjectData } = await supabase
      .from('subjects')
      .select('id')
      .eq('slug', subject?.toLowerCase() || 'math')
      .single();

    // 1. Save Lesson as pending
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .insert([
        {
          title: lessonTitle,
          subject_id: subjectData?.id,
          explanation: explanation,
          status: 'pending_approval'
        }
      ])
      .select()
      .single();

    if (lessonError) throw lessonError;

    // 2. Save Questions as pending
    if (questions && questions.length > 0) {
      const questionsToInsert = questions.map((q: ExtractedQuestion) => ({
        lesson_id: lesson.id,
        content: q.content,
        options: q.options,
        correct_answer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        status: 'pending_approval'
      }));

      const { error: questionsError } = await supabase
        .from('questions')
        .insert(questionsToInsert);

      if (questionsError) throw questionsError;
    }

    return { success: true, lessonId: lesson.id };
  } catch (error) {
    console.error("Error saving extracted content:", error);
    return { success: false, error: "Failed to save content to database" };
  }
}

export async function getPendingContent() {
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('*, questions(*)')
    .eq('status', 'pending_approval');

  if (lessonsError) {
    console.error("Error fetching pending content:", lessonsError);
    return [];
  }

  return lessons;
}

export async function approveContent(lessonId: string) {
  try {
    // Approve Lesson
    await supabase
      .from('lessons')
      .update({ status: 'approved' })
      .eq('id', lessonId);

    // Approve related questions
    await supabase
      .from('questions')
      .update({ status: 'approved' })
      .eq('lesson_id', lessonId);

    return { success: true };
  } catch (error) {
    console.error("Error approving content:", error);
    return { success: false };
  }
}

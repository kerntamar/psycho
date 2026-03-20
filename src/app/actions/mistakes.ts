"use server";

import { Mistake } from "@/types";
import { supabase } from "@/lib/supabase";

export async function saveMistake(mistake: Omit<Mistake, "id" | "createdAt">) {
  // In a real app, this would save to Supabase
  console.log("Saving mistake:", mistake);

  const { data, error } = await supabase
    .from('mistakes')
    .insert([
      {
        student_id: mistake.studentId,
        question_id: mistake.questionId,
        student_answer: mistake.studentAnswer
      }
    ])
    .select();

  if (error) {
    console.error("Error saving mistake:", error);
    return { success: false, error };
  }

  return { success: true, data };
}

export async function getMistakes(studentId: string) {
  const { data, error } = await supabase
    .from('mistakes')
    .select('*, questions(*)')
    .eq('student_id', studentId);

  if (error) {
    console.error("Error fetching mistakes:", error);
    return [];
  }

  return data;
}

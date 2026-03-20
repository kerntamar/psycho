"use server";

import { supabase } from "@/lib/supabase";

export async function uploadPDF(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) {
    return { success: false, error: "No file provided" };
  }

  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('study-materials')
    .upload(fileName, file);

  if (error) {
    console.error("Upload error:", error);
    return { success: false, error: error.message };
  }

  // After upload, trigger PDF processing pipeline
  // triggerAIProcessing(data.path);

  return { success: true, path: data.path };
}

export async function getPDFUrl(path: string) {
  const { data } = supabase.storage
    .from('study-materials')
    .getPublicUrl(path);

  return data.publicUrl;
}

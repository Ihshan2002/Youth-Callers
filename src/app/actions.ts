"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function submitAnonymousQuery(formData: FormData) {
  try {
    const textContent = formData.get("textContent") as string;
    const audioFile = formData.get("audioFile") as File | null;

    if (!textContent && (!audioFile || audioFile.size === 0)) {
      return { error: "Please provide either text or a voice note." };
    }

    let audioUrl = null;

    // Handle Audio Upload
    if (audioFile && audioFile.size > 0) {
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webm`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("voice-notes")
        .upload(`public/${fileName}`, audioFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return { error: "Failed to upload voice note." };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("voice-notes")
        .getPublicUrl(`public/${fileName}`);
        
      audioUrl = urlData.publicUrl;
    }

    // Insert into database
    const { data, error } = await supabase
      .from("anonymous_submissions")
      .insert([
        {
          text_content: textContent || null,
          audio_url: audioUrl,
          status: "pending",
        },
      ])
      .select("alias_token")
      .single();

    if (error) {
      console.error("Database error:", error);
      return { error: "Failed to submit your query. Please try again." };
    }

    return { success: true, aliasToken: data.alias_token };
  } catch (error) {
    console.error("Supabase network error during submit:", error);
    return { error: "Network error: Unable to connect to Supabase. Ensure your .env.local file is configured." };
  }
}

export async function getVerifiedSolutions() {
  try {
    const { data, error } = await supabase
      .from("public_solutions")
      .select("*")
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Error fetching solutions:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Supabase network error:", error);
    // Return mock data for preview purposes if Supabase is not connected
    return [
      {
        id: "mock-1",
        title: "Mock Solution (Token: User-Preview)",
        content: "This is a placeholder solution because the Supabase environment variables are not configured yet.\n\nTo see real solutions, please configure your .env.local file with your Supabase URL and Anon Key.",
        published_at: new Date().toISOString()
      }
    ];
  }
}

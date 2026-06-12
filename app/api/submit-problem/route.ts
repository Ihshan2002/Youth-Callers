import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with admin privileges for storage/db operations
// In production, you might want to use the server client with cookies if user is authenticated
// but since this is an anonymous submission, standard client is fine.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const nickname = formData.get('nickname') as string || 'Anonymous';
    const text_content = formData.get('text_content') as string;
    const audioFile = formData.get('audio') as File | null;

    const userId = formData.get('user_id') as string || 'anonymous';
    const problemId = crypto.randomUUID();

    // Upload audio if present
    let audio_url = null;
    if (audioFile && audioFile.size > 0) {
      const fileName = `${problemId}-${Date.now()}.webm`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audio_submissions')
        .upload(fileName, audioFile, {
          contentType: 'audio/webm'
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return NextResponse.json({ error: 'Failed to upload audio' }, { status: 500 });
      }

      const { data: publicUrlData } = supabase.storage
        .from('audio_submissions')
        .getPublicUrl(fileName);
        
      audio_url = publicUrlData.publicUrl;
    }

    // Insert into database with generated ID
    const { error: dbError } = await supabase
      .from('anonymous_problems')
      .insert([
        {
          id: problemId,
          user_id: userId,
          nickname,
          text_content,
          audio_url,
          status: 'pending'
        }
      ]);

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 });
    }

    // Create notification for admin
    await supabase.from('notifications').insert([
      {
        recipient_id: 'admin',
        type: 'new_problem',
        reference_id: problemId
      }
    ]);

    return NextResponse.json({ success: true, problemId });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

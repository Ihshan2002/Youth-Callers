import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

type ReplyInput = {
  problemId: string;
  solutionId?: string;
  userId?: string;
  textContent: string;
  scholarName: string;
  audioFile: File | null;
  removeAudio: boolean;
};

type SupabaseError = {
  code?: string;
  message?: string;
};

function getSupabase() {
  return createClient(supabaseUrl, supabaseKey);
}

function isMissingColumnError(error: SupabaseError | null) {
  const message = error?.message || '';
  return error?.code === 'PGRST204' || message.includes('scholar_name') || message.includes('updated_at');
}

function getAudioExtension(file: File) {
  const fromName = file.name.split('.').pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]{2,5}$/.test(fromName)) return fromName;
  if (file.type.includes('mpeg')) return 'mp3';
  if (file.type.includes('wav')) return 'wav';
  if (file.type.includes('ogg')) return 'ogg';
  if (file.type.includes('mp4')) return 'm4a';
  return 'webm';
}

async function uploadReplyAudio(supabase: ReturnType<typeof getSupabase>, problemId: string, file: File) {
  const extension = getAudioExtension(file);
  const fileName = `replies/${problemId}-${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage
    .from('audio_submissions')
    .upload(fileName, file, {
      contentType: file.type || 'audio/webm',
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from('audio_submissions')
    .getPublicUrl(fileName);

  return data.publicUrl;
}

async function parseReplyForm(request: Request): Promise<ReplyInput> {
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    const formData = await request.formData();
    const audio = formData.get('audio');

    return {
      problemId: String(formData.get('problemId') || ''),
      solutionId: formData.get('solutionId') ? String(formData.get('solutionId')) : undefined,
      userId: formData.get('userId') ? String(formData.get('userId')) : undefined,
      textContent: String(formData.get('textContent') || '').trim(),
      scholarName: String(formData.get('scholarName') || 'Youth Callers Scholar').trim() || 'Youth Callers Scholar',
      audioFile: audio instanceof File && audio.size > 0 ? audio : null,
      removeAudio: String(formData.get('removeAudio') || 'false') === 'true',
    };
  }

  const body = await request.json();
  return {
    problemId: String(body.problemId || ''),
    solutionId: body.solutionId ? String(body.solutionId) : undefined,
    userId: body.userId ? String(body.userId) : undefined,
    textContent: String(body.textContent || '').trim(),
    scholarName: String(body.scholarName || 'Youth Callers Scholar').trim() || 'Youth Callers Scholar',
    audioFile: null,
    removeAudio: Boolean(body.removeAudio),
  };
}

async function setProblemStatus(supabase: ReturnType<typeof getSupabase>, problemId: string) {
  const { count, error: countError } = await supabase
    .from('solutions')
    .select('id', { count: 'exact', head: true })
    .eq('problem_id', problemId);

  if (countError) throw countError;

  const { error } = await supabase
    .from('anonymous_problems')
    .update({ status: count && count > 0 ? 'answered' : 'pending' })
    .eq('id', problemId);

  if (error) throw error;
}

export async function POST(request: Request) {
  try {
    const input = await parseReplyForm(request);

    if (!input.problemId || (!input.textContent && !input.audioFile)) {
      return NextResponse.json({ error: 'Add text or a voice response before sending.' }, { status: 400 });
    }

    const supabase = getSupabase();
    const audioUrl = input.audioFile
      ? await uploadReplyAudio(supabase, input.problemId, input.audioFile)
      : null;

    let { data, error: solutionError } = await supabase
      .from('solutions')
      .insert([
        {
          problem_id: input.problemId,
          text_content: input.textContent || null,
          audio_url: audioUrl,
          scholar_name: input.scholarName,
        },
      ])
      .select()
      .single();

    if (solutionError && isMissingColumnError(solutionError)) {
      const fallback = await supabase
        .from('solutions')
        .insert([
          {
            problem_id: input.problemId,
            text_content: input.textContent || null,
            audio_url: audioUrl,
          },
        ])
        .select()
        .single();

      data = fallback.data;
      solutionError = fallback.error;
    }

    if (solutionError) throw solutionError;

    const { error: updateError } = await supabase
      .from('anonymous_problems')
      .update({ status: 'answered' })
      .eq('id', input.problemId);

    if (updateError) throw updateError;

    if (input.userId) {
      await supabase.from('notifications').insert([
        {
          recipient_id: input.userId,
          type: 'new_response',
          reference_id: input.problemId,
        },
      ]);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Submit response error:', error);
    return NextResponse.json({ error: 'Failed to submit response' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const input = await parseReplyForm(request);

    if (!input.problemId || !input.solutionId) {
      return NextResponse.json({ error: 'Missing response details.' }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data: existing, error: fetchError } = await supabase
      .from('solutions')
      .select('text_content, audio_url')
      .eq('id', input.solutionId)
      .eq('problem_id', input.problemId)
      .single();

    if (fetchError) throw fetchError;

    const audioUrl = input.audioFile
      ? await uploadReplyAudio(supabase, input.problemId, input.audioFile)
      : input.removeAudio
        ? null
        : existing.audio_url;
    const finalText = input.textContent || null;

    if (!finalText && !audioUrl) {
      return NextResponse.json({ error: 'A response needs text or a voice note.' }, { status: 400 });
    }

    let { data, error: updateError } = await supabase
      .from('solutions')
      .update({
        text_content: finalText,
        audio_url: audioUrl,
        scholar_name: input.scholarName,
        updated_at: new Date().toISOString(),
      })
      .eq('id', input.solutionId)
      .eq('problem_id', input.problemId)
      .select()
      .single();

    if (updateError && isMissingColumnError(updateError)) {
      const fallback = await supabase
        .from('solutions')
        .update({
          text_content: finalText,
          audio_url: audioUrl,
        })
        .eq('id', input.solutionId)
        .eq('problem_id', input.problemId)
        .select()
        .single();

      data = fallback.data;
      updateError = fallback.error;
    }

    if (updateError) throw updateError;

    await setProblemStatus(supabase, input.problemId);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Update response error:', error);
    return NextResponse.json({ error: 'Failed to update response' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { solutionId, problemId } = await request.json();

    if (!solutionId || !problemId) {
      return NextResponse.json({ error: 'Missing response details.' }, { status: 400 });
    }

    const supabase = getSupabase();
    const { error: deleteError } = await supabase
      .from('solutions')
      .delete()
      .eq('id', solutionId)
      .eq('problem_id', problemId);

    if (deleteError) throw deleteError;

    await setProblemStatus(supabase, String(problemId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete response error:', error);
    return NextResponse.json({ error: 'Failed to delete response' }, { status: 500 });
  }
}

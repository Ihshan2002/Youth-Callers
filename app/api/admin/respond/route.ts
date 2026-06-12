import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { problemId, textContent, userId } = body;

    if (!problemId || !textContent) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert solution
    const { error: solutionError } = await supabase
      .from('solutions')
      .insert([
        {
          problem_id: problemId,
          text_content: textContent,
        }
      ]);

    if (solutionError) throw solutionError;

    // Update problem status
    const { error: updateError } = await supabase
      .from('anonymous_problems')
      .update({ status: 'answered' })
      .eq('id', problemId);

    if (updateError) throw updateError;

    // Create notification for user
    if (userId) {
      await supabase.from('notifications').insert([
        {
          recipient_id: userId,
          type: 'new_response',
          reference_id: problemId
        }
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Submit response error:', error);
    return NextResponse.json({ error: 'Failed to submit response' }, { status: 500 });
  }
}

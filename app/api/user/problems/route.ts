import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

type ProblemWithSolutions = {
  solutions?: { created_at?: string }[] | null;
};

function sortSolutions<T extends ProblemWithSolutions>(problems: T[] | null) {
  return (problems || []).map((problem) => ({
    ...problem,
    solutions: [...(problem.solutions || [])].sort((a, b) =>
      String(a.created_at || '').localeCompare(String(b.created_at || ''))
    ),
  }));
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Fetch user problems and joined solutions
    const { data: problems, error: problemsError } = await supabase
      .from('anonymous_problems')
      .select('*, solutions(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (problemsError) throw problemsError;

    // Mark notifications as read
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('recipient_id', userId)
      .eq('is_read', false);

    return NextResponse.json({ success: true, data: sortSolutions(problems) });
  } catch (error) {
    console.error('Fetch user problems error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

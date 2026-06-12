import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize a supabase client with service role for admin API routes if available, 
// otherwise fallback to anon key for demo purposes.
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

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Fetch all problems with their solutions, ordered by newest
    const { data, error } = await supabase
      .from('anonymous_problems')
      .select('*, solutions(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data: sortSolutions(data) });
  } catch (error) {
    console.error('Fetch problems error:', error);
    return NextResponse.json({ error: 'Failed to fetch problems' }, { status: 500 });
  }
}

import { supabase } from '@/app/lib/supabase';

export async function GET() {
  try {
    // Check Supabase count
    const { count: supabaseCount } = await supabase
      .from('winners')
      .select('*', { count: 'exact', head: true });

    // Check Supabase data
    const { data: supabaseData } = await supabase
      .from('winners')
      .select('*')
      .limit(5);

    return Response.json({
      supabase: {
        totalCount: supabaseCount,
        sampleRecords: supabaseData?.slice(0, 3) || []
      },
      timestamp: new Date().toISOString(),
      message: 'Supabase is still being used by backend. Switch to localStorage to avoid old data.'
    });
  } catch (error) {
    return Response.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

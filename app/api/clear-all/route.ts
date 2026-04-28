import { supabase } from '@/app/lib/supabase';

export async function POST() {
  try {
    // Fetch all records
    const { data: records } = await supabase
      .from('winners')
      .select('id');

    if (records && records.length > 0) {
      const ids = records.map((r: any) => r.id);

      // Delete all records
      const { error: deleteError } = await supabase
        .from('winners')
        .delete()
        .in('id', ids);

      if (deleteError) {
        return Response.json({ error: deleteError.message }, { status: 500 });
      }

      return Response.json({
        success: true,
        message: `Deleted ${ids.length} records from Supabase`,
        deleted: ids.length
      });
    }

    return Response.json({
      success: true,
      message: 'No records to delete',
      deleted: 0
    });
  } catch (error) {
    return Response.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

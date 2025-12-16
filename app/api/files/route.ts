// app/api/files/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('filename, uploaded_at')
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Supabase files error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const files = (data || []).map((doc: any) => doc.filename as string);

    return NextResponse.json({
      success: true,
      files,
    });
  } catch (error) {
    console.error('Files API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch files list' },
      { status: 500 },
    );
  }
}

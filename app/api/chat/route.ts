// app/api/chat/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ragAssistant } from '@/lib/llm';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    const reply = await ragAssistant({ message });

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    return NextResponse.json(
      { error: err.message || 'Unknown error' },
      { status: 500 },
    );
  }
}

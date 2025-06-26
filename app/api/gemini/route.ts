import { NextResponse } from 'next/server';
import { getGeminiResponse } from "@/scripts/aistudio";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.prompt || typeof body.prompt !== 'string') {
      return NextResponse.json({ error: "Missing or invalid prompt" }, { status: 400 });
    }

    const result = await getGeminiResponse(body.prompt);
    return NextResponse.json({ result });

  } catch (error: any) {
    console.error('[GEMINI_API_ERROR]', error.message || error);
    console.error(error.stack || '');
    return NextResponse.json({ error: 'Gemini generation failed' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { level, message, data } = body;

    const logData = data ? JSON.stringify(data, null, 2) : '';

    // Log to the server console (the terminal where `npm run dev` is running)
    console.log(`[CLIENT LOG - ${level.toUpperCase()}]: ${message}`, logData);

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('[LOGGING API ERROR]:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

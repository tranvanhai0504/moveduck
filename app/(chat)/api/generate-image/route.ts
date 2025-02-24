import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { image_request } = await req.json();
    
    const response = await fetch('https://api.ideogram.ai/generate', {
      method: 'POST',
      headers: {
        'Api-Key': process.env.IDEOGRAM_SECRET || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_request: image_request
      })
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
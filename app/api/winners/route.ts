import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for Vercel
let winnersData: any[] = [];

export async function GET() {
  return NextResponse.json(winnersData);
}

export async function POST(request: NextRequest) {
  try {
    const winner = await request.json();
    winnersData.push(winner);
    return NextResponse.json(winner, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save winner' }, { status: 500 });
  }
}

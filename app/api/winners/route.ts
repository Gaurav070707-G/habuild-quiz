import { NextRequest, NextResponse } from 'next/server';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export const revalidate = 10; // Cache for 10 seconds

export async function GET() {
  try {
    console.log('[API] Fetching winners from Firebase...');
    const q = query(collection(db, 'winners'));
    const snapshot = await getDocs(q);

    const winners: any[] = [];
    snapshot.forEach((doc) => {
      winners.push(doc.data());
    });

    console.log(`[API] Fetched ${winners.length} winners from Firebase`);

    return NextResponse.json(winners, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error('[API] Error fetching winners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch winners', winners: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const winner = await request.json();
    const { addDoc } = await import('firebase/firestore');

    await addDoc(collection(db, 'winners'), {
      ...winner,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(winner, { status: 201 });
  } catch (error) {
    console.error('[API] Error saving winner:', error);
    return NextResponse.json({ error: 'Failed to save winner' }, { status: 500 });
  }
}

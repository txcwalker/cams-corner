import { NextResponse } from 'next/server';
import { getStandings } from '@/lib/football';

export async function GET() {
  try {
    const standings = await getStandings();
    return NextResponse.json(standings);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

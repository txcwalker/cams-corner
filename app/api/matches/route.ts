import { NextResponse } from 'next/server';
import { getRecentMatches, getUpcomingMatches, getTodayMatches, getScoresBarMatches } from '@/lib/football';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') ?? 'upcoming';
  try {
    let matches;
    if (type === 'recent') matches = await getRecentMatches(3);
    else if (type === 'today') matches = await getTodayMatches();
    else if (type === 'bar') matches = await getScoresBarMatches();
    else matches = await getUpcomingMatches(7);
    return NextResponse.json(matches);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

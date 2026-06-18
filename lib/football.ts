import { centralToday, centralYesterday, centralFuture } from './dates';

const BASE = process.env.FOOTBALL_API_BASE!;
const KEY = process.env.FOOTBALL_API_KEY!;
const WC = process.env.WORLD_CUP_ID!;

async function fetchAPI(path: string, revalidate = 60) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'X-Auth-Token': KEY },
    next: { revalidate },
  });
  if (!res.ok) throw new Error(`football-data.org ${res.status}: ${path}`);
  return res.json();
}

export async function getStandings() {
  const data = await fetchAPI(`/competitions/${WC}/standings`);
  return data.standings ?? [];
}

export async function getMatches(dateFrom?: string, dateTo?: string) {
  const params = new URLSearchParams();
  if (dateFrom) params.set('dateFrom', dateFrom);
  if (dateTo) params.set('dateTo', dateTo);
  const qs = params.toString() ? `?${params}` : '';
  const data = await fetchAPI(`/competitions/${WC}/matches${qs}`);
  return data.matches ?? [];
}

/** Matches for a specific matchday number */
export async function getMatchdayMatches(matchday: number) {
  const data = await fetchAPI(`/competitions/${WC}/matches?matchday=${matchday}`, 300);
  return data.matches ?? [];
}

/** Current matchday number from the competition season */
export async function getCurrentMatchday(): Promise<number> {
  const data = await fetchAPI(`/competitions/${WC}`, 300);
  return data.currentSeason?.currentMatchday ?? 1;
}

/** All matches for the current matchday (for the ticker) */
export async function getCurrentMatchdayMatches() {
  const matchday = await getCurrentMatchday();
  return getMatchdayMatches(matchday);
}

/** Yesterday + today in Central Time.
 *  Fetches through tomorrow UTC so late Central games (e.g. 8pm CT = 1am UTC next day)
 *  are included. The ScoresBar component does Central-time bucketing client-side.
 */
export async function getScoresBarMatches() {
  // Fetch through +2 days UTC so late Central games (e.g. 8pm CT = 1am UTC next day)
  // on both today and tomorrow are included. ScoresBar buckets by Central time client-side.
  return getMatches(centralYesterday(), centralFuture(2));
}

/** Today's matches in Central Time */
export async function getTodayMatches() {
  const today = centralToday();
  return getMatches(today, today);
}

/** Upcoming matches in Central Time (next N days, not including today) */
export async function getUpcomingMatches(days = 7) {
  const from = centralToday();
  const to = centralFuture(days);
  return getMatches(from, to);
}

/** Recent finished matches in Central Time */
export async function getRecentMatches(days = 3) {
  const from = centralFuture(-days);
  const to = centralYesterday();
  return getMatches(from, to);
}

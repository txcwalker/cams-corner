const TZ = 'America/Chicago';

/** Returns a YYYY-MM-DD string for a UTC date string, interpreted in Central Time */
export function toCentralDateStr(utcDate: string): string {
  return new Date(utcDate).toLocaleDateString('en-CA', { timeZone: TZ }); // en-CA gives YYYY-MM-DD
}

/** Returns today's date as YYYY-MM-DD in Central Time */
export function centralToday(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: TZ });
}

/** Returns yesterday's date as YYYY-MM-DD in Central Time */
export function centralYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString('en-CA', { timeZone: TZ });
}

/** Returns a date N days from now as YYYY-MM-DD in Central Time */
export function centralFuture(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-CA', { timeZone: TZ });
}

/** Bucket a match into 'yesterday' | 'today' | 'upcoming' | 'past' based on Central Time */
export function bucketMatch(utcDate: string): 'yesterday' | 'today' | 'upcoming' | 'past' {
  const matchDay = toCentralDateStr(utcDate);
  const today = centralToday();
  const yesterday = centralYesterday();
  if (matchDay === today) return 'today';
  if (matchDay === yesterday) return 'yesterday';
  if (matchDay > today) return 'upcoming';
  return 'past';
}

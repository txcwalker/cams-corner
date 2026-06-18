import { getStandings } from '@/lib/football';
import StandingsTable from '@/components/StandingsTable';

export const revalidate = 60;

export default async function StandingsPage() {
  let standings: Awaited<ReturnType<typeof getStandings>> = [];
  try {
    standings = await getStandings();
  } catch {
    // handled below
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Group Standings</h2>
      {standings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {standings.map((group: Parameters<typeof StandingsTable>[0] & { stage: string; group?: string }) => (
            <div key={group.group ?? group.stage} className="bg-gray-900 rounded-lg p-4">
              <StandingsTable group={group.group ?? group.stage} table={group.table} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">Standings unavailable — check back once the group stage begins.</p>
      )}
    </div>
  );
}

type Team = {
  position: number;
  team: { name: string; crest?: string };
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
};

export default function StandingsTable({ table, group }: { table: Team[]; group: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-yellow-400 font-bold text-xs uppercase mb-1 tracking-wider">{group}</h3>
      <table className="w-full text-xs text-gray-300">
        <thead>
          <tr className="text-gray-500 border-b border-gray-700">
            <th className="text-left py-1 w-6">#</th>
            <th className="text-left py-1">Team</th>
            <th className="text-center py-1">P</th>
            <th className="text-center py-1">W</th>
            <th className="text-center py-1">D</th>
            <th className="text-center py-1">L</th>
            <th className="text-center py-1">GD</th>
            <th className="text-center py-1 font-bold text-gray-300">Pts</th>
          </tr>
        </thead>
        <tbody>
          {table.map((row) => (
            <tr key={row.team.name} className="border-b border-gray-800 hover:bg-gray-800/50">
              <td className="py-1 text-gray-500">{row.position}</td>
              <td className="py-1 font-medium text-white">{row.team.name}</td>
              <td className="text-center py-1">{row.playedGames}</td>
              <td className="text-center py-1">{row.won}</td>
              <td className="text-center py-1">{row.draw}</td>
              <td className="text-center py-1">{row.lost}</td>
              <td className="text-center py-1">{row.goalsFor - row.goalsAgainst}</td>
              <td className="text-center py-1 font-bold text-white">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

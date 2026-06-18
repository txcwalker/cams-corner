type Match = {
  id: number;
  utcDate: string;
  status: string;
  homeTeam: { name: string; crest?: string };
  awayTeam: { name: string; crest?: string };
  score: { fullTime: { home: number | null; away: number | null } };
  stage: string;
  group?: string;
};

export default function MatchCard({ match, venue }: { match: Match; venue?: string }) {
  const date = new Date(match.utcDate);
  const isFinished = match.status === 'FINISHED';
  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';

  return (
    <div className="bg-gray-800 rounded-lg p-3 flex flex-col gap-1">
      <div className="flex justify-between items-center text-xs text-gray-400">
        <span>{match.stage.replace(/_/g, ' ')}{match.group ? ` · ${match.group}` : ''}</span>
        {isLive && <span className="text-green-400 font-bold animate-pulse">LIVE</span>}
        {!isLive && (
          <span>{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 mt-1">
        <span className="text-white font-medium text-sm flex-1">{match.homeTeam.name}</span>
        <span className="text-yellow-400 font-bold text-lg min-w-[3rem] text-center">
          {isFinished || isLive
            ? `${match.score.fullTime.home ?? 0} – ${match.score.fullTime.away ?? 0}`
            : 'vs'}
        </span>
        <span className="text-white font-medium text-sm flex-1 text-right">{match.awayTeam.name}</span>
      </div>
      {venue && (
        <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
          <span>📍</span>
          <span>{venue}</span>
        </div>
      )}
    </div>
  );
}

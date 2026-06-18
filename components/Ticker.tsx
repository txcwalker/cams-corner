'use client';

const TZ = 'America/Chicago';

type Match = {
  id: number;
  status: string;
  utcDate: string;
  stage: string;
  matchday?: number;
  homeTeam: { name: string; shortName?: string };
  awayTeam: { name: string; shortName?: string };
  score: { fullTime: { home: number | null; away: number | null } };
};

const STAGE_LABELS: Record<string, string> = {
  GROUP_STAGE: 'Group Stage',
  ROUND_OF_32: 'Round of 32',
  ROUND_OF_16: 'Round of 16',
  QUARTER_FINALS: 'Quarter Finals',
  SEMI_FINALS: 'Semi Finals',
  THIRD_PLACE: '3rd Place',
  FINAL: 'Final',
};

function teamName(t: Match['homeTeam']) {
  return t.shortName ?? t.name.split(' ').pop() ?? t.name;
}

export default function Ticker({ matches }: { matches: Match[] }) {
  if (!matches.length) return null;

  // Derive label from stage + matchday
  const first = matches[0];
  const stageLabel = STAGE_LABELS[first.stage] ?? first.stage.replace(/_/g, ' ');
  const label = first.stage === 'GROUP_STAGE' && first.matchday
    ? `${stageLabel} · Round ${first.matchday}`
    : stageLabel;

  const items = matches.map((m) => {
    const isLive = m.status === 'IN_PLAY' || m.status === 'PAUSED';
    const isFinished = m.status === 'FINISHED';
    const date = new Date(m.utcDate);
    const dateStr = date.toLocaleDateString('en-US', { timeZone: TZ, month: 'short', day: 'numeric' });
    const time = date.toLocaleTimeString('en-US', { timeZone: TZ, hour: 'numeric', minute: '2-digit' });
    const score = isFinished || isLive
      ? `${m.score.fullTime.home ?? 0}–${m.score.fullTime.away ?? 0}`
      : `${dateStr} ${time}`;
    return `${isLive ? '🔴 ' : ''}${teamName(m.homeTeam)} ${score} ${teamName(m.awayTeam)}`;
  });

  // Duplicate for seamless loop
  const display = [...items, ...items];

  return (
    <div className="bg-gray-950 border-t border-gray-800 overflow-hidden h-8 flex items-center">
      <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest px-3 border-r border-gray-700 h-full flex items-center shrink-0 bg-gray-900 whitespace-nowrap">
        {label}
      </span>
      <div className="relative flex-1 overflow-hidden">
        <div className="flex gap-8 animate-ticker whitespace-nowrap">
          {display.map((item, i) => (
            <span key={i} className="text-gray-300 text-xs shrink-0">
              {item}
              <span className="text-gray-600 ml-8">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

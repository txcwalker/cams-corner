import { getMatches } from '@/lib/football';

export const revalidate = 300;

type Match = {
  id: number;
  stage: string;
  utcDate: string;
  status: string;
  homeTeam: { name: string; shortName?: string };
  awayTeam: { name: string; shortName?: string };
  score: { fullTime: { home: number | null; away: number | null } };
};

const STAGE_ORDER = [
  'ROUND_OF_32',
  'ROUND_OF_16',
  'QUARTER_FINALS',
  'SEMI_FINALS',
  'FINAL',
];

const STAGE_LABELS: Record<string, string> = {
  ROUND_OF_32:   'Round of 32',
  ROUND_OF_16:   'Round of 16',
  QUARTER_FINALS: 'QF',
  SEMI_FINALS:   'SF',
  FINAL:         'Final',
};

function short(t: Match['homeTeam']) {
  return t.shortName ?? t.name.split(' ').slice(-1)[0];
}

function BracketTeamRow({
  name,
  score,
  won,
  tbd,
}: {
  name: string;
  score: number | null;
  won: boolean;
  tbd: boolean;
}) {
  return (
    <div className={`flex items-center justify-between px-2 py-1.5 text-xs ${won ? 'bg-gray-600' : ''}`}>
      <span className={`truncate max-w-[90px] ${tbd ? 'text-gray-600 italic' : won ? 'text-white font-semibold' : 'text-gray-300'}`}>
        {name}
      </span>
      {score !== null && (
        <span className={`ml-2 font-bold shrink-0 ${won ? 'text-yellow-400' : 'text-gray-400'}`}>{score}</span>
      )}
    </div>
  );
}

function BracketMatch({ match }: { match: Match | null }) {
  if (!match) {
    return (
      <div className="w-36 rounded overflow-hidden border border-gray-800 bg-gray-900 text-xs">
        <div className="flex items-center justify-between px-2 py-1.5 border-b border-gray-800">
          <span className="text-gray-700 italic">TBD</span>
        </div>
        <div className="flex items-center justify-between px-2 py-1.5">
          <span className="text-gray-700 italic">TBD</span>
        </div>
      </div>
    );
  }

  const isFinished = match.status === 'FINISHED';
  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';
  const hs = match.score.fullTime.home;
  const as = match.score.fullTime.away;
  const homeWon = isFinished && hs !== null && as !== null && hs > as;
  const awayWon = isFinished && hs !== null && as !== null && as > hs;
  const homeTbd = !match.homeTeam.name || match.homeTeam.name === 'TBD';
  const awayTbd = !match.awayTeam.name || match.awayTeam.name === 'TBD';

  const date = new Date(match.utcDate).toLocaleDateString('en-US', {
    timeZone: 'America/Chicago',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className={`w-36 rounded overflow-hidden border ${isLive ? 'border-green-600' : 'border-gray-700'} bg-gray-900`}>
      {isLive && (
        <div className="bg-green-700 text-white text-center text-xs py-0.5 font-bold tracking-wider">LIVE</div>
      )}
      {!isLive && !isFinished && (
        <div className="bg-gray-800 text-gray-500 text-center text-xs py-0.5">{date}</div>
      )}
      <div className="border-b border-gray-800">
        <BracketTeamRow
          name={homeTbd ? 'TBD' : short(match.homeTeam)}
          score={isFinished || isLive ? hs : null}
          won={homeWon}
          tbd={homeTbd}
        />
      </div>
      <BracketTeamRow
        name={awayTbd ? 'TBD' : short(match.awayTeam)}
        score={isFinished || isLive ? as : null}
        won={awayWon}
        tbd={awayTbd}
      />
    </div>
  );
}

// Column with vertical connectors between pairs
function BracketColumn({
  matches,
  label,
  isFinal,
}: {
  matches: (Match | null)[];
  label: string;
  isFinal?: boolean;
}) {
  const pairs: (Match | null)[][] = isFinal
    ? [[matches[0]]]
    : Array.from({ length: Math.ceil(matches.length / 2) }, (_, i) => [
        matches[i * 2] ?? null,
        matches[i * 2 + 1] ?? null,
      ]);

  return (
    <div className="flex flex-col items-center gap-0 shrink-0">
      <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider mb-3 text-center">
        {label}
      </span>
      <div className="flex flex-col gap-6">
        {pairs.map((pair, pi) => (
          <div key={pi} className="flex flex-col items-center relative">
            {pair.map((m, mi) => (
              <div key={mi} className="relative flex items-center">
                <BracketMatch match={m} />
                {/* right connector arm */}
                {!isFinal && (
                  <div className="w-4 border-t border-gray-700 absolute -right-4 top-1/2" />
                )}
              </div>
            ))}
            {/* vertical bar joining the pair */}
            {!isFinal && pair.length === 2 && (
              <div
                className="absolute right-[-16px] border-r border-gray-700"
                style={{ top: '25%', bottom: '25%' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function BracketPage() {
  let matches: Match[] = [];
  try {
    const from = new Date();
    from.setDate(from.getDate() - 30);
    const to = new Date();
    to.setDate(to.getDate() + 60);
    const all: Match[] = await getMatches(
      from.toISOString().slice(0, 10),
      to.toISOString().slice(0, 10)
    );
    matches = all.filter((m) => STAGE_ORDER.includes(m.stage));
  } catch { /* handled below */ }

  const byStage: Record<string, (Match | null)[]> = {};
  for (const stage of STAGE_ORDER) {
    byStage[stage] = matches.filter((m) => m.stage === stage);
  }

  const hasKnockout = matches.length > 0;

  // Pad stages to expected sizes
  const STAGE_SIZES: Record<string, number> = {
    ROUND_OF_32: 16,
    ROUND_OF_16: 8,
    QUARTER_FINALS: 4,
    SEMI_FINALS: 2,
    FINAL: 1,
  };
  for (const stage of STAGE_ORDER) {
    const size = STAGE_SIZES[stage];
    while (byStage[stage].length < size) byStage[stage].push(null);
  }

  const activeStages = STAGE_ORDER.filter((s) => byStage[s].some((m) => m !== null));

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Knockout Bracket</h2>

      {!hasKnockout ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🏆</p>
          <p className="text-gray-400 text-lg font-medium">Knockout stage hasn&apos;t started yet</p>
          <p className="text-gray-600 text-sm mt-1">Check back once the group stage concludes</p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-6">
          <div className="flex gap-8 min-w-max items-start pt-2">
            {activeStages.map((stage) => (
              <BracketColumn
                key={stage}
                label={STAGE_LABELS[stage]}
                matches={byStage[stage]}
                isFinal={stage === 'FINAL'}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

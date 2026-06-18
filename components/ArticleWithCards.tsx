import { remark } from 'remark';
import html from 'remark-html';
import MatchCard from './MatchCard';

type ApiMatch = {
  id: number;
  utcDate: string;
  status: string;
  homeTeam: { name: string; crest?: string };
  awayTeam: { name: string; crest?: string };
  score: { fullTime: { home: number | null; away: number | null } };
  stage: string;
  group?: string;
};

// Loose match: checks if both team name tokens appear in the heading
function matchHeadingToGame(heading: string, match: ApiMatch): boolean {
  const h = heading.toLowerCase();
  const home = match.homeTeam.name.toLowerCase();
  const away = match.awayTeam.name.toLowerCase();

  // Each team: try full name, then each word
  const teamMatches = (team: string) => {
    if (h.includes(team)) return true;
    return team.split(' ').some((word) => word.length > 3 && h.includes(word));
  };

  return teamMatches(home) && teamMatches(away);
}

type Section = { heading: string; body: string };

function splitIntoSections(markdown: string): { preamble: string; sections: Section[] } {
  const lines = markdown.split('\n');
  const sections: Section[] = [];
  let preamble = '';
  let current: Section | null = null;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (current) sections.push(current);
      current = { heading: line.slice(3).trim(), body: '' };
    } else if (current) {
      current.body += line + '\n';
    } else {
      preamble += line + '\n';
    }
  }
  if (current) sections.push(current);
  return { preamble: preamble.trim(), sections };
}

async function toHtml(md: string) {
  const result = await remark().use(html).process(md);
  return result.toString();
}

const PROSE =
  'prose prose-invert prose-sm max-w-none ' +
  'prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4 ' +
  'prose-strong:text-white prose-hr:border-gray-700 prose-hr:my-5';

export default async function ArticleWithCards({
  content,
  matches,
  venues,
}: {
  content: string;
  matches: ApiMatch[];
  venues?: Record<string, string>;
}) {
  const { preamble, sections } = splitIntoSections(content);
  const preambleHtml = preamble ? await toHtml(preamble) : null;

  const rendered = await Promise.all(
    sections.map(async (s) => {
      const bodyHtml = await toHtml(s.body);
      const match = matches.find((m) => matchHeadingToGame(s.heading, m));
      const venue = match && venues
        ? venues[`${match.homeTeam.name} vs ${match.awayTeam.name}`] ??
          venues[`${match.awayTeam.name} vs ${match.homeTeam.name}`]
        : undefined;
      return { heading: s.heading, bodyHtml, match, venue };
    })
  );

  return (
    <div>
      {preambleHtml && (
        <div className={PROSE} dangerouslySetInnerHTML={{ __html: preambleHtml }} />
      )}

      {rendered.map((s, i) => (
        <div key={i} className="mt-6">
          {s.match ? (
            <div className="mb-3">
              <MatchCard match={s.match} venue={s.venue} />
            </div>
          ) : (
            <h3 className="text-base font-bold text-white mb-3 border-l-2 border-yellow-400 pl-3">
              {s.heading}
            </h3>
          )}
          <div className={PROSE} dangerouslySetInnerHTML={{ __html: s.bodyHtml }} />
        </div>
      ))}
    </div>
  );
}

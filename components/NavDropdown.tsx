'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const STATS_LINKS = [
  { href: '/standings', label: 'Standings' },
  { href: '/bracket', label: 'Bracket' },
  { href: '/calendar', label: 'Calendar' },
];

const POSTS_LINKS = [
  { href: '/reviews', label: 'Reviews' },
  { href: '/previews', label: 'Previews' },
];

function Dropdown({
  label,
  links,
  pathname,
}: {
  label: string;
  links: { href: string; label: string }[];
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = links.find((l) => l.href === pathname);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors ${
          active ? 'text-white bg-gray-700' : 'text-gray-300 hover:text-white hover:bg-gray-800'
        }`}
      >
        {active?.label ?? label}
        <svg
          className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-2.5 text-sm transition-colors ${
                pathname === link.href
                  ? 'bg-gray-700 text-white font-medium'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NavDropdowns() {
  const pathname = usePathname();
  return (
    <>
      <Dropdown label="Posts" links={POSTS_LINKS} pathname={pathname} />
      <Dropdown label="Today" links={STATS_LINKS} pathname={pathname} />
    </>
  );
}

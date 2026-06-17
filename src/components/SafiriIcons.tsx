import type { ReactNode } from 'react';

type IconProps = {
  className?: string;
};

function Svg({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" fill="none">
      {children}
    </svg>
  );
}

export function BrandIcon({ className = 'brand-icon' }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="17.5" cy="6.5" r="3.2" fill="currentColor" opacity="0.92" />
      <path
        d="M12 20c-2.8-3.6-4.5-6.4-4.5-9a4.5 4.5 0 1 1 9 0c0 2.6-1.7 5.4-4.5 9Z"
        fill="currentColor"
      />
      <path
        d="M12 11.2c-1.6 2.2-2.7 4.1-3.2 5.8M12 11.2c1.6 2.2 2.7 4.1 3.2 5.8M9.2 20h5.6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.4"
      />
    </Svg>
  );
}

const navPaths = {
  home: 'M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z',
  destinations:
    'M12 21s6.2-4.4 6.2-10.1a6.2 6.2 0 1 0-12.4 0C5.8 16.6 12 21 12 21Zm0-7.8a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4Z',
  itineraries:
    'M4 7.5h16M4 12h11M4 16.5h7M17.5 11l2.5 1.5-2.5 1.5v-3Z',
  community: 'M4 4h16v11H5.17L4 16.17V4Zm2 2v7h12V6H6Zm3 9h6l2 2H4v-2h5Z',
  plan: 'M12 3l1.4 3.6L17 8l-3.6 1.4L12 13l-1.4-3.6L7 8l3.6-1.4L12 3Zm6.5 9.5.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z',
} as const;

export type NavIconName = keyof typeof navPaths;

export function NavIcon({ name, className = 'nav-icon' }: IconProps & { name: NavIconName }) {
  return (
    <Svg className={className}>
      <path d={navPaths[name]} fill="currentColor" />
    </Svg>
  );
}

const provincePaths = {
  Central: 'M12 3 4 20h16L12 3Zm0 6.2a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2Z',
  Coast: 'M3 14c2.2 1.2 4.4 1.2 6.6 0 2.2-1.2 4.4-1.2 6.6 0 2.2 1.2 4.4 1.2 6.8 0',
  Eastern: 'M12 4a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 14v3M8.5 19.5h7',
  Nairobi: 'M5 20V9l7-4 7 4v11H5Zm7-13v13',
  'North Eastern': 'M4 18h16M7 14l3-8 3 6 2-4 3 6',
  Nyanza: 'M4 16c2.5-2 5-2.5 8-2.5s5.5.5 8 2.5M6 12c2-1.5 4-2 6-2s4 .5 6 2',
  'Rift Valley': 'M4 18 9 6l3 4 3-5 5 13',
  Western: 'M4 20c2-4 4-8 8-8s6 4 8 8',
  All: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 0v18M3 12h18',
} as const;

export type ProvinceIconName = keyof typeof provincePaths;

export function ProvinceIcon({
  name,
  className = 'province-icon',
}: IconProps & { name: ProvinceIconName }) {
  return (
    <Svg className={className}>
      <path
        d={provincePaths[name]}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </Svg>
  );
}

// Original illustration set. Scenes only — never faces or figures — so the
// pictures stay respectful across every ayah they are matched to.
// Palette uses the app's CSS variables so they work in light and dark mode.

import type { Theme } from "@/data/themes";

const T = "var(--teal)";
const G = "var(--gold)";
const S = "var(--teal-soft)";
const GS = "var(--gold-soft)";
const P = "var(--paper-2)";
const I = "var(--ink-3)";

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg
      viewBox="0 0 320 180"
      role="img"
      aria-label={label}
      className="h-auto w-full rounded-xl"
      style={{ background: P }}
    >
      {children}
    </svg>
  );
}

const scenes: Record<Theme, (label: string) => React.ReactElement> = {
  sky: (l) => (
    <Frame label={l}>
      <rect width="320" height="180" fill="#16302e" />
      {[
        [30, 30, 2],
        [70, 60, 1.5],
        [120, 25, 2.5],
        [180, 70, 1.5],
        [230, 35, 2],
        [280, 60, 1.5],
        [60, 120, 1.5],
        [150, 130, 2],
        [260, 120, 1.5],
        [300, 20, 1.2],
      ].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#f3d791" />
      ))}
      <circle cx="220" cy="80" r="34" fill="#f3d791" />
      <circle cx="234" cy="72" r="32" fill="#16302e" />
      <path d="M0 160 Q80 130 160 160 T320 160 V180 H0Z" fill="#1f6f66" />
    </Frame>
  ),
  dawn: (l) => (
    <Frame label={l}>
      <defs>
        <linearGradient id="dawnSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7e9c6" />
          <stop offset="1" stopColor="#f3c27a" />
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#dawnSky)" />
      <circle cx="160" cy="130" r="46" fill={G} />
      {[0, 30, 60, 90, 120, 150].map((a) => (
        <line
          key={a}
          x1="160"
          y1="130"
          x2={160 + 95 * Math.cos((a * Math.PI) / 180)}
          y2={130 - 95 * Math.sin((a * Math.PI) / 180)}
          stroke="#f3d791"
          strokeWidth="3"
          opacity="0.6"
        />
      ))}
      <path d="M0 140 L60 100 L110 135 L170 95 L230 130 L280 105 L320 135 V180 H0Z" fill="#1f6f66" />
    </Frame>
  ),
  rain: (l) => (
    <Frame label={l}>
      <rect width="320" height="180" fill="#dfeeea" />
      <ellipse cx="110" cy="50" rx="60" ry="26" fill="#ffffff" />
      <ellipse cx="150" cy="42" rx="48" ry="30" fill="#ffffff" />
      <ellipse cx="200" cy="55" rx="55" ry="24" fill="#ffffff" />
      {[90, 120, 150, 180, 210].map((x, i) => (
        <line key={x} x1={x} y1={85 + (i % 2) * 8} x2={x - 6} y2={110 + (i % 2) * 8} stroke={T} strokeWidth="3" strokeLinecap="round" />
      ))}
      <rect y="135" width="320" height="45" fill="#1f6f66" />
      {[40, 90, 140, 190, 240, 290].map((x) => (
        <g key={x}>
          <path d={`M${x} 135 Q${x - 10} 118 ${x} 110 Q${x + 10} 118 ${x} 135`} fill="#5fbfae" />
          <path d={`M${x} 135 Q${x + 8} 125 ${x + 14} 118`} stroke="#5fbfae" strokeWidth="3" fill="none" />
        </g>
      ))}
    </Frame>
  ),
  mountains: (l) => (
    <Frame label={l}>
      <rect width="320" height="180" fill="#e3f0ec" />
      <path d="M0 150 L70 60 L120 120 L190 40 L260 120 L320 80 V180 H0Z" fill="#1f6f66" />
      <path d="M160 70 L190 40 L220 72 L205 70 L190 55 L175 72Z" fill="#ffffff" />
      <path d="M150 180 Q160 140 190 125 Q220 110 230 70" stroke={G} strokeWidth="5" fill="none" strokeDasharray="10 8" strokeLinecap="round" />
    </Frame>
  ),
  sea: (l) => (
    <Frame label={l}>
      <rect width="320" height="180" fill="#e3f0ec" />
      <circle cx="260" cy="45" r="22" fill={G} />
      <path d="M110 120 L210 120 L195 145 L125 145Z" fill="#8a5a1e" />
      <rect x="158" y="60" width="4" height="60" fill="#8a5a1e" />
      <path d="M162 62 L205 112 L162 112Z" fill="#f7e9c6" />
      <path d="M0 150 Q40 135 80 150 T160 150 T240 150 T320 150 V180 H0Z" fill="#1f6f66" />
      <path d="M0 165 Q40 150 80 165 T160 165 T240 165 T320 165" stroke="#5fbfae" strokeWidth="3" fill="none" />
    </Frame>
  ),
  tree: (l) => (
    <Frame label={l}>
      <rect width="320" height="180" fill="#f7e9c6" />
      <rect x="150" y="100" width="20" height="60" rx="4" fill="#8a5a1e" />
      <circle cx="160" cy="80" r="48" fill="#1f6f66" />
      <circle cx="120" cy="95" r="30" fill="#2a8a7e" />
      <circle cx="200" cy="95" r="30" fill="#2a8a7e" />
      {[
        [135, 70],
        [175, 60],
        [190, 100],
        [125, 110],
        [160, 105],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="6" fill={G} />
      ))}
      <rect y="160" width="320" height="20" fill="#2a8a7e" />
    </Frame>
  ),
  bee: (l) => (
    <Frame label={l}>
      <rect width="320" height="180" fill="#f7e9c6" />
      {[
        [60, 120],
        [130, 140],
        [250, 125],
      ].map(([x, y]) => (
        <g key={`${x}`}>
          <rect x={x - 3} y={y} width="6" height="40" fill="#2a8a7e" />
          <circle cx={x} cy={y} r="16" fill="#e8a0b4" />
          <circle cx={x} cy={y} r="6" fill={G} />
        </g>
      ))}
      <g transform="translate(180 60)">
        <ellipse cx="0" cy="0" rx="26" ry="16" fill={G} />
        <rect x="-10" y="-16" width="7" height="32" fill="#16302e" />
        <rect x="6" y="-16" width="7" height="32" fill="#16302e" />
        <ellipse cx="-6" cy="-20" rx="14" ry="7" fill="#ffffff" opacity="0.8" />
        <ellipse cx="10" cy="-20" rx="14" ry="7" fill="#ffffff" opacity="0.8" />
      </g>
      <path d="M100 40 q30 -20 60 10" stroke={I} strokeWidth="2" strokeDasharray="4 4" fill="none" />
    </Frame>
  ),
  ant: (l) => (
    <Frame label={l}>
      <rect width="320" height="180" fill="#f3ecdc" />
      <rect y="130" width="320" height="50" fill="#c8a06a" />
      <path d="M90 130 Q160 90 230 130Z" fill="#a67c47" />
      {[70, 150, 230].map((x) => (
        <g key={x} transform={`translate(${x} 122)`}>
          <ellipse cx="0" cy="0" rx="9" ry="6" fill="#16302e" />
          <ellipse cx="14" cy="-2" rx="7" ry="5" fill="#16302e" />
          <ellipse cx="25" cy="-3" rx="6" ry="5" fill="#16302e" />
          {[-4, 4, 12].map((lx) => (
            <path key={lx} d={`M${lx} 2 l-4 8 M${lx} 2 l4 8`} stroke="#16302e" strokeWidth="1.5" />
          ))}
        </g>
      ))}
    </Frame>
  ),
  elephant: (l) => (
    <Frame label={l}>
      <rect width="320" height="180" fill="#f7e9c6" />
      <rect y="140" width="320" height="40" fill="#c8a06a" />
      <ellipse cx="170" cy="100" rx="70" ry="48" fill="#8a9a96" />
      <circle cx="105" cy="92" r="36" fill="#8a9a96" />
      <path d="M78 110 q-20 30 -5 50" stroke="#8a9a96" strokeWidth="16" fill="none" strokeLinecap="round" />
      <ellipse cx="80" cy="80" rx="20" ry="26" fill="#74837f" />
      {[130, 160, 195, 225].map((x) => (
        <rect key={x} x={x} y="130" width="18" height="30" rx="6" fill="#74837f" />
      ))}
      {[
        [40, 30],
        [75, 48],
        [250, 28],
        [285, 50],
        [120, 22],
      ].map(([x, y]) => (
        <path
          key={`${x}${y}`}
          d={`M${x - 8} ${y} q8 -8 16 0 M${x + 8} ${y} q8 -8 16 0`}
          stroke="#16302e"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </Frame>
  ),
  book: (l) => (
    <Frame label={l}>
      <rect width="320" height="180" fill="#e3f0ec" />
      <path d="M60 60 Q110 45 160 60 L160 150 Q110 135 60 150Z" fill="#ffffff" stroke={T} strokeWidth="3" />
      <path d="M260 60 Q210 45 160 60 L160 150 Q210 135 260 150Z" fill="#ffffff" stroke={T} strokeWidth="3" />
      {[80, 95, 110, 125].map((y) => (
        <g key={y}>
          <line x1="78" y1={y} x2="145" y2={y - 4} stroke={I} strokeWidth="2" />
          <line x1="175" y1={y - 4} x2="242" y2={y} stroke={I} strokeWidth="2" />
        </g>
      ))}
      <g transform="translate(230 40) rotate(35)">
        <rect x="-4" y="-40" width="8" height="60" rx="2" fill={G} />
        <path d="M-4 20 L0 32 L4 20Z" fill="#16302e" />
      </g>
    </Frame>
  ),
  giving: (l) => (
    <Frame label={l}>
      <rect width="320" height="180" fill="#f7e9c6" />
      <path d="M40 150 Q60 100 110 110 L150 112 L150 150Z" fill="#e8c9a0" />
      <path d="M280 150 Q260 100 210 110 L170 112 L170 150Z" fill="#d9b48a" />
      <circle cx="160" cy="92" r="26" fill={T} />
      <path d="M160 78 q10 -12 16 2 q0 10 -16 20 q-16 -10 -16 -20 q6 -14 16 -2z" fill="#ffffff" />
      {[120, 200].map((x) => (
        <circle key={x} cx={x} cy="60" r="8" fill={G} />
      ))}
      <circle cx="160" cy="40" r="6" fill={G} />
    </Frame>
  ),
  kaaba: (l) => (
    <Frame label={l}>
      <rect width="320" height="180" fill="#f3ecdc" />
      <rect y="140" width="320" height="40" fill="#e6dcc4" />
      <rect x="110" y="50" width="100" height="95" fill="#16302e" />
      <rect x="110" y="78" width="100" height="10" fill={G} />
      <rect x="160" y="100" width="22" height="45" fill="#2b1f06" />
      <rect x="160" y="100" width="22" height="4" fill={G} />
      <path d="M40 140 Q160 110 280 140" stroke={T} strokeWidth="3" fill="none" strokeDasharray="6 6" />
    </Frame>
  ),
  light: (l) => (
    <Frame label={l}>
      <rect width="320" height="180" fill="#16302e" />
      <circle cx="160" cy="95" r="70" fill="#f7e9c6" opacity="0.15" />
      <circle cx="160" cy="95" r="45" fill="#f7e9c6" opacity="0.2" />
      <rect x="140" y="60" width="40" height="60" rx="6" fill="#2b1f06" stroke={G} strokeWidth="3" />
      <rect x="150" y="48" width="20" height="12" fill={G} />
      <line x1="160" y1="30" x2="160" y2="48" stroke={G} strokeWidth="3" />
      <path d="M160 80 q8 10 0 24 q-8 -14 0 -24z" fill="#f3d791" />
      <rect x="135" y="120" width="50" height="6" rx="3" fill={G} />
    </Frame>
  ),
  scale: (l) => (
    <Frame label={l}>
      <rect width="320" height="180" fill="#e3f0ec" />
      <rect x="156" y="40" width="8" height="110" fill={T} />
      <rect x="110" y="150" width="100" height="10" rx="4" fill={T} />
      <rect x="70" y="50" width="180" height="6" rx="3" fill={T} />
      <path d="M70 56 L50 100 L110 100Z" fill={GS} stroke={G} strokeWidth="2" />
      <path d="M250 56 L230 100 L290 100Z" fill={GS} stroke={G} strokeWidth="2" />
      <circle cx="160" cy="40" r="8" fill={G} />
    </Frame>
  ),
  heart: (l) => (
    <Frame label={l}>
      <rect width="320" height="180" fill="#f7e9c6" />
      <path d="M160 150 C100 110 60 80 80 50 C95 30 130 32 160 62 C190 32 225 30 240 50 C260 80 220 110 160 150Z" fill={T} />
      <path d="M160 130 C120 100 100 85 110 65 C118 52 140 54 160 74 C180 54 202 52 210 65 C220 85 200 100 160 130Z" fill="#5fbfae" opacity="0.7" />
      {[60, 260].map((x) => (
        <circle key={x} cx={x} cy="40" r="5" fill={G} />
      ))}
    </Frame>
  ),
  shield: (l) => (
    <Frame label={l}>
      <rect width="320" height="180" fill="#16302e" />
      <path d="M160 25 L225 50 V95 C225 130 195 150 160 160 C125 150 95 130 95 95 V50Z" fill={T} stroke={G} strokeWidth="4" />
      <path d="M160 50 L195 64 V94 C195 115 178 128 160 135 C142 128 125 115 125 94 V64Z" fill="#e3f0ec" />
      <path d="M160 70 q8 10 0 24 q-8 -14 0 -24z" fill={G} />
      {[40, 280, 60, 260].map((x, i) => (
        <circle key={x} cx={x} cy={30 + i * 15} r="2" fill="#f3d791" />
      ))}
    </Frame>
  ),
  desert: (l) => (
    <Frame label={l}>
      <rect width="320" height="180" fill="#f7e9c6" />
      <circle cx="70" cy="50" r="24" fill={G} />
      <path d="M0 140 Q80 100 160 140 T320 130 V180 H0Z" fill="#e0b35a" />
      <path d="M0 160 Q100 130 200 160 T320 155 V180 H0Z" fill="#c8962e" />
      <g transform="translate(210 95)">
        <ellipse cx="0" cy="20" rx="30" ry="16" fill="#8a5a1e" />
        <ellipse cx="-8" cy="2" rx="12" ry="12" fill="#8a5a1e" />
        <ellipse cx="12" cy="4" rx="11" ry="11" fill="#8a5a1e" />
        <path d="M-28 20 q-12 -20 -6 -34" stroke="#8a5a1e" strokeWidth="8" fill="none" strokeLinecap="round" />
        {[-18, -6, 8, 20].map((x) => (
          <rect key={x} x={x} y="30" width="5" height="22" fill="#8a5a1e" />
        ))}
      </g>
      <path d="M250 150 q12 -30 0 -40 q-12 10 0 40" fill="#2a8a7e" />
    </Frame>
  ),
};

export function Illustration({ theme, label }: { theme: Theme; label: string }) {
  return scenes[theme](label);
}

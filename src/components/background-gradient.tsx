'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useTheme } from './theme-provider'

// Structural vibration waveform paths — represent different modal frequencies
const WAVE_DEFS = [
  // Fundamental mode: long period, full width
  {
    d: 'M-80,185 C120,142 280,225 460,178 C640,131 800,214 980,168 C1160,122 1310,206 1490,162 C1560,142 1590,150 1620,147',
    strokeWidth: 1.6,
    opacity: 1.0,
    yKey: 0,
    xKey: 1,
  },
  // Second mode: medium period
  {
    d: 'M-80,340 C140,292 300,378 480,332 C660,286 820,372 1000,326 C1180,280 1330,366 1510,320 C1565,302 1595,310 1620,306',
    strokeWidth: 1.2,
    opacity: 0.80,
    yKey: 1,
    xKey: 0,
  },
  // Third mode: shorter period, dampens toward right
  {
    d: 'M180,488 C238,464 272,510 330,487 C388,464 422,510 480,487 C538,464 572,510 630,487 C688,464 722,510 780,487 C838,464 872,510 930,487 C988,464 1022,510 1080,487 C1138,465 1172,508 1230,487',
    strokeWidth: 0.9,
    opacity: 0.60,
    yKey: 2,
    xKey: 1,
  },
  // Background carrier wave: very low freq, barely perceptible
  {
    d: 'M-80,620 C180,574 360,654 560,616 C760,578 940,648 1140,614 C1300,586 1430,634 1560,610 C1595,603 1610,606 1620,604',
    strokeWidth: 1.0,
    opacity: 0.65,
    yKey: 3,
    xKey: 0,
  },
]

// Sparse structural mesh — top-right (sensor network on a structure)
const NODES_TR = [
  [1155, 72], [1225, 46], [1292, 92], [1352, 58],
  [1182, 118], [1252, 144], [1322, 126], [1402, 90], [1302, 32],
]
const EDGES_TR = [
  [0, 1], [1, 2], [2, 3], [0, 4], [1, 6], [2, 5],
  [3, 7], [4, 5], [5, 6], [6, 7], [1, 8], [2, 8],
]

// Mid-left mesh cluster
const NODES_ML = [
  [68, 390], [134, 364], [192, 408], [158, 448], [88, 440],
  [222, 380], [245, 428], [104, 486], [178, 482],
]
const EDGES_ML = [
  [0, 1], [1, 2], [2, 5], [0, 4], [1, 3], [2, 6],
  [3, 4], [3, 7], [4, 7], [5, 6], [6, 8], [7, 8],
]

export function BackgroundGradient() {
  const { theme } = useTheme()
  const { scrollY } = useScroll()
  const isDark = theme === 'dark'

  // Four parallax speeds — slower elements feel further away
  const y = [
    useTransform(scrollY, [0, 6000], [0, -55]),   // very slow
    useTransform(scrollY, [0, 6000], [0, -105]),  // slow
    useTransform(scrollY, [0, 6000], [0, -170]),  // medium
    useTransform(scrollY, [0, 6000], [0, -240]),  // fast
  ]
  const xRight = useTransform(scrollY, [0, 6000], [0, 38])
  const xLeft  = useTransform(scrollY, [0, 6000], [0, -26])
  const xKeys  = [xLeft, xRight, xLeft, xRight]

  const primary      = isDark ? 'hsl(178,68%,52%)' : 'hsl(178,65%,24%)'
  const waveBase     = isDark ? 0.095 : 0.068

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0 bg-background" />

      {/* Gradient orbs — drift slowly on scroll */}
      <motion.div style={{ y: y[1] }} className="absolute inset-0 pointer-events-none">
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: isDark
              ? `radial-gradient(ellipse 65% 55% at 12% 42%, hsl(178 68% 52% / 0.18) 0%, transparent 62%),
                 radial-gradient(ellipse 55% 48% at 88% 20%, hsl(192 62% 47% / 0.15) 0%, transparent 60%),
                 radial-gradient(ellipse 48% 44% at 52% 90%, hsl(165 62% 50% / 0.12) 0%, transparent 56%)`
              : `radial-gradient(ellipse 65% 55% at 12% 42%, hsl(178 65% 24% / 0.08) 0%, transparent 62%),
                 radial-gradient(ellipse 55% 48% at 88% 20%, hsl(192 60% 29% / 0.06) 0%, transparent 60%),
                 radial-gradient(ellipse 48% 44% at 52% 90%, hsl(165 60% 30% / 0.06) 0%, transparent 56%)`,
          }}
        />
      </motion.div>

      {/* SVG artifacts: waveforms + mesh networks */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1540 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Structural vibration waveforms */}
        {WAVE_DEFS.map((w, i) => (
          <motion.path
            key={i}
            style={{ y: y[w.yKey], x: xKeys[w.xKey] }}
            d={w.d}
            fill="none"
            stroke={primary}
            strokeWidth={w.strokeWidth}
            strokeOpacity={waveBase * w.opacity}
            strokeLinecap="round"
          />
        ))}

        {/* Mesh — top right (structural sensor network) */}
        <motion.g style={{ y: y[0], x: xRight }}>
          {EDGES_TR.map(([a, b], i) => (
            <line
              key={i}
              x1={NODES_TR[a][0]} y1={NODES_TR[a][1]}
              x2={NODES_TR[b][0]} y2={NODES_TR[b][1]}
              stroke={primary}
              strokeOpacity={isDark ? 0.10 : 0.07}
              strokeWidth="0.85"
            />
          ))}
          {NODES_TR.map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx} cy={cy} r="2.6"
              fill={primary}
              fillOpacity={isDark ? 0.20 : 0.14}
            />
          ))}
        </motion.g>

        {/* Mesh — mid left */}
        <motion.g style={{ y: y[2], x: xLeft }}>
          {EDGES_ML.map(([a, b], i) => (
            <line
              key={i}
              x1={NODES_ML[a][0]} y1={NODES_ML[a][1]}
              x2={NODES_ML[b][0]} y2={NODES_ML[b][1]}
              stroke={primary}
              strokeOpacity={isDark ? 0.09 : 0.06}
              strokeWidth="0.85"
            />
          ))}
          {NODES_ML.map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx} cy={cy} r="2.6"
              fill={primary}
              fillOpacity={isDark ? 0.16 : 0.11}
            />
          ))}
        </motion.g>
      </svg>
    </div>
  )
}

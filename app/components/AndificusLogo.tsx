'use client'

export default function AndificusLogo({ height = 42 }: { height?: number }) {
  // Scale everything proportionally — original design at height=42
  const scale = height / 42
  const width = Math.round(180 * scale)

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 180 42"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Andificus"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <defs>
        {/* Orb fill — deep blue sphere */}
        <radialGradient id="orbFill" cx="38%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#7fd4ff" />
          <stop offset="30%" stopColor="#2a9de0" />
          <stop offset="70%" stopColor="#0b4fa8" />
          <stop offset="100%" stopColor="#041e3a" />
        </radialGradient>

        {/* Center glow */}
        <radialGradient id="orbGlow" cx="38%" cy="35%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#a0e4ff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#2a9de0" stopOpacity="0" />
        </radialGradient>

        {/* Ring shine */}
        <linearGradient id="ringShine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#a0c8f0" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#4488cc" stopOpacity="0.2" />
        </linearGradient>

        {/* Clip orb to circle */}
        <clipPath id="orbClip">
          <circle cx="21" cy="21" r="13" />
        </clipPath>
      </defs>

      {/* ── Outer ring — rotates continuously ── */}
      <g transform="translate(21, 21)">
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          from="0 0 0"
          to="360 0 0"
          dur="8s"
          repeatCount="indefinite"
        />
        {/* Ring ellipse — tilted perspective */}
        <ellipse cx="0" cy="0" rx="18" ry="7"
          fill="none"
          stroke="url(#ringShine)"
          strokeWidth="1.5"
          opacity="0.85"
        />
        {/* Second ring arc — offset for depth */}
        <ellipse cx="0" cy="0" rx="18" ry="7"
          fill="none"
          stroke="#5aacde"
          strokeWidth="0.6"
          strokeDasharray="28 84"
          strokeDashoffset="14"
          opacity="0.5"
        />
      </g>

      {/* ── Orb body ── */}
      <circle cx="21" cy="21" r="13" fill="url(#orbFill)" />

      {/* ── Star field inside orb ── */}
      <g clipPath="url(#orbClip)" opacity="0.7">
        {[
          [16, 18], [24, 15], [20, 24], [27, 22], [14, 25], [28, 17], [18, 28],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="0.6" fill="white">
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur={`${2.2 + i * 0.4}s`}
              repeatCount="indefinite"
              begin={`${i * 0.3}s`}
            />
          </circle>
        ))}
      </g>

      {/* ── Center glow — pulses ── */}
      <circle cx="21" cy="21" r="13" fill="url(#orbGlow)">
        <animate
          attributeName="opacity"
          values="0.6;1;0.6"
          dur="2.8s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
        />
      </circle>

      {/* ── Bright specular highlight ── */}
      <ellipse cx="17.5" cy="16" rx="4" ry="2.5" fill="white" opacity="0.55">
        <animate
          attributeName="opacity"
          values="0.4;0.7;0.4"
          dur="2.8s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
        />
      </ellipse>

      {/* ── Outer glow ring (static) ── */}
      <circle cx="21" cy="21" r="15.5"
        fill="none"
        stroke="#3a9de8"
        strokeWidth="0.8"
        opacity="0.35"
      />
      <circle cx="21" cy="21" r="17"
        fill="none"
        stroke="#5ab8f0"
        strokeWidth="0.4"
        opacity="0.2"
      />

      {/* ── ANDIFICUS text ── */}
      <text
        x="44"
        y="27"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="16.5"
        fontWeight="400"
        letterSpacing="2.5"
        fill="currentColor"
        style={{ userSelect: 'none' }}
      >
        ANDIFICUS
      </text>
    </svg>
  )
}

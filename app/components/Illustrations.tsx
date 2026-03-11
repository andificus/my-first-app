'use client'

/* ============================================================
   HeroIllustration
   A bold animated dashboard mockup — charts, stats, live data
   ============================================================ */
export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 420 300"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(100,160,255,0.9)" />
          <stop offset="100%" stopColor="rgba(80,220,160,0.9)" />
        </linearGradient>
        <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(100,160,255,0.95)" />
          <stop offset="100%" stopColor="rgba(80,200,180,0.4)" />
        </linearGradient>
        <linearGradient id="lineAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(100,200,255,0.3)" />
          <stop offset="100%" stopColor="rgba(100,200,255,0)" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id="chartClip">
          <rect x="120" y="60" width="280" height="140" />
        </clipPath>
      </defs>

      {/* App window frame */}
      <rect x="10" y="10" width="400" height="280" rx="14" fill="rgba(15,20,30,0.85)" stroke="rgba(100,160,255,0.3)" strokeWidth="1" />

      {/* Title bar */}
      <rect x="10" y="10" width="400" height="36" rx="14" fill="rgba(20,28,42,0.95)" />
      <rect x="10" y="32" width="400" height="14" fill="rgba(20,28,42,0.95)" />
      <circle cx="32" cy="28" r="5" fill="rgba(255,90,90,0.85)" />
      <circle cx="50" cy="28" r="5" fill="rgba(255,190,50,0.85)" />
      <circle cx="68" cy="28" r="5" fill="rgba(50,210,100,0.85)" />
      <rect x="86" y="22" width="100" height="12" rx="6" fill="rgba(255,255,255,0.06)" />

      {/* Sidebar */}
      <rect x="10" y="46" width="100" height="244" fill="rgba(12,18,28,0.7)" />

      {/* Sidebar nav items */}
      {[0,1,2,3,4].map((i) => (
        <g key={i} style={{ animation: `fadeSlideRight 0.4s ease ${0.1 + i * 0.1}s both` }}>
          <rect x="20" y={68 + i * 36} width="6" height="20" rx="3"
            fill={i === 0 ? 'url(#heroGrad)' : 'rgba(255,255,255,0.08)'} />
          <rect x="32" y={72 + i * 36} width={i === 0 ? 52 : 40 + (i % 3) * 8} height="8" rx="4"
            fill={i === 0 ? 'rgba(100,180,255,0.7)' : 'rgba(255,255,255,0.12)'} />
          <rect x="32" y={84 + i * 36} width={28 + (i % 2) * 12} height="5" rx="2.5"
            fill="rgba(255,255,255,0.06)" />
        </g>
      ))}

      {/* Main area background */}
      <rect x="110" y="46" width="300" height="244" fill="rgba(10,16,26,0.4)" />

      {/* Top stat cards */}
      {[
        { x: 118, label: '2,847', sub: 'Users', color: 'rgba(100,180,255,0.9)' },
        { x: 208, label: '94.2%', sub: 'Uptime', color: 'rgba(80,220,160,0.9)' },
        { x: 298, label: '1.2s', sub: 'Latency', color: 'rgba(255,180,80,0.9)' },
      ].map((s, i) => (
        <g key={i} style={{ animation: `floatCard 3s ease-in-out ${i * 0.7}s infinite` }}>
          <rect x={s.x} y="54" width="82" height="44" rx="8"
            fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <text x={s.x + 10} y="72" fill={s.color} fontSize="14" fontWeight="700" fontFamily="monospace"
            style={{ animation: `countUp 1.5s ease ${0.3 + i * 0.2}s both` }}>
            {s.label}
          </text>
          <text x={s.x + 10} y="87" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="sans-serif">
            {s.sub}
          </text>
          <circle cx={s.x + 70} cy="65" r="4" fill={s.color} opacity="0.8"
            style={{ animation: `pulse 2s ease-in-out ${i * 0.5}s infinite` }} />
        </g>
      ))}

      {/* Line chart area */}
      <g clipPath="url(#chartClip)">
        {/* Area fill */}
        <path
          d="M120,175 C140,165 160,140 180,130 C200,120 220,145 240,135 C260,125 280,100 300,90 C320,80 340,105 360,95 C380,85 400,70 420,65 L420,200 L120,200 Z"
          fill="url(#lineAreaGrad)"
        />
        {/* Line */}
        <path
          d="M120,175 C140,165 160,140 180,130 C200,120 220,145 240,135 C260,125 280,100 300,90 C320,80 340,105 360,95 C380,85 400,70 420,65"
          fill="none"
          stroke="rgba(100,200,255,0.9)"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#glow)"
          strokeDasharray="600"
          strokeDashoffset="600"
          style={{ animation: 'drawLine 2s ease 0.3s forwards' }}
        />
        {/* Data points */}
        {[
          [180, 130], [240, 135], [300, 90], [360, 95]
        ].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="5" fill="rgba(100,200,255,0.9)" filter="url(#glow)"
              style={{ animation: `popIn 0.3s ease ${1.2 + i * 0.15}s both` }} />
            <circle cx={cx} cy={cy} r="10" fill="none" stroke="rgba(100,200,255,0.3)" strokeWidth="1"
              style={{ animation: `ripple 2s ease-in-out ${i * 0.5}s infinite` }} />
          </g>
        ))}
      </g>

      {/* Bar chart */}
      <g style={{ animation: 'fadeSlideUp 0.5s ease 0.8s both' }}>
        {[
          { h: 40, x: 122 },
          { h: 60, x: 140 },
          { h: 35, x: 158 },
          { h: 75, x: 176 },
          { h: 50, x: 194 },
          { h: 90, x: 212 },
          { h: 65, x: 230 },
        ].map((b, i) => (
          <rect
            key={i}
            x={b.x} y={200 - b.h} width="14" height={b.h} rx="3"
            fill="url(#barGrad)"
            opacity="0.7"
            style={{ animation: `growBar 0.6s ease ${0.8 + i * 0.08}s both`, transformOrigin: `${b.x + 7}px 200px` }}
          />
        ))}
      </g>

      {/* Animated scan line */}
      <line
        x1="110" y1="0" x2="110" y2="290"
        stroke="rgba(100,200,255,0.15)"
        strokeWidth="80"
        style={{ animation: 'scanRight 4s linear 1s infinite' }}
      />

      {/* Bottom activity row */}
      <rect x="118" y="215" width="292" height="28" rx="6" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      {[0,1,2,3,4].map((i) => (
        <g key={i} style={{ animation: `fadeIn 0.3s ease ${2 + i * 0.15}s both` }}>
          <circle cx={132 + i * 56} cy="229" r="4" fill={['rgba(100,200,255,0.8)','rgba(80,220,160,0.8)','rgba(255,180,80,0.8)','rgba(200,100,255,0.8)','rgba(100,200,255,0.8)'][i]} />
          <rect x={140 + i * 56} y="224" width={28 + (i % 3) * 6} height="5" rx="2.5" fill="rgba(255,255,255,0.1)" />
          <rect x={140 + i * 56} y="232" width={16 + (i % 2) * 8} height="4" rx="2" fill="rgba(255,255,255,0.05)" />
        </g>
      ))}

      {/* Pulsing live indicator */}
      <circle cx="395" cy="58" r="5" fill="rgba(80,220,160,0.9)"
        style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
      <text x="383" y="72" fill="rgba(80,220,160,0.7)" fontSize="7" fontFamily="sans-serif">LIVE</text>
    </svg>
  )
}

/* ============================================================
   AuthIllustration
   Animated shield with orbiting security elements
   ============================================================ */
export function AuthIllustration() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }} aria-hidden="true">
      <defs>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(100,180,255,0.9)" />
          <stop offset="100%" stopColor="rgba(80,220,160,0.8)" />
        </linearGradient>
        <filter id="authGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Outer pulse rings */}
      {[1,2,3].map((i) => (
        <circle key={i} cx="100" cy="95" r={30 + i * 18}
          fill="none" stroke="rgba(100,180,255,0.15)" strokeWidth="1"
          style={{ animation: `expandRing 3s ease-in-out ${i * 0.6}s infinite` }} />
      ))}

      {/* Shield body */}
      <path
        d="M100,30 L140,50 L140,95 C140,120 122,138 100,148 C78,138 60,120 60,95 L60,50 Z"
        fill="rgba(15,25,45,0.9)"
        stroke="url(#shieldGrad)"
        strokeWidth="2.5"
        filter="url(#authGlow)"
        style={{ animation: 'popIn 0.5s ease 0.2s both' }}
      />

      {/* Shield inner glow */}
      <path
        d="M100,38 L134,55 L134,95 C134,116 118,132 100,141 C82,132 66,116 66,95 L66,55 Z"
        fill="rgba(100,180,255,0.06)"
      />

      {/* Lock icon */}
      <g style={{ animation: 'popIn 0.4s ease 0.7s both' }}>
        <rect x="86" y="90" width="28" height="22" rx="4" fill="url(#shieldGrad)" opacity="0.9" />
        <path d="M91,90 L91,82 C91,74 109,74 109,82 L109,90"
          fill="none" stroke="url(#shieldGrad)" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="100" cy="100" r="4" fill="rgba(15,25,45,0.8)" />
        <rect x="98.5" y="100" width="3" height="6" rx="1.5" fill="rgba(15,25,45,0.8)" />
      </g>

      {/* Animated checkmark appearing */}
      <path
        d="M85,155 L95,165 L115,145"
        fill="none"
        stroke="rgba(80,220,160,0.9)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="50"
        strokeDashoffset="50"
        filter="url(#authGlow)"
        style={{ animation: 'drawLine 0.6s ease 1.2s forwards' }}
      />

      {/* Orbiting dots */}
      {[0,1,2].map((i) => (
        <circle key={i} cx="100" cy="95" r="3"
          fill={['rgba(100,180,255,0.9)','rgba(80,220,160,0.9)','rgba(255,180,80,0.9)'][i]}
          filter="url(#authGlow)"
          style={{
            animation: `orbit${i + 1} ${2.5 + i * 0.5}s linear infinite`,
            transformOrigin: '100px 95px'
          }}
        />
      ))}

      {/* Small badge labels */}
      {[
        { x: 28, y: 72, label: 'JWT', color: 'rgba(100,180,255,0.8)' },
        { x: 148, y: 80, label: 'RLS', color: 'rgba(80,220,160,0.8)' },
        { x: 36, y: 128, label: 'MFA', color: 'rgba(255,180,80,0.8)' },
      ].map((b, i) => (
        <g key={i} style={{ animation: `fadeSlideUp 0.4s ease ${1 + i * 0.2}s both` }}>
          <rect x={b.x} y={b.y - 10} width="32" height="16" rx="8"
            fill="rgba(255,255,255,0.06)" stroke={b.color} strokeWidth="1" />
          <text x={b.x + 16} y={b.y + 2} fill={b.color} fontSize="8"
            fontFamily="monospace" textAnchor="middle">{b.label}</text>
        </g>
      ))}
    </svg>
  )
}

/* ============================================================
   ProfileIllustration
   Animated user card with floating data fields
   ============================================================ */
export function ProfileIllustration() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }} aria-hidden="true">
      <defs>
        <linearGradient id="profileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(200,100,255,0.9)" />
          <stop offset="100%" stopColor="rgba(100,160,255,0.9)" />
        </linearGradient>
        <filter id="profileGlow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <clipPath id="avatarClip">
          <circle cx="100" cy="72" r="32" />
        </clipPath>
      </defs>

      {/* Card background */}
      <rect x="30" y="30" width="140" height="145" rx="16"
        fill="rgba(20,15,40,0.85)" stroke="url(#profileGrad)" strokeWidth="1.5"
        style={{ animation: 'popIn 0.4s ease 0.1s both' }} />

      {/* Avatar ring */}
      <circle cx="100" cy="72" r="36" fill="none"
        stroke="url(#profileGrad)" strokeWidth="2" filter="url(#profileGlow)"
        style={{ animation: 'spin 8s linear infinite' }}
        strokeDasharray="8 4"
      />

      {/* Avatar circle */}
      <circle cx="100" cy="72" r="30" fill="rgba(40,30,70,0.9)"
        stroke="url(#profileGrad)" strokeWidth="1.5" />

      {/* Animated avatar person icon */}
      <circle cx="100" cy="64" r="10" fill="url(#profileGrad)" opacity="0.9"
        style={{ animation: 'popIn 0.3s ease 0.5s both' }} />
      <path d="M76,92 C76,80 124,80 124,92"
        fill="url(#profileGrad)" opacity="0.7"
        style={{ animation: 'fadeIn 0.4s ease 0.7s both' }} />

      {/* Username badge */}
      <g style={{ animation: 'fadeSlideUp 0.4s ease 0.8s both' }}>
        <rect x="62" y="108" width="76" height="16" rx="8"
          fill="rgba(200,100,255,0.15)" stroke="rgba(200,100,255,0.4)" strokeWidth="1" />
        <text x="100" y="120" fill="rgba(200,100,255,0.9)" fontSize="9"
          fontFamily="monospace" textAnchor="middle">@andificus</text>
      </g>

      {/* Profile fields */}
      {[
        { label: 'Name', value: 'Andrew W.', y: 135, color: 'rgba(100,180,255,0.7)', delay: '1s' },
        { label: 'Bio', value: 'Builder · Dev', y: 153, color: 'rgba(80,220,160,0.7)', delay: '1.15s' },
      ].map((f, i) => (
        <g key={i} style={{ animation: `fadeSlideRight 0.4s ease ${f.delay} both` }}>
          <text x="44" y={f.y} fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="sans-serif">{f.label}</text>
          <text x="80" y={f.y} fill={f.color} fontSize="8" fontFamily="sans-serif">{f.value}</text>
        </g>
      ))}

      {/* Completion bar */}
      <g style={{ animation: 'fadeSlideUp 0.4s ease 1.3s both' }}>
        <rect x="40" y="166" width="120" height="5" rx="2.5" fill="rgba(255,255,255,0.07)" />
        <rect x="40" y="166" width="0" height="5" rx="2.5"
          fill="url(#profileGrad)"
          style={{ animation: 'expandWidth 1s ease 1.5s forwards' }}
        />
        <text x="165" y="171" fill="rgba(200,100,255,0.7)" fontSize="7" fontFamily="monospace">100%</text>
      </g>

      {/* Floating connection lines */}
      {[
        { x1: 10, y1: 50, x2: 30, y2: 65 },
        { x1: 170, y1: 40, x2: 155, y2: 60 },
        { x1: 5, y1: 140, x2: 28, y2: 130 },
        { x1: 195, y1: 130, x2: 172, y2: 120 },
      ].map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke="rgba(200,100,255,0.2)" strokeWidth="1" strokeDasharray="3 3"
          style={{ animation: `fadeIn 0.5s ease ${1.8 + i * 0.2}s both` }} />
      ))}

      {/* Orbiting data tags */}
      {[
        { label: 'Theme', angle: 0, r: 90, color: 'rgba(100,180,255,0.8)' },
        { label: 'TZ', angle: 140, r: 88, color: 'rgba(80,220,160,0.8)' },
        { label: 'Loc', angle: 240, r: 86, color: 'rgba(255,180,80,0.8)' },
      ].map((t, i) => (
        <g key={i} style={{
          animation: `orbitSlow 12s linear ${i * 4}s infinite`,
          transformOrigin: '100px 100px'
        }}>
          <rect x={100 + Math.cos(t.angle * Math.PI/180) * t.r - 14}
            y={100 + Math.sin(t.angle * Math.PI/180) * t.r - 8}
            width="28" height="14" rx="7"
            fill="rgba(255,255,255,0.05)" stroke={t.color} strokeWidth="1" />
          <text
            x={100 + Math.cos(t.angle * Math.PI/180) * t.r}
            y={100 + Math.sin(t.angle * Math.PI/180) * t.r + 4}
            fill={t.color} fontSize="7" fontFamily="monospace" textAnchor="middle"
          >{t.label}</text>
        </g>
      ))}
    </svg>
  )
}

/* ============================================================
   DashboardIllustration
   Animated widget grid with live charts
   ============================================================ */
export function DashboardIllustration() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }} aria-hidden="true">
      <defs>
        <linearGradient id="dashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(80,220,160,0.9)" />
          <stop offset="100%" stopColor="rgba(100,180,255,0.9)" />
        </linearGradient>
        <filter id="dashGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Main frame */}
      <rect x="10" y="10" width="180" height="180" rx="14"
        fill="rgba(12,20,32,0.9)" stroke="rgba(80,220,160,0.2)" strokeWidth="1"
        style={{ animation: 'popIn 0.4s ease 0.1s both' }} />

      {/* Top bar */}
      <rect x="10" y="10" width="180" height="28" rx="14" fill="rgba(20,32,48,0.95)" />
      <rect x="10" y="24" width="180" height="14" fill="rgba(20,32,48,0.95)" />
      <rect x="22" y="20" width="60" height="8" rx="4" fill="rgba(255,255,255,0.07)" />
      <circle cx="175" cy="24" r="4" fill="rgba(80,220,160,0.8)"
        style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />

      {/* Widget 1 — big stat */}
      <g style={{ animation: 'fadeSlideUp 0.4s ease 0.3s both' }}>
        <rect x="18" y="46" width="78" height="52" rx="8"
          fill="rgba(255,255,255,0.03)" stroke="rgba(80,220,160,0.15)" strokeWidth="1" />
        <text x="28" y="66" fill="rgba(80,220,160,0.9)" fontSize="20" fontWeight="700" fontFamily="monospace">98%</text>
        <text x="28" y="80" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="sans-serif">Health score</text>
        {/* Mini sparkline */}
        <polyline points="22,94 30,88 38,91 46,84 54,86 62,80 70,83 78,76 86,80 94,74"
          fill="none" stroke="rgba(80,220,160,0.6)" strokeWidth="1.5" strokeLinecap="round"
          strokeDasharray="120" strokeDashoffset="120"
          style={{ animation: 'drawLine 1.2s ease 1s forwards' }} />
      </g>

      {/* Widget 2 — bar chart */}
      <g style={{ animation: 'fadeSlideUp 0.4s ease 0.5s both' }}>
        <rect x="104" y="46" width="86" height="52" rx="8"
          fill="rgba(255,255,255,0.03)" stroke="rgba(100,180,255,0.15)" strokeWidth="1" />
        <text x="114" y="60" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="sans-serif">Activity</text>
        {[0,1,2,3,4,5,6].map((i) => {
          const heights = [18, 28, 14, 35, 22, 30, 26]
          return (
            <rect key={i}
              x={112 + i * 11} y={96 - heights[i]} width="7" height={heights[i]} rx="2"
              fill="url(#dashGrad)" opacity="0.8"
              style={{ animation: `growBar 0.5s ease ${0.6 + i * 0.07}s both`, transformOrigin: `${112 + i*11 + 3.5}px 96px` }}
            />
          )
        })}
      </g>

      {/* Widget 3 — donut gauge */}
      <g style={{ animation: 'fadeSlideUp 0.4s ease 0.7s both' }}>
        <rect x="18" y="106" width="78" height="78" rx="8"
          fill="rgba(255,255,255,0.03)" stroke="rgba(200,100,255,0.15)" strokeWidth="1" />
        <circle cx="57" cy="148" r="24" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
        <circle cx="57" cy="148" r="24" fill="none" stroke="url(#dashGrad)" strokeWidth="8"
          strokeLinecap="round" strokeDasharray="120 30"
          style={{ animation: 'spinGauge 4s ease-in-out 0.8s infinite', transformOrigin: '57px 148px' }} />
        <text x="57" y="145" fill="rgba(255,255,255,0.9)" fontSize="11" fontWeight="700"
          fontFamily="monospace" textAnchor="middle">83</text>
        <text x="57" y="156" fill="rgba(255,255,255,0.3)" fontSize="7"
          fontFamily="sans-serif" textAnchor="middle">score</text>
      </g>

      {/* Widget 4 — live list */}
      <g style={{ animation: 'fadeSlideUp 0.4s ease 0.9s both' }}>
        <rect x="104" y="106" width="86" height="78" rx="8"
          fill="rgba(255,255,255,0.03)" stroke="rgba(255,180,80,0.15)" strokeWidth="1" />
        <text x="114" y="120" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="sans-serif">Recent</text>
        {[0,1,2,3].map((i) => (
          <g key={i} style={{ animation: `fadeSlideRight 0.3s ease ${1.1 + i * 0.15}s both` }}>
            <circle cx="116" cy={130 + i * 14} r="3"
              fill={['rgba(80,220,160,0.8)','rgba(100,180,255,0.8)','rgba(255,180,80,0.8)','rgba(200,100,255,0.8)'][i]} />
            <rect x="124" y={126 + i * 14} width={30 + (i % 3) * 8} height="5" rx="2.5"
              fill="rgba(255,255,255,0.08)" />
            <rect x="124" y={134 + i * 14} width={18 + (i % 2) * 6} height="4" rx="2"
              fill="rgba(255,255,255,0.04)" />
          </g>
        ))}
      </g>
    </svg>
  )
}

/* ============================================================
   SignInIllustration — for "How it works" flow cards
   ============================================================ */
export function SignInIllustration() {
  return (
    <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }} aria-hidden="true">
      <defs>
        <linearGradient id="signGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(100,180,255,0.9)" />
          <stop offset="100%" stopColor="rgba(80,220,160,0.9)" />
        </linearGradient>
      </defs>

      {/* Card */}
      <rect x="30" y="10" width="140" height="120" rx="12"
        fill="rgba(15,22,38,0.9)" stroke="rgba(100,180,255,0.25)" strokeWidth="1.5"
        style={{ animation: 'popIn 0.4s ease 0.1s both' }} />

      {/* Title */}
      <rect x="50" y="24" width="50" height="8" rx="4" fill="rgba(100,180,255,0.4)"
        style={{ animation: 'expandWidth 0.6s ease 0.3s both' }} />

      {/* Email field */}
      <rect x="44" y="42" width="112" height="16" rx="6"
        fill="rgba(255,255,255,0.05)" stroke="rgba(100,180,255,0.3)" strokeWidth="1"
        style={{ animation: 'fadeSlideUp 0.3s ease 0.5s both' }} />
      <rect x="50" y="47" width="60" height="6" rx="3" fill="rgba(100,180,255,0.4)"
        style={{ animation: 'typingCursor 1s steps(1) 0.8s infinite' }} />

      {/* Password field */}
      <rect x="44" y="66" width="112" height="16" rx="6"
        fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"
        style={{ animation: 'fadeSlideUp 0.3s ease 0.65s both' }} />
      {[0,1,2,3,4,5,6,7].map((i) => (
        <circle key={i} cx={51 + i * 10} cy={74} r="2.5"
          fill="rgba(255,255,255,0.3)"
          style={{ animation: `popIn 0.2s ease ${0.9 + i * 0.08}s both` }} />
      ))}

      {/* Button */}
      <rect x="44" y="92" width="112" height="22" rx="8"
        fill="url(#signGrad)" opacity="0.9"
        style={{ animation: 'fadeSlideUp 0.3s ease 0.8s both' }} />
      <text x="100" y="107" fill="white" fontSize="9" fontFamily="sans-serif"
        fontWeight="600" textAnchor="middle"
        style={{ animation: 'fadeIn 0.3s ease 1s both' }}>Sign in →</text>

      {/* Success flash */}
      <rect x="30" y="10" width="140" height="120" rx="12"
        fill="rgba(80,220,160,0.08)"
        style={{ animation: 'successFlash 3s ease 1.5s infinite' }} />
    </svg>
  )
}

/* ============================================================
   SetupProfileIllustration
   ============================================================ */
export function SetupProfileIllustration() {
  return (
    <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }} aria-hidden="true">
      <defs>
        <linearGradient id="setupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(200,100,255,0.9)" />
          <stop offset="100%" stopColor="rgba(100,160,255,0.9)" />
        </linearGradient>
      </defs>

      <rect x="30" y="10" width="140" height="120" rx="12"
        fill="rgba(15,22,38,0.9)" stroke="rgba(200,100,255,0.25)" strokeWidth="1.5"
        style={{ animation: 'popIn 0.4s ease 0.1s both' }} />

      {/* Avatar area */}
      <circle cx="70" cy="50" r="22" fill="rgba(40,20,60,0.8)"
        stroke="url(#setupGrad)" strokeWidth="1.5"
        style={{ animation: 'popIn 0.4s ease 0.3s both' }} />
      <circle cx="70" cy="44" r="8" fill="url(#setupGrad)" opacity="0.8"
        style={{ animation: 'popIn 0.3s ease 0.5s both' }} />
      <path d="M52,66 C52,57 88,57 88,66"
        fill="url(#setupGrad)" opacity="0.6"
        style={{ animation: 'fadeIn 0.3s ease 0.7s both' }} />

      {/* Upload indicator */}
      <circle cx="86" cy="34" r="8" fill="rgba(80,220,160,0.9)"
        style={{ animation: 'popIn 0.3s ease 0.9s both' }} />
      <path d="M86,31 L86,37 M83,34 L86,31 L89,34"
        stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ animation: 'fadeIn 0.3s ease 1s both' }} />

      {/* Form fields */}
      {[0,1,2].map((i) => (
        <g key={i} style={{ animation: `fadeSlideRight 0.3s ease ${0.5 + i * 0.2}s both` }}>
          <rect x="102" y={24 + i * 28} width="58" height="8" rx="4"
            fill="rgba(255,255,255,0.05)" stroke="rgba(200,100,255,0.2)" strokeWidth="1" />
          <rect x="105" y={27 + i * 28} width={25 + (i % 3) * 8} height="4" rx="2"
            fill="rgba(200,100,255,0.35)" />
        </g>
      ))}

      {/* Save button */}
      <rect x="44" y="98" width="112" height="20" rx="8"
        fill="url(#setupGrad)" opacity="0.85"
        style={{ animation: 'fadeSlideUp 0.4s ease 1.1s both' }} />
      <text x="100" y="112" fill="white" fontSize="9" fontFamily="sans-serif"
        fontWeight="600" textAnchor="middle"
        style={{ animation: 'fadeIn 0.3s ease 1.3s both' }}>Save profile ✓</text>

      {/* Completion bar */}
      <rect x="44" y="124" width="112" height="4" rx="2" fill="rgba(255,255,255,0.06)" />
      <rect x="44" y="124" width="0" height="4" rx="2"
        fill="url(#setupGrad)"
        style={{ animation: 'expandWidth 1.2s ease 1.4s forwards' }} />
    </svg>
  )
}

/* ============================================================
   UseDashboardIllustration
   ============================================================ */
export function UseDashboardIllustration() {
  return (
    <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }} aria-hidden="true">
      <defs>
        <linearGradient id="useGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,180,80,0.9)" />
          <stop offset="100%" stopColor="rgba(255,100,120,0.8)" />
        </linearGradient>
      </defs>

      <rect x="10" y="10" width="180" height="120" rx="12"
        fill="rgba(15,22,38,0.9)" stroke="rgba(255,180,80,0.2)" strokeWidth="1.5"
        style={{ animation: 'popIn 0.4s ease 0.1s both' }} />

      {/* Sidebar */}
      <rect x="10" y="10" width="44" height="120" rx="12" fill="rgba(20,28,44,0.95)" />
      <rect x="10" y="36" width="44" height="94" fill="rgba(20,28,44,0.95)" />
      {[0,1,2,3].map((i) => (
        <g key={i}>
          <rect x="18" y={24 + i * 26} width="6" height="18" rx="3"
            fill={i === 0 ? 'url(#useGrad)' : 'rgba(255,255,255,0.07)'} />
          <rect x="28" y={28 + i * 26} width="18" height="5" rx="2.5"
            fill={i === 0 ? 'rgba(255,180,80,0.5)' : 'rgba(255,255,255,0.07)'} />
          <rect x="28" y={37 + i * 26} width="12" height="4" rx="2"
            fill="rgba(255,255,255,0.04)" />
        </g>
      ))}

      {/* Main widgets */}
      {[
        { x: 62, y: 18, w: 58, h: 38, color: 'rgba(255,180,80,0.2)', ac: 'rgba(255,180,80,0.8)' },
        { x: 128, y: 18, w: 56, h: 38, color: 'rgba(100,180,255,0.2)', ac: 'rgba(100,180,255,0.8)' },
        { x: 62, y: 64, w: 122, h: 60, color: 'rgba(80,220,160,0.1)', ac: 'rgba(80,220,160,0.8)' },
      ].map((w, i) => (
        <g key={i} style={{ animation: `fadeSlideUp 0.4s ease ${0.3 + i * 0.2}s both` }}>
          <rect x={w.x} y={w.y} width={w.w} height={w.h} rx="8"
            fill={w.color} stroke={w.ac} strokeWidth="0.75" strokeOpacity="0.3" />
          {i < 2 && (
            <>
              <text x={w.x + 8} y={w.y + 16} fill={w.ac} fontSize="14" fontWeight="700" fontFamily="monospace">
                {i === 0 ? '24' : '↑12'}
              </text>
              <rect x={w.x + 8} y={w.y + 24} width={w.w - 20} height="5" rx="2.5"
                fill="rgba(255,255,255,0.06)" />
              <rect x={w.x + 8} y={w.y + 24} width={(w.w - 20) * (i === 0 ? 0.7 : 0.45)} height="5" rx="2.5"
                fill={w.ac} opacity="0.6"
                style={{ animation: `expandWidth 0.8s ease ${0.8 + i * 0.2}s both` }} />
            </>
          )}
          {i === 2 && (
            /* Mini chart in large widget */
            <polyline
              points={`${w.x + 8},${w.y + 50} ${w.x + 22},${w.y + 38} ${w.x + 36},${w.y + 44} ${w.x + 50},${w.y + 28} ${w.x + 64},${w.y + 34} ${w.x + 78},${w.y + 20} ${w.x + 92},${w.y + 26} ${w.x + 106},${w.y + 14}`}
              fill="none" stroke={w.ac} strokeWidth="2" strokeLinecap="round"
              strokeDasharray="300" strokeDashoffset="300"
              style={{ animation: 'drawLine 1.2s ease 1s forwards' }}
            />
          )}
        </g>
      ))}

      {/* Live pulse */}
      <circle cx="180" cy="20" r="4" fill="rgba(80,220,160,0.9)"
        style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
    </svg>
  )
}

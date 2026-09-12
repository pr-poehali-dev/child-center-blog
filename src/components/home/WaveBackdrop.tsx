interface WaveBackdropProps {
  className?: string;
}

export default function WaveBackdrop({ className = "" }: WaveBackdropProps) {
  return (
    <svg
      className={`absolute inset-x-0 w-full pointer-events-none ${className}`}
      style={{ height: 160 }}
      viewBox="0 0 1440 160"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="waveGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F6C1A8" />
          <stop offset="100%" stopColor="#E8985F" />
        </linearGradient>
        <filter id="waveBlur" x="-10%" y="-50%" width="120%" height="200%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>
      <path
        d="M0,128 C120,112 240,138 360,122 C480,106 600,132 720,116
           C840,100 960,126 1080,110 C1200,124 1320,108 1440,120
           L1440,160 L0,160 Z"
        fill="url(#waveGradient)"
        fillOpacity="0.33"
        filter="url(#waveBlur)"
      />
    </svg>
  );
}
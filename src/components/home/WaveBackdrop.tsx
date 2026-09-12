export default function WaveBackdrop() {
  return (
    <svg
      className="absolute inset-x-0 top-0 w-full pointer-events-none"
      style={{ height: 150 }}
      viewBox="0 0 1440 150"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="waveGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F6C1A8" />
          <stop offset="100%" stopColor="#E8985F" />
        </linearGradient>
        <filter id="waveBlur" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <path
        d="M0,90 C220,40 420,130 720,80 C1020,30 1220,120 1440,70 L1440,150 L0,150 Z"
        fill="url(#waveGradient)"
        fillOpacity="0.3"
        filter="url(#waveBlur)"
      />
    </svg>
  );
}

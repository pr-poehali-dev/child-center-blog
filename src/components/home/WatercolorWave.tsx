interface WatercolorWaveProps {
  className?: string;
  height?: number;
}

export default function WatercolorWave({ className = "", height = 22 }: WatercolorWaveProps) {
  return (
    <svg
      viewBox="0 0 400 40"
      preserveAspectRatio="none"
      className={`absolute bottom-0 left-0 w-full pointer-events-none ${className}`}
      style={{ height }}
      aria-hidden="true"
    >
      <path
        d="M0,20 C60,35 120,5 200,18 C280,31 340,8 400,22 L400,40 L0,40 Z"
        fill="#D9A441"
        opacity="0.16"
      />
      <path
        d="M0,26 C70,14 140,34 210,22 C290,10 350,30 400,18 L400,40 L0,40 Z"
        fill="#E8985F"
        opacity="0.12"
      />
    </svg>
  );
}

interface BrushUnderlineProps {
  color?: string;
  className?: string;
  height?: number;
}

export default function BrushUnderline({ color = "#D9A441", className = "", height = 16 }: BrushUnderlineProps) {
  return (
    <svg
      className={`absolute -bottom-2 pointer-events-none ${className}`}
      style={{ left: -12, width: "calc(100% + 24px)" }}
      height={height}
      viewBox="0 0 200 16"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M3,8 C20,3 35,10 55,6 C80,1 95,9 118,7 C142,5 158,11 176,6
           C185,4 192,6 197,5
           L197,10 C191,13 182,9 174,11
           C156,15 140,9 116,12 C93,14 78,7 54,11
           C34,14 19,8 3,13 Z"
        fill={color}
        fillOpacity="0.8"
      />
    </svg>
  );
}
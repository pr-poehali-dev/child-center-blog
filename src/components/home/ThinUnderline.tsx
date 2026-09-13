interface ThinUnderlineProps {
  color?: string;
  className?: string;
}

export default function ThinUnderline({ color = "#D9A441", className = "" }: ThinUnderlineProps) {
  return (
    <span
      className={`absolute left-0 -bottom-2 block ${className}`}
      style={{ width: "100%", height: 3, background: color, borderRadius: 2 }}
      aria-hidden="true"
    />
  );
}

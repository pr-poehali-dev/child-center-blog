interface HoneypotProps {
  value: string;
  onChange: (value: string) => void;
}

/** Скрытое поле-ловушка для ботов: люди его не видят и не заполняют. */
export default function Honeypot({ value, onChange }: HoneypotProps) {
  return (
    <input
      type="text"
      name="company"
      value={value}
      onChange={e => onChange(e.target.value)}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-9999px",
        width: "1px",
        height: "1px",
        opacity: 0,
        pointerEvents: "none",
      }}
    />
  );
}

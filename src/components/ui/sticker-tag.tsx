interface StickerTagProps {
  text: string;
  size?: "sm" | "md" | "lg";
}

export default function StickerTag({ text, size = "md" }: StickerTagProps) {
  const sizeClass = { sm: "w-20", md: "w-28", lg: "w-36" }[size];

  return (
    <div className={`relative inline-block ${sizeClass}`} style={{ aspectRatio: "120/165" }}>
      <svg
        viewBox="0 0 120 165"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        style={{ filter: "drop-shadow(2px 5px 10px rgba(0,0,0,0.3))" }}
      >
        {/* Верёвка (несколько витков) */}
        <path d="M62 18 C58 10, 50 4, 40 6 C28 9, 26 22, 36 28 C46 34, 56 22, 62 18Z"
          fill="none" stroke="#B87333" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M62 18 C59 13, 54 7, 46 7"
          fill="none" stroke="#D4983C" strokeWidth="1.1" strokeLinecap="round" opacity="0.7" />
        {/* Гвоздик */}
        <circle cx="39" cy="6" r="5.5" fill="#5A7A9A" />
        <circle cx="39" cy="6" r="3.2" fill="#3D6080" />
        <circle cx="38" cy="5" r="1.3" fill="#7AAAC8" />
        {/* Кольцо */}
        <circle cx="44" cy="30" r="7.5" fill="none" stroke="#B87333" strokeWidth="3" />
        <circle cx="44" cy="30" r="4.8" fill="none" stroke="#E8A840" strokeWidth="1.6" />
        {/* Тело бирки */}
        <path
          d="M17 47 L17 153 Q17 162 25 162 L95 162 Q103 162 103 153 L103 47 Q103 38 95 38 L57 38 Q49 38 44 44 L38 50 Q32 56 25 56 Q17 56 17 47Z"
          fill="#FF8C00"
        />
        {/* 3D правый бок */}
        <path
          d="M97 38 Q103 38 103 47 L103 153 Q103 162 95 162 L92 162 Q100 162 100 153 L100 47 Q100 38 92 38Z"
          fill="#CC6800"
        />
        {/* 3D нижний левый */}
        <path
          d="M17 150 L17 153 Q17 162 25 162 L28 162 Q20 162 20 153 L20 150Z"
          fill="#CC6800"
        />
        {/* Отверстие под кольцо */}
        <circle cx="44" cy="30" r="6.5" fill="#CC6800" />
        <circle cx="44" cy="30" r="4.8" fill="none" stroke="#FFD080" strokeWidth="1.6" />
        {/* Текст через foreignObject */}
        <foreignObject x="20" y="58" width="75" height="98">
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              color: "white",
              fontFamily: "Nunito, Arial, sans-serif",
              fontWeight: 900,
              fontSize: "10.5px",
              lineHeight: 1.25,
              wordBreak: "break-word",
              padding: "2px 3px",
              textShadow: "0 1px 3px rgba(0,0,0,0.45)",
            }}
          >
            {text}
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}
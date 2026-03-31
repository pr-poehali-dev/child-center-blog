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
        style={{ filter: "drop-shadow(2px 6px 12px rgba(180,100,0,0.45))" }}
      >
        <defs>
          {/* Основной градиент — оранжево-золотой сверху вниз */}
          <linearGradient id="tagGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFD000" />
            <stop offset="35%" stopColor="#FFA500" />
            <stop offset="70%" stopColor="#FF7A00" />
            <stop offset="100%" stopColor="#E55A00" />
          </linearGradient>
          {/* Блик сверху */}
          <linearGradient id="shineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.28" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          {/* Тень-бок правый */}
          <linearGradient id="sideGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#CC5500" />
            <stop offset="100%" stopColor="#993D00" />
          </linearGradient>
        </defs>

        {/* Верёвка */}
        <path d="M62 18 C58 10, 50 4, 40 6 C28 9, 26 22, 36 28 C46 34, 56 22, 62 18Z"
          fill="none" stroke="#B87333" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M62 18 C59 13, 54 7, 46 7"
          fill="none" stroke="#E8C060" strokeWidth="1.1" strokeLinecap="round" opacity="0.8" />

        {/* Гвоздик */}
        <circle cx="39" cy="6" r="5.5" fill="#5A7A9A" />
        <circle cx="39" cy="6" r="3.2" fill="#3D6080" />
        <circle cx="38" cy="5" r="1.3" fill="#9ABDD4" />

        {/* Кольцо — золотое */}
        <circle cx="44" cy="30" r="7.5" fill="none" stroke="#B8860B" strokeWidth="3.2" />
        <circle cx="44" cy="30" r="5.2" fill="none" stroke="#FFD700" strokeWidth="1.8" />

        {/* Тело бирки — градиент */}
        <path
          d="M17 47 L17 153 Q17 162 25 162 L95 162 Q103 162 103 153 L103 47 Q103 38 95 38 L57 38 Q49 38 44 44 L38 50 Q32 56 25 56 Q17 56 17 47Z"
          fill="url(#tagGrad)"
        />

        {/* Блик сверху (глянец) */}
        <path
          d="M17 47 L17 100 Q17 100 25 100 L103 100 L103 47 Q103 38 95 38 L57 38 Q49 38 44 44 L38 50 Q32 56 25 56 Q17 56 17 47Z"
          fill="url(#shineGrad)"
        />

        {/* 3D правый бок */}
        <path
          d="M97 38 Q103 38 103 47 L103 153 Q103 162 95 162 L92 162 Q100 162 100 153 L100 47 Q100 38 92 38Z"
          fill="url(#sideGrad)"
        />

        {/* 3D нижний левый */}
        <path
          d="M17 150 L17 153 Q17 162 25 162 L28 162 Q20 162 20 153 L20 150Z"
          fill="#993D00"
        />

        {/* Отверстие под кольцо */}
        <circle cx="44" cy="30" r="6.5" fill="#993D00" />
        <circle cx="44" cy="30" r="5.2" fill="none" stroke="#FFD700" strokeWidth="1.8" />

        {/* Текст */}
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
              textShadow: "0 1px 4px rgba(120,40,0,0.7)",
            }}
          >
            {text}
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}

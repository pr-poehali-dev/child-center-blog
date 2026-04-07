import { useState, useEffect, useRef } from "react";

export default function EasterEggWidget() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 80, y: 80 });
  const [visible, setVisible] = useState(false);
  const animRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const startPosRef = useRef({ x: 80, y: 80 });
  const targetPosRef = useRef({ x: 80, y: 80 });
  const durationRef = useRef(9000);
  const cycleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

  const getNewTarget = () => {
    const margin = 90;
    return {
      x: margin + Math.random() * (window.innerWidth - margin * 2),
      y: margin + Math.random() * (window.innerHeight - margin * 2),
    };
  };

  const animate = (timestamp: number) => {
    if (!startRef.current) startRef.current = timestamp;
    const elapsed = timestamp - startRef.current;
    const progress = Math.min(elapsed / durationRef.current, 1);
    const eased = easeInOut(progress);
    setPos({
      x: startPosRef.current.x + (targetPosRef.current.x - startPosRef.current.x) * eased,
      y: startPosRef.current.y + (targetPosRef.current.y - startPosRef.current.y) * eased,
    });
    if (progress < 1) {
      animRef.current = requestAnimationFrame(animate);
    } else {
      startPosRef.current = { ...targetPosRef.current };
      targetPosRef.current = getNewTarget();
      durationRef.current = 8000 + Math.random() * 6000;
      startRef.current = null;
      animRef.current = requestAnimationFrame(animate);
    }
  };

  const startCycle = () => {
    setOpen(false);
    cycleRef.current = setTimeout(() => {
      setOpen(true);
      cycleRef.current = setTimeout(() => {
        setOpen(false);
        cycleRef.current = setTimeout(startCycle, 4000);
      }, 5000);
    }, 3000);
  };

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(true);
      targetPosRef.current = getNewTarget();
      animRef.current = requestAnimationFrame(animate);
      startCycle();
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (cycleRef.current) clearTimeout(cycleRef.current);
    };
  }, []);

  if (!visible) return null;

  // SVG размеры
  const W = 100;
  const H = 120;

  // Форма целого яйца (нижняя половина — скорлупа)
  // Яйцо: эллипс примерно cx=50, cy=62, rx=42, ry=52
  const eggCx = 50, eggCy = 64, eggRx = 42, eggRy = 52;

  // Зубчатая линия разлома (~середина яйца по высоте = cy ~38)
  // Зубцы: M 8,40 L 18,30 L 28,40 L 38,30 L 50,42 L 62,30 L 72,40 L 82,30 L 92,40
  const crackY = 44;
  const crackPath = `M 8,${crackY} L 18,${crackY-12} L 28,${crackY} L 38,${crackY-12} L 50,${crackY+2} L 62,${crackY-12} L 72,${crackY} L 82,${crackY-12} L 92,${crackY}`;

  // Нижняя скорлупа — клип ниже зубчатой линии
  const bottomShellClip = `M 8,${crackY} L 18,${crackY-12} L 28,${crackY} L 38,${crackY-12} L 50,${crackY+2} L 62,${crackY-12} L 72,${crackY} L 82,${crackY-12} L 92,${crackY} L 92,130 L 8,130 Z`;

  // Верхняя скорлупа — клип выше зубчатой линии
  const topShellClip = `M 8,${crackY} L 18,${crackY-12} L 28,${crackY} L 38,${crackY-12} L 50,${crackY+2} L 62,${crackY-12} L 72,${crackY} L 82,${crackY-12} L 92,${crackY} L 92,0 L 8,0 Z`;

  return (
    <>
      <style>{`
        @keyframes easter-chick-pop {
          0% { transform: translateY(18px); opacity: 0; }
          60% { transform: translateY(-4px); opacity: 1; }
          80% { transform: translateY(2px); }
          100% { transform: translateY(0px); opacity: 1; }
        }
        @keyframes easter-top-open {
          0% { transform: rotate(0deg) translate(0,0); }
          100% { transform: rotate(-28deg) translate(-12px, -14px); }
        }
        @keyframes easter-top-close {
          0% { transform: rotate(-28deg) translate(-12px, -14px); }
          100% { transform: rotate(0deg) translate(0,0); }
        }
        @keyframes easter-wobble {
          0%,100% { transform: rotate(0deg); }
          25% { transform: rotate(2.5deg); }
          75% { transform: rotate(-2.5deg); }
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          left: pos.x,
          top: pos.y,
          transform: "translate(-50%, -50%)",
          zIndex: 9998,
          pointerEvents: "none",
          userSelect: "none",
          animation: "easter-wobble 2.4s ease-in-out infinite",
        }}
      >
        {/* Табличка над виджетом */}
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#FFFBEA",
            border: "2px solid #D4860A",
            borderRadius: 10,
            padding: "5px 10px",
            fontSize: 10,
            fontWeight: 800,
            color: "#7B3F00",
            textAlign: "center",
            lineHeight: 1.4,
            whiteSpace: "nowrap",
            boxShadow: "0 3px 10px rgba(0,0,0,0.18)",
            fontFamily: "sans-serif",
            opacity: open ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        >
          🐣 Тут есть полезности<br />к Пасхе. Ищи в разделах.
          {/* хвостик */}
          <div style={{
            position: "absolute",
            bottom: -7,
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderTop: "7px solid #D4860A",
          }} />
        </div>

        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
          <defs>
            {/* Клип для нижней скорлупы */}
            <clipPath id="bottom-clip">
              <path d={bottomShellClip} />
            </clipPath>
            {/* Клип для верхней скорлупы */}
            <clipPath id="top-clip">
              <path d={topShellClip} />
            </clipPath>
          </defs>

          {/* Тень */}
          <ellipse cx={eggCx} cy={H - 4} rx={30} ry={5} fill="rgba(0,0,0,0.13)" />

          {/* === НИЖНЯЯ ПОЛОВИНА СКОРЛУПЫ === */}
          <g clipPath="url(#bottom-clip)">
            {/* Основа яйца — пасхальный цвет */}
            <ellipse cx={eggCx} cy={eggCy} rx={eggRx} ry={eggRy} fill="#F9E4B7" />
            {/* Пасхальные узоры */}
            {/* Горизонтальные волны */}
            <path d={`M 10,70 Q 20,64 30,70 Q 40,76 50,70 Q 60,64 70,70 Q 80,76 90,70`}
              fill="none" stroke="#E07B54" strokeWidth="2.5" strokeLinecap="round" />
            <path d={`M 14,82 Q 24,76 34,82 Q 44,88 54,82 Q 64,76 76,82 Q 84,88 90,84`}
              fill="none" stroke="#5BB8A0" strokeWidth="2.5" strokeLinecap="round" />
            {/* Цветочки / точки */}
            <circle cx={26} cy={56} r={3} fill="#FF8FAB" />
            <circle cx={50} cy={54} r={3.5} fill="#A8D8A8" />
            <circle cx={74} cy={56} r={3} fill="#FFD166" />
            <circle cx={20} cy={92} r={2.5} fill="#FFD166" />
            <circle cx={50} cy={96} r={2.5} fill="#FF8FAB" />
            <circle cx={78} cy={92} r={2.5} fill="#5BB8A0" />
            {/* Блик */}
            <ellipse cx={30} cy={75} rx={5} ry={8} fill="white" opacity={0.18} transform="rotate(-15,30,75)" />
          </g>

          {/* Зубчатая граница (нижняя) — видимый край */}
          <path d={crackPath} fill="none" stroke="#D4860A" strokeWidth="1.5" strokeLinejoin="round" />

          {/* === ЦЫПЛЁНОК внутри нижней части === */}
          <g
            clipPath="url(#bottom-clip)"
            style={{
              animation: open
                ? "easter-chick-pop 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards"
                : undefined,
              opacity: open ? 1 : 0,
              transition: open ? undefined : "opacity 0.3s ease",
            }}
          >
            {/* Тело цыплёнка (жёлтый круг) */}
            <ellipse cx={50} cy={52} rx={22} ry={20} fill="#FFD34E" />
            {/* Голова */}
            <circle cx={50} cy={32} r={16} fill="#FFD34E" />
            {/* Крылышки */}
            <ellipse cx={28} cy={48} rx={8} ry={5} fill="#FFC107" transform="rotate(-20,28,48)" />
            <ellipse cx={72} cy={48} rx={8} ry={5} fill="#FFC107" transform="rotate(20,72,48)" />
            {/* Глаза */}
            <circle cx={44} cy={29} r={4} fill="#1a1a1a" />
            <circle cx={56} cy={29} r={4} fill="#1a1a1a" />
            <circle cx={45.2} cy={27.8} r={1.2} fill="white" />
            <circle cx={57.2} cy={27.8} r={1.2} fill="white" />
            {/* Клюв */}
            <path d="M 46,34 L 50,40 L 54,34 Z" fill="#FF8C00" />
            {/* Румянец */}
            <ellipse cx={38} cy={35} rx={4} ry={2.5} fill="#FFB3B3" opacity={0.7} />
            <ellipse cx={62} cy={35} rx={4} ry={2.5} fill="#FFB3B3" opacity={0.7} />
          </g>

          {/* === ВЕРХНЯЯ ПОЛОВИНА СКОРЛУПЫ === */}
          <g
            style={{
              transformOrigin: "50px 44px",
              animation: open
                ? "easter-top-open 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards"
                : "easter-top-close 0.4s ease forwards",
            }}
          >
            <g clipPath="url(#top-clip)">
              {/* Основа верхушки */}
              <ellipse cx={eggCx} cy={eggCy} rx={eggRx} ry={eggRy} fill="#F9E4B7" />
              {/* Пасхальные узоры верхушки */}
              <path d={`M 16,38 Q 26,30 36,38 Q 44,30 54,38 Q 64,30 74,38 Q 82,30 90,36`}
                fill="none" stroke="#9B5DE5" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx={28} cy={20} r={3.5} fill="#FF8FAB" />
              <circle cx={50} cy={14} r={3} fill="#A8D8A8" />
              <circle cx={70} cy={20} r={3.5} fill="#9B5DE5" />
              <circle cx={38} cy={30} r={2.5} fill="#FFD166" />
              <circle cx={62} cy={30} r={2.5} fill="#E07B54" />
              {/* Блик верхушки */}
              <ellipse cx={30} cy={18} rx={5} ry={8} fill="white" opacity={0.2} transform="rotate(-15,30,18)" />
            </g>
            {/* Зубчатый край верхней крышки */}
            <path d={crackPath} fill="#F9E4B7" stroke="#D4860A" strokeWidth="1.5" strokeLinejoin="round" />
          </g>
        </svg>
      </div>
    </>
  );
}

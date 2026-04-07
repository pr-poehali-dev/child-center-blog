import { useState, useEffect, useRef } from "react";

// Виджет активен до 14 апреля включительно
const HIDE_AFTER = new Date("2026-04-15T00:00:00");

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
    cycleRef.current = setTimeout(() => {
      setOpen(true);
      cycleRef.current = setTimeout(() => {
        setOpen(false);
        cycleRef.current = setTimeout(startCycle, 5000);
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

  if (new Date() >= HIDE_AFTER) return null;
  if (!visible) return null;

  // Зубчатая линия разлома
  const crackY = 58;
  const crack = `M 9,${crackY} L 20,${crackY-13} L 30,${crackY} L 42,${crackY-13} L 52,${crackY+2} L 63,${crackY-13} L 74,${crackY} L 84,${crackY-13} L 93,${crackY}`;
  const bottomClip = `M 9,${crackY} L 20,${crackY-13} L 30,${crackY} L 42,${crackY-13} L 52,${crackY+2} L 63,${crackY-13} L 74,${crackY} L 84,${crackY-13} L 93,${crackY} L 93,140 L 9,140 Z`;
  const topClip    = `M 9,${crackY} L 20,${crackY-13} L 30,${crackY} L 42,${crackY-13} L 52,${crackY+2} L 63,${crackY-13} L 74,${crackY} L 84,${crackY-13} L 93,${crackY} L 93,0 L 9,0 Z`;

  // Путь яйца целиком
  const eggPath = "M 51,4 C 28,4 9,28 9,60 C 9,90 27,114 51,114 C 75,114 93,90 93,60 C 93,28 74,4 51,4 Z";

  return (
    <>
      <style>{`
        @keyframes eaw-wobble {
          0%,100% { transform: translate(-50%,-50%) rotate(0deg); }
          25%      { transform: translate(-50%,-50%) rotate(2deg); }
          75%      { transform: translate(-50%,-50%) rotate(-2deg); }
        }
        @keyframes eaw-top-open {
          0%   { transform: rotate(0deg) translate(0px,0px); }
          100% { transform: rotate(-32deg) translate(-14px,-16px); }
        }
        @keyframes eaw-top-close {
          0%   { transform: rotate(-32deg) translate(-14px,-16px); }
          100% { transform: rotate(0deg) translate(0px,0px); }
        }
        @keyframes eaw-chick-up {
          0%   { transform: translateY(30px); opacity: 0; }
          60%  { transform: translateY(-5px); opacity: 1; }
          80%  { transform: translateY(2px); }
          100% { transform: translateY(0px); opacity: 1; }
        }
        @keyframes eaw-chick-down {
          0%   { transform: translateY(0px); opacity: 1; }
          100% { transform: translateY(30px); opacity: 0; }
        }
        @keyframes eaw-sign-show {
          0%   { opacity: 0; transform: translateX(-50%) scale(0.7); }
          100% { opacity: 1; transform: translateX(-50%) scale(1); }
        }
      `}</style>

      <div style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        transform: "translate(-50%,-50%)",
        zIndex: 9998,
        pointerEvents: "none",
        userSelect: "none",
        animation: "eaw-wobble 2.8s ease-in-out infinite",
        width: 102,
        height: 160,
      }}>

        {/* Табличка */}
        {open && (
          <div style={{
            position: "absolute",
            bottom: "calc(100% + 4px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#FFFBEA",
            border: "2px solid #C0392B",
            borderRadius: 10,
            padding: "5px 10px",
            fontSize: 10,
            fontWeight: 800,
            color: "#7B1A1A",
            textAlign: "center",
            lineHeight: 1.4,
            whiteSpace: "nowrap",
            boxShadow: "0 3px 12px rgba(0,0,0,0.22)",
            fontFamily: "sans-serif",
            animation: "eaw-sign-show 0.4s ease forwards",
          }}>
            🐣 Тут есть полезности<br />к Пасхе. Ищи в разделах.
            <div style={{
              position: "absolute", bottom: -7, left: "50%",
              transform: "translateX(-50%)",
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "7px solid #C0392B",
            }} />
          </div>
        )}

        <svg width="102" height="160" viewBox="0 0 102 160" style={{ overflow: "visible", display: "block" }}>
          <defs>
            <clipPath id="eaw-bottom">
              <path d={bottomClip} />
            </clipPath>
            <clipPath id="eaw-top">
              <path d={topClip} />
            </clipPath>
            <clipPath id="eaw-egg-full">
              <path d={eggPath} />
            </clipPath>
            {/* Радиальный градиент для объёма */}
            <radialGradient id="eaw-grad-bottom" cx="38%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#E84040" />
              <stop offset="100%" stopColor="#8B0000" />
            </radialGradient>
            <radialGradient id="eaw-grad-top" cx="38%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#E84040" />
              <stop offset="100%" stopColor="#8B0000" />
            </radialGradient>
          </defs>

          {/* Тень */}
          <ellipse cx="51" cy="122" rx="32" ry="6" fill="rgba(0,0,0,0.18)" />

          {/* ===== НИЖНЯЯ ПОЛОВИНА СКОРЛУПЫ ===== */}
          <g clipPath="url(#eaw-bottom)">
            {/* Фон яйца */}
            <path d={eggPath} fill="url(#eaw-grad-bottom)" />
            {/* Цветочный узор — нижняя часть */}
            {/* Большой цветок слева-снизу */}
            <g transform="translate(22, 85)">
              {[0,45,90,135,180,225,270,315].map((a,i) => (
                <ellipse key={i} cx={0} cy={-10} rx={4} ry={8}
                  fill={i % 2 === 0 ? "#FFD700" : "#FFF176"}
                  transform={`rotate(${a})`} opacity={0.92} />
              ))}
              <circle cx={0} cy={0} r={5} fill="#FF8C00" />
              <circle cx={0} cy={0} r={2.5} fill="#FFD700" />
            </g>
            {/* Маленький цветок справа */}
            <g transform="translate(72, 75)">
              {[0,60,120,180,240,300].map((a,i) => (
                <ellipse key={i} cx={0} cy={-7} rx={3} ry={6}
                  fill={i % 2 === 0 ? "#FFFFFF" : "#FFF9C4"}
                  transform={`rotate(${a})`} opacity={0.85} />
              ))}
              <circle cx={0} cy={0} r={3.5} fill="#FFD700" />
            </g>
            {/* Средний цветок центр */}
            <g transform="translate(50, 95)">
              {[0,60,120,180,240,300].map((a,i) => (
                <ellipse key={i} cx={0} cy={-8} rx={3.5} ry={7}
                  fill={i % 2 === 0 ? "#FFD700" : "#FF8C00"}
                  transform={`rotate(${a})`} opacity={0.9} />
              ))}
              <circle cx={0} cy={0} r={4} fill="#FFFFFF" opacity={0.8} />
            </g>
            {/* Листики */}
            <ellipse cx={35} cy={70} rx={3} ry={7} fill="#A8D5A2" transform="rotate(30,35,70)" opacity={0.8} />
            <ellipse cx={65} cy={100} rx={3} ry={7} fill="#A8D5A2" transform="rotate(-25,65,100)" opacity={0.8} />
            <ellipse cx={20} cy={100} rx={2.5} ry={6} fill="#A8D5A2" transform="rotate(50,20,100)" opacity={0.8} />
            {/* Точки-акценты */}
            <circle cx={60} cy={68} r={2} fill="#FFD700" opacity={0.9} />
            <circle cx={28} cy={108} r={2} fill="#FFFFFF" opacity={0.8} />
            <circle cx={75} cy={95} r={1.8} fill="#FFD700" opacity={0.9} />
            {/* Блик */}
            <ellipse cx={30} cy={70} rx={6} ry={12} fill="white" opacity={0.12} transform="rotate(-15,30,70)" />
          </g>

          {/* Видимый зубчатый край (нижняя граница) */}
          <path d={crack} fill="none" stroke="#6B0000" strokeWidth="1.5" strokeLinejoin="round" />

          {/* ===== ЦЫПЛЁНОК — поверх нижней скорлупы, без клипа ===== */}
          <g style={{
            animation: open
              ? "eaw-chick-up 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards"
              : "eaw-chick-down 0.35s ease forwards",
            transformOrigin: "51px 55px",
          }}>
            {/* Тело */}
            <ellipse cx={51} cy={62} rx={20} ry={18} fill="#FFD34E" />
            {/* Голова */}
            <circle cx={51} cy={42} r={15} fill="#FFD34E" />
            {/* Крылышки */}
            <ellipse cx={30} cy={58} rx={9} ry={5} fill="#FFC107" transform="rotate(-20,30,58)" />
            <ellipse cx={72} cy={58} rx={9} ry={5} fill="#FFC107" transform="rotate(20,72,58)" />
            {/* Глаза */}
            <circle cx={45} cy={39} r={4.5} fill="#1a1a1a" />
            <circle cx={57} cy={39} r={4.5} fill="#1a1a1a" />
            <circle cx={46.3} cy={37.5} r={1.5} fill="white" />
            <circle cx={58.3} cy={37.5} r={1.5} fill="white" />
            {/* Клюв */}
            <path d="M 47,44 L 51,51 L 55,44 Z" fill="#FF8C00" />
            {/* Румянец */}
            <ellipse cx={38} cy={46} rx={4.5} ry={2.8} fill="#FFB3B3" opacity={0.7} />
            <ellipse cx={64} cy={46} rx={4.5} ry={2.8} fill="#FFB3B3" opacity={0.7} />
            {/* Хохолок */}
            <ellipse cx={47} cy={27} rx={3} ry={6} fill="#FFC107" transform="rotate(-15,47,27)" />
            <ellipse cx={51} cy={25} rx={2.5} ry={6} fill="#FFD34E" />
            <ellipse cx={55} cy={27} rx={3} ry={6} fill="#FFC107" transform="rotate(15,55,27)" />
          </g>

          {/* ===== ВЕРХНЯЯ ПОЛОВИНА СКОРЛУПЫ — поверх цыплёнка ===== */}
          <g style={{
            transformOrigin: "51px 58px",
            animation: open
              ? "eaw-top-open 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards"
              : "eaw-top-close 0.4s ease forwards",
          }}>
            <g clipPath="url(#eaw-top)">
              {/* Фон верхушки */}
              <path d={eggPath} fill="url(#eaw-grad-top)" />
              {/* Узоры верхушки */}
              {/* Большой цветок в центре верха */}
              <g transform="translate(51, 30)">
                {[0,45,90,135,180,225,270,315].map((a,i) => (
                  <ellipse key={i} cx={0} cy={-11} rx={4.5} ry={9}
                    fill={i % 2 === 0 ? "#FFD700" : "#FFF9C4"}
                    transform={`rotate(${a})`} opacity={0.92} />
                ))}
                <circle cx={0} cy={0} r={5.5} fill="#FF8C00" />
                <circle cx={0} cy={0} r={2.8} fill="#FFD700" />
              </g>
              {/* Маленький цветок слева */}
              <g transform="translate(24, 46)">
                {[0,60,120,180,240,300].map((a,i) => (
                  <ellipse key={i} cx={0} cy={-6} rx={2.5} ry={5}
                    fill={i % 2 === 0 ? "#FFFFFF" : "#FFF9C4"}
                    transform={`rotate(${a})`} opacity={0.85} />
                ))}
                <circle cx={0} cy={0} r={3} fill="#FFD700" />
              </g>
              {/* Маленький цветок справа */}
              <g transform="translate(78, 46)">
                {[0,60,120,180,240,300].map((a,i) => (
                  <ellipse key={i} cx={0} cy={-6} rx={2.5} ry={5}
                    fill={i % 2 === 0 ? "#FFD700" : "#FF8C00"}
                    transform={`rotate(${a})`} opacity={0.85} />
                ))}
                <circle cx={0} cy={0} r={3} fill="#FFFFFF" opacity={0.9} />
              </g>
              {/* Листики */}
              <ellipse cx={37} cy={20} rx={2.5} ry={6} fill="#A8D5A2" transform="rotate(-30,37,20)" opacity={0.8} />
              <ellipse cx={65} cy={20} rx={2.5} ry={6} fill="#A8D5A2" transform="rotate(30,65,20)" opacity={0.8} />
              {/* Блик */}
              <ellipse cx={30} cy={22} rx={5} ry={9} fill="white" opacity={0.15} transform="rotate(-15,30,22)" />
              {/* Точки */}
              <circle cx={35} cy={50} r={1.8} fill="#FFD700" opacity={0.9} />
              <circle cx={67} cy={50} r={1.8} fill="#FFFFFF" opacity={0.8} />
            </g>
            {/* Зубчатый край верхней крышки */}
            <path d={crack} fill="#C0392B" stroke="#6B0000" strokeWidth="1.2" strokeLinejoin="round" />
          </g>
        </svg>
      </div>
    </>
  );
}
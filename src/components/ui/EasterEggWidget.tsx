import { useState, useEffect, useRef } from "react";

const CHICK_IMG = "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/files/a3629151-7df7-4c32-b8b7-82c8ba8bcb27.jpg";

const EGG_COLORS = {
  body: ["#F9C74F", "#F4A261", "#E76F51", "#90BE6D"],
  stripe1: "#FF6B6B",
  stripe2: "#4ECDC4",
  dot: "#FFE66D",
};

export default function EasterEggWidget() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 30, y: 60 });
  const [visible, setVisible] = useState(false);
  const animRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const startPosRef = useRef({ x: 30, y: 60 });
  const targetPosRef = useRef({ x: 30, y: 60 });
  const durationRef = useRef(8000);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const openTimer = setTimeout(() => setOpen(true), 3200);
    const closeTimer = setTimeout(() => setOpen(false), 7000);
    return () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  }, [visible]);

  const getNewTarget = () => {
    const margin = 120;
    const x = margin + Math.random() * (window.innerWidth - margin * 2);
    const y = margin + Math.random() * (window.innerHeight - margin * 2);
    return { x, y };
  };

  const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

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
      durationRef.current = 7000 + Math.random() * 5000;
      startRef.current = null;
      animRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (!visible) return;
    targetPosRef.current = getNewTarget();
    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <div style={{ position: "relative", width: 80, height: 120 }}>

        {/* Цыплёнок — выезжает из яйца */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: open ? "68px" : "46px",
            transform: "translateX(-50%)",
            transition: "bottom 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s",
            opacity: open ? 1 : 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          {/* Табличка */}
          <div
            style={{
              background: "#FFF9E6",
              border: "2.5px solid #C97D2C",
              borderRadius: 8,
              padding: "4px 8px",
              fontSize: 9,
              fontWeight: 800,
              color: "#7B3F00",
              textAlign: "center",
              lineHeight: 1.3,
              maxWidth: 100,
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              fontFamily: "sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            🐣 Тут есть полезности<br />к Пасхе. Ищи в разделах.
          </div>
          {/* Ножка таблички */}
          <div style={{ width: 2, height: 6, background: "#C97D2C", borderRadius: 1 }} />
          {/* Цыплёнок */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              overflow: "hidden",
              border: "3px solid #FFC93C",
              boxShadow: "0 4px 12px rgba(255,180,0,0.4)",
              background: "#FFF9C4",
            }}
          >
            <img
              src={CHICK_IMG}
              alt="цыплёнок"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
            />
          </div>
        </div>

        {/* Верхняя часть яйца — откидывается */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: `translateX(-50%) ${open ? "rotate(-35deg) translateY(-10px) translateX(-10px)" : "rotate(0deg)"}`,
            transformOrigin: "bottom right",
            transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
            width: 64,
            height: 48,
            zIndex: 2,
          }}
        >
          <svg viewBox="0 0 64 48" width="64" height="48">
            <ellipse cx="32" cy="30" rx="30" ry="26" fill="#F4A261" />
            {/* Узоры на верхушке */}
            <ellipse cx="32" cy="30" rx="30" ry="26" fill="none" stroke="#E76F51" strokeWidth="3" strokeDasharray="8 5" />
            <circle cx="20" cy="22" r="4" fill="#FF6B6B" opacity="0.7" />
            <circle cx="44" cy="25" r="3" fill="#4ECDC4" opacity="0.8" />
            <circle cx="32" cy="16" r="3.5" fill="#FFE66D" opacity="0.9" />
            <circle cx="14" cy="32" r="2.5" fill="#FFE66D" opacity="0.7" />
            <circle cx="50" cy="35" r="2.5" fill="#FF6B6B" opacity="0.7" />
          </svg>
        </div>

        {/* Нижняя часть яйца */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: 72,
            height: 80,
            zIndex: 1,
          }}
        >
          <svg viewBox="0 0 72 80" width="72" height="80">
            {/* Тень */}
            <ellipse cx="36" cy="76" rx="26" ry="5" fill="rgba(0,0,0,0.12)" />
            {/* Тело яйца */}
            <path
              d="M36 2 C16 2 6 22 6 44 C6 64 18 76 36 76 C54 76 66 64 66 44 C66 22 56 2 36 2Z"
              fill="#F9C74F"
            />
            {/* Узоры */}
            <path d="M10 38 Q20 32 30 38 Q40 44 50 38 Q60 32 68 38" fill="none" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round" />
            <path d="M8 52 Q18 46 28 52 Q38 58 48 52 Q58 46 68 52" fill="none" stroke="#4ECDC4" strokeWidth="3" strokeLinecap="round" />
            {/* Точки */}
            <circle cx="22" cy="28" r="3.5" fill="#FF6B6B" opacity="0.8" />
            <circle cx="50" cy="28" r="3.5" fill="#4ECDC4" opacity="0.8" />
            <circle cx="36" cy="22" r="3" fill="#90BE6D" opacity="0.9" />
            <circle cx="18" cy="62" r="3" fill="#FFE66D" opacity="0.8" />
            <circle cx="54" cy="62" r="3" fill="#FF6B6B" opacity="0.8" />
            <circle cx="36" cy="66" r="2.5" fill="#4ECDC4" opacity="0.8" />
            {/* Блик */}
            <ellipse cx="25" cy="20" rx="6" ry="9" fill="white" opacity="0.2" transform="rotate(-15 25 20)" />
          </svg>
        </div>

      </div>

      {/* Покачивание */}
      <style>{`
        @keyframes egg-wobble {
          0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
          20% { transform: translate(-50%, -50%) rotate(3deg); }
          40% { transform: translate(-50%, -50%) rotate(-3deg); }
          60% { transform: translate(-50%, -50%) rotate(2deg); }
          80% { transform: translate(-50%, -50%) rotate(-2deg); }
        }
        @keyframes egg-bounce {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); }
          50% { transform: translate(-50%, -50%) translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

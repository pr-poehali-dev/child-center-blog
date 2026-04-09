import { useState, useEffect, useRef } from "react";

const HIDE_AFTER = new Date("2026-04-15T00:00:00");

interface Props {
  onDone?: () => void;
}

export default function EasterEggWidget({ onDone }: Props) {
  const [phase, setPhase] = useState<"in" | "visible" | "out" | "gone">("in");
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cycleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didDismiss = useRef(false);

  const dismiss = () => {
    if (didDismiss.current) return;
    didDismiss.current = true;
    if (cycleRef.current) clearTimeout(cycleRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(false);
    setPhase("out");
    setTimeout(() => { setPhase("gone"); onDone?.(); }, 700);
  };

  useEffect(() => {
    if (new Date() >= HIDE_AFTER) {
      onDone?.();
      return;
    }

    const t1 = setTimeout(() => setPhase("visible"), 50);

    const startCycle = () => {
      cycleRef.current = setTimeout(() => {
        setOpen(true);
        cycleRef.current = setTimeout(() => {
          setOpen(false);
          cycleRef.current = setTimeout(startCycle, 4000);
        }, 5000);
      }, 2000);
    };
    startCycle();

    const t2 = setTimeout(() => {
      dismiss();
    }, 20000);

    timerRef.current = t2;

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (cycleRef.current) clearTimeout(cycleRef.current);
    };
  }, []);

  if (new Date() >= HIDE_AFTER) return null;
  if (phase === "gone") return null;

  const crackY = 58;
  const crack = `M 9,${crackY} L 20,${crackY - 13} L 30,${crackY} L 42,${crackY - 13} L 52,${crackY + 2} L 63,${crackY - 13} L 74,${crackY} L 84,${crackY - 13} L 93,${crackY}`;
  const bottomClip = `M 9,${crackY} L 20,${crackY - 13} L 30,${crackY} L 42,${crackY - 13} L 52,${crackY + 2} L 63,${crackY - 13} L 74,${crackY} L 84,${crackY - 13} L 93,${crackY} L 93,140 L 9,140 Z`;
  const topClip    = `M 9,${crackY} L 20,${crackY - 13} L 30,${crackY} L 42,${crackY - 13} L 52,${crackY + 2} L 63,${crackY - 13} L 74,${crackY} L 84,${crackY - 13} L 93,${crackY} L 93,0 L 9,0 Z`;
  const eggPath = "M 51,4 C 28,4 9,28 9,60 C 9,90 27,114 51,114 C 75,114 93,90 93,60 C 93,28 74,4 51,4 Z";

  const slideY = phase === "visible" ? "0px" : "160px";

  return (
    <>
      <style>{`
        @keyframes eaw-wobble {
          0%,100% { transform: rotate(0deg); }
          25%      { transform: rotate(2deg); }
          75%      { transform: rotate(-2deg); }
        }
        @keyframes eaw-top-open {
          0%   { transform: rotate(0deg) translate(0px, 0px); }
          100% { transform: rotate(-32deg) translate(-14px, -16px); }
        }
        @keyframes eaw-top-close {
          0%   { transform: rotate(-32deg) translate(-14px, -16px); }
          100% { transform: rotate(0deg) translate(0px, 0px); }
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
        @keyframes eaw-label-show {
          0%   { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0px); }
        }
        @keyframes eaw-sign-show {
          0%   { opacity: 0; transform: scale(0.7); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Внешний div — только position:fixed, без transform */}
      <div
        style={{
          position: "fixed",
          bottom: 20,
          left: 20,
          zIndex: 9998,
        }}
      >
        {/* Внутренний div — только transform для анимации слайда */}
        <div
          style={{
            transform: `translateY(${slideY})`,
            transition: "transform 0.7s cubic-bezier(0.34,1.56,0.64,1)",
            position: "relative",
          }}
        >
        {/* Надпись над яйцом */}
        {phase === "visible" && (
          <div style={{
            marginBottom: 6,
            background: "white",
            border: "2px solid #FDBA74",
            borderRadius: 20,
            padding: "4px 10px",
            fontSize: 11,
            fontWeight: 800,
            color: "#C2410C",
            textAlign: "center",
            whiteSpace: "nowrap",
            boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
            fontFamily: "sans-serif",
            animation: "eaw-label-show 0.4s ease forwards",
          }}>
            🎁 Подарок за подписку!
          </div>
        )}

        {/* Всплывашка при открытии яйца */}
        {open && (
          <div style={{
            position: "absolute",
            bottom: "100%",
            left: "calc(100% + 8px)",
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
            zIndex: 1,
            pointerEvents: "none",
          }}>
            🐣 Тут есть полезности<br />к Пасхе. Ищи в разделах.
            <div style={{
              position: "absolute", top: "50%", left: -7,
              transform: "translateY(-50%)",
              borderTop: "6px solid transparent",
              borderBottom: "6px solid transparent",
              borderRight: "7px solid #C0392B",
            }} />
          </div>
        )}

        {/* Кликабельное яйцо */}
        <div
          onClick={dismiss}
          onTouchEnd={(e) => { e.stopPropagation(); e.preventDefault(); dismiss(); }}
          style={{
            cursor: "pointer",
            userSelect: "none",
            WebkitTapHighlightColor: "transparent",
            display: "inline-block",
          }}
        >
          <div style={{ animation: "eaw-wobble 2.8s ease-in-out infinite" }}>
            <svg width="102" height="160" viewBox="0 0 102 160" style={{ overflow: "visible", display: "block" }}>
              <defs>
                <clipPath id="eaw-bottom"><path d={bottomClip} /></clipPath>
                <clipPath id="eaw-top"><path d={topClip} /></clipPath>
                <radialGradient id="eaw-grad" cx="38%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#E84040" />
                  <stop offset="100%" stopColor="#8B0000" />
                </radialGradient>
              </defs>

              <ellipse cx="51" cy="122" rx="32" ry="6" fill="rgba(0,0,0,0.18)" />

              <g clipPath="url(#eaw-bottom)">
                <path d={eggPath} fill="url(#eaw-grad)" />
                <g transform="translate(22, 85)">
                  {[0,45,90,135,180,225,270,315].map((a, i) => (
                    <ellipse key={i} cx={0} cy={-10} rx={4} ry={8} fill={i % 2 === 0 ? "#FFD700" : "#FFF176"} transform={`rotate(${a})`} opacity={0.92} />
                  ))}
                  <circle cx={0} cy={0} r={5} fill="#FF8C00" />
                  <circle cx={0} cy={0} r={2.5} fill="#FFD700" />
                </g>
                <g transform="translate(72, 75)">
                  {[0,60,120,180,240,300].map((a, i) => (
                    <ellipse key={i} cx={0} cy={-7} rx={3} ry={6} fill={i % 2 === 0 ? "#FFFFFF" : "#FFF9C4"} transform={`rotate(${a})`} opacity={0.85} />
                  ))}
                  <circle cx={0} cy={0} r={3.5} fill="#FFD700" />
                </g>
                <g transform="translate(50, 95)">
                  {[0,60,120,180,240,300].map((a, i) => (
                    <ellipse key={i} cx={0} cy={-8} rx={3.5} ry={7} fill={i % 2 === 0 ? "#FFD700" : "#FF8C00"} transform={`rotate(${a})`} opacity={0.9} />
                  ))}
                  <circle cx={0} cy={0} r={4} fill="#FFFFFF" opacity={0.8} />
                </g>
                <ellipse cx={35} cy={70} rx={3} ry={7} fill="#A8D5A2" transform="rotate(30,35,70)" opacity={0.8} />
                <ellipse cx={65} cy={100} rx={3} ry={7} fill="#A8D5A2" transform="rotate(-25,65,100)" opacity={0.8} />
                <ellipse cx={20} cy={100} rx={2.5} ry={6} fill="#A8D5A2" transform="rotate(50,20,100)" opacity={0.8} />
                <circle cx={60} cy={68} r={2} fill="#FFD700" opacity={0.9} />
                <circle cx={28} cy={108} r={2} fill="#FFFFFF" opacity={0.8} />
                <circle cx={75} cy={95} r={1.8} fill="#FFD700" opacity={0.9} />
                <ellipse cx={30} cy={70} rx={6} ry={12} fill="white" opacity={0.12} transform="rotate(-15,30,70)" />
              </g>

              <path d={crack} fill="none" stroke="#6B0000" strokeWidth="1.5" strokeLinejoin="round" />

              <g style={{
                animation: open ? "eaw-chick-up 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards" : "eaw-chick-down 0.35s ease forwards",
                transformOrigin: "51px 55px",
              }}>
                <ellipse cx={51} cy={62} rx={20} ry={18} fill="#FFD34E" />
                <circle cx={51} cy={42} r={15} fill="#FFD34E" />
                <ellipse cx={30} cy={58} rx={9} ry={5} fill="#FFC107" transform="rotate(-20,30,58)" />
                <ellipse cx={72} cy={58} rx={9} ry={5} fill="#FFC107" transform="rotate(20,72,58)" />
                <circle cx={45} cy={39} r={4.5} fill="#1a1a1a" />
                <circle cx={57} cy={39} r={4.5} fill="#1a1a1a" />
                <circle cx={46.3} cy={37.5} r={1.5} fill="white" />
                <circle cx={58.3} cy={37.5} r={1.5} fill="white" />
                <path d="M 47,44 L 51,51 L 55,44 Z" fill="#FF8C00" />
                <ellipse cx={38} cy={46} rx={4.5} ry={2.8} fill="#FFB3B3" opacity={0.7} />
                <ellipse cx={64} cy={46} rx={4.5} ry={2.8} fill="#FFB3B3" opacity={0.7} />
                <ellipse cx={47} cy={27} rx={3} ry={6} fill="#FFC107" transform="rotate(-15,47,27)" />
                <ellipse cx={51} cy={25} rx={2.5} ry={6} fill="#FFD34E" />
                <ellipse cx={55} cy={27} rx={3} ry={6} fill="#FFC107" transform="rotate(15,55,27)" />
              </g>

              <g style={{
                transformOrigin: "51px 58px",
                animation: open ? "eaw-top-open 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards" : "eaw-top-close 0.4s ease forwards",
              }}>
                <g clipPath="url(#eaw-top)">
                  <path d={eggPath} fill="url(#eaw-grad)" />
                  <g transform="translate(51, 30)">
                    {[0,45,90,135,180,225,270,315].map((a, i) => (
                      <ellipse key={i} cx={0} cy={-11} rx={4.5} ry={9} fill={i % 2 === 0 ? "#FFD700" : "#FFF9C4"} transform={`rotate(${a})`} opacity={0.92} />
                    ))}
                    <circle cx={0} cy={0} r={5.5} fill="#FF8C00" />
                    <circle cx={0} cy={0} r={2.8} fill="#FFD700" />
                  </g>
                  <g transform="translate(24, 46)">
                    {[0,60,120,180,240,300].map((a, i) => (
                      <ellipse key={i} cx={0} cy={-6} rx={2.5} ry={5} fill={i % 2 === 0 ? "#FFFFFF" : "#FFF9C4"} transform={`rotate(${a})`} opacity={0.85} />
                    ))}
                    <circle cx={0} cy={0} r={3} fill="#FFD700" />
                  </g>
                  <g transform="translate(78, 46)">
                    {[0,60,120,180,240,300].map((a, i) => (
                      <ellipse key={i} cx={0} cy={-6} rx={2.5} ry={5} fill={i % 2 === 0 ? "#FFD700" : "#FF8C00"} transform={`rotate(${a})`} opacity={0.85} />
                    ))}
                    <circle cx={0} cy={0} r={3} fill="#FFFFFF" opacity={0.9} />
                  </g>
                  <ellipse cx={37} cy={20} rx={2.5} ry={6} fill="#A8D5A2" transform="rotate(-30,37,20)" opacity={0.8} />
                  <ellipse cx={65} cy={20} rx={2.5} ry={6} fill="#A8D5A2" transform="rotate(30,65,20)" opacity={0.8} />
                  <ellipse cx={30} cy={22} rx={5} ry={9} fill="white" opacity={0.15} transform="rotate(-15,30,22)" />
                  <circle cx={35} cy={50} r={1.8} fill="#FFD700" opacity={0.9} />
                  <circle cx={67} cy={50} r={1.8} fill="#FFFFFF" opacity={0.8} />
                </g>
                <path d={crack} fill="#C0392B" stroke="#6B0000" strokeWidth="1.2" strokeLinejoin="round" />
              </g>
            </svg>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
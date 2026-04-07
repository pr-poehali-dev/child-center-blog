import { useState } from "react";
import Icon from "@/components/ui/icon";

const HIDE_AFTER = new Date("2026-04-15T00:00:00");

const CHICK_URL = "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/20ec02b6-392b-4e22-8ce0-d88bf6826a5d.png";
const EGGS_GRASS_URL = "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/83c5295c-0823-45ea-acad-720ffcf8b877.png";
const TABLET_URL = "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/22bfd275-9eba-4ebc-9662-2f9322160dca.png";

export default function EasterBanner() {
  const [closed, setClosed] = useState(false);

  if (new Date() >= HIDE_AFTER || closed) return null;

  return (
    <>
      <style>{`
        @keyframes eb-float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-5px); } }
        .eb-float  { animation: eb-float 3s ease-in-out infinite; }
        .eb-float2 { animation: eb-float 3.5s ease-in-out 0.6s infinite; }
        .eb-title  { font-family: 'Marck Script', cursive; }
      `}</style>

      {/* Внешняя обёртка — не обрезает содержимое */}
      <div style={{
        background: "linear-gradient(90deg, #fce4ec 0%, #fdf0f5 50%, #fce4ec 100%)",
        borderBottom: "2px solid #f48fb1",
        paddingTop: 30,
        position: "relative",
      }}>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px", position: "relative" }}
          className="flex items-end justify-between"
        >

          {/* Цыплёнок слева — выступает вверх */}
          <div className="eb-float hidden sm:block flex-shrink-0" style={{ marginBottom: 0 }}>
            <img src={CHICK_URL} alt="цыплёнок" style={{ height: 145, width: "auto", display: "block" }} />
          </div>

          {/* Центр */}
          <div className="flex-1 flex flex-col items-center justify-end gap-2 pb-3 px-2">
            <div className="eb-float2">
              <img src={TABLET_URL} alt="табличка" style={{ height: 85, width: "auto" }} />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <span className="eb-title" style={{
                fontSize: "clamp(22px, 4vw, 34px)",
                color: "#c2185b",
                textShadow: "1px 1px 0 #fff, 2px 2px 4px rgba(194,24,91,0.25)",
                whiteSpace: "nowrap",
              }}>
                Светлой Пасхи!
              </span>
              <button
                onClick={() => {
                  document.getElementById("easter-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                style={{ background: "#c2185b", color: "#fff" }}
                className="font-bold text-xs sm:text-sm px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap flex-shrink-0"
              >
                Смотреть →
              </button>
            </div>
          </div>

          {/* Яйца в траве справа */}
          <div className="eb-float hidden sm:block flex-shrink-0" style={{ marginBottom: 0 }}>
            <img src={EGGS_GRASS_URL} alt="пасхальные яйца" style={{ height: 130, width: "auto", display: "block" }} />
          </div>

          {/* Кнопка закрыть */}
          <button
            onClick={() => setClosed(true)}
            className="absolute top-0 right-0 text-pink-400 hover:text-pink-700 transition-colors"
          >
            <Icon name="X" size={16} />
          </button>
        </div>
      </div>
    </>
  );
}

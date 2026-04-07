import { useState } from "react";
import Icon from "@/components/ui/icon";

const HIDE_AFTER = new Date("2026-04-15T00:00:00");

const CHICK_URL = "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/20ec02b6-392b-4e22-8ce0-d88bf6826a5d.png";
const EGGS_GRASS_URL = "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/83c5295c-0823-45ea-acad-720ffcf8b877.png";

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
        .eb-wrap   {
          background: linear-gradient(90deg, #fce4ec 0%, #fdf0f5 50%, #fce4ec 100%);
          border-bottom: 2px solid #f48fb1;
          overflow: visible;
          position: relative;
        }
        .eb-inner {
          max-width: 900px;
          margin: 0 auto;
          padding: 0 16px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          position: relative;
          min-height: 120px;
        }
        .eb-chick {
          flex-shrink: 0;
          margin-top: -50px;
          align-self: flex-end;
        }
        .eb-eggs {
          flex-shrink: 0;
          align-self: flex-end;
        }
      `}</style>

      <div className="eb-wrap w-full">
        <div className="eb-inner">

          {/* Цыплёнок слева — торчит вверх за счёт отрицательного margin-top */}
          <div className="eb-float eb-chick hidden sm:block">
            <img src={CHICK_URL} alt="цыплёнок" style={{ height: 170, width: "auto", display: "block" }} />
          </div>

          {/* Центр — надпись и кнопка */}
          <div className="flex-1 flex flex-row items-center justify-center gap-4 pb-4 px-4">
            <span className="eb-title eb-float2" style={{
              fontSize: "clamp(28px, 5vw, 48px)",
              color: "#c2185b",
              textShadow: "1px 1px 0 #fff, 2px 3px 6px rgba(194,24,91,0.2)",
              whiteSpace: "nowrap",
              lineHeight: 1.2,
            }}>
              Светлой Пасхи!
            </span>
            <button
              onClick={() => {
                document.getElementById("easter-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              style={{ background: "#c2185b", color: "#fff" }}
              className="font-bold text-sm px-5 py-2 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap flex-shrink-0"
            >
              Смотреть →
            </button>
          </div>

          {/* Яйца в траве справа */}
          <div className="eb-float eb-eggs hidden sm:block">
            <img src={EGGS_GRASS_URL} alt="пасхальные яйца" style={{ height: 120, width: "auto", display: "block" }} />
          </div>

          {/* Кнопка закрыть */}
          <button
            onClick={() => setClosed(true)}
            className="absolute top-2 right-2 text-pink-400 hover:text-pink-700 transition-colors"
          >
            <Icon name="X" size={16} />
          </button>
        </div>
      </div>
    </>
  );
}

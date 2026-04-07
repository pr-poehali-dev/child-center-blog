import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const HIDE_AFTER = new Date("2026-04-15T00:00:00");

export default function EasterBanner() {
  const navigate = useNavigate();
  const [closed, setClosed] = useState(false);

  if (new Date() >= HIDE_AFTER || closed) return null;

  return (
    <>
      <style>{`
        @keyframes eb-shine { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
        .eb-shine { animation: eb-shine 2s ease-in-out infinite; }
      `}</style>

      <div
        style={{
          background: "linear-gradient(90deg, #7c3aed 0%, #db2777 40%, #ea580c 75%, #d97706 100%)",
          position: "relative",
          overflow: "hidden",
        }}
        className="w-full"
      >
        {/* Декоративные полоски фона */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 10px, transparent 10px, transparent 20px)",
        }} />

        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3 relative">
          {/* Текст */}
          <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 text-center">
            <span className="eb-shine text-lg sm:text-xl">✨</span>
            <span className="text-white font-black text-sm sm:text-base leading-tight">
              Светлой Пасхи! Пасхальные рецепты, поделки и советы — специально для вас
            </span>
            <button
              onClick={() => {
                const el = document.getElementById("easter-section");
                el?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="flex-shrink-0 bg-white text-purple-700 font-black text-xs sm:text-sm px-4 py-1.5 rounded-full hover:bg-yellow-100 transition-colors whitespace-nowrap"
            >
              Смотреть →
            </button>
          </div>

          {/* Закрыть */}
          <button
            onClick={() => setClosed(true)}
            className="flex-shrink-0 text-white/60 hover:text-white transition-colors ml-1"
          >
            <Icon name="X" size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
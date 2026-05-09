import { useState } from "react";
import Icon from "@/components/ui/icon";

const SHOW_FROM = new Date("2026-05-09T00:00:00");
const HIDE_AFTER = new Date("2026-05-12T00:00:00");

export default function MayDayBanner() {
  const [closed, setClosed] = useState(false);

  const now = new Date();
  if (now < SHOW_FROM || now >= HIDE_AFTER || closed) return null;

  return (
    <>
      <style>{`
        @keyframes mb-shimmer {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes mb-float  { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-4px); } }
        @keyframes mb-pulse  { 0%,100% { opacity:1; } 50% { opacity:0.7; } }
        .mb-banner {
          background: linear-gradient(120deg, #c0392b, #d4603a, #c0392b, #a93226, #c9563a, #b83c2e, #c0392b);
          background-size: 400% 400%;
          animation: mb-shimmer 6s ease infinite;
          border-bottom: 3px solid #e8a838;
        }
        .mb-float  { animation: mb-float 3s ease-in-out infinite; }
        .mb-float2 { animation: mb-float 3.5s ease-in-out 0.4s infinite; }
        .mb-star   { animation: mb-pulse 2s ease-in-out infinite; }
        .mb-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 3px solid #e8a838;
          background: rgba(0,0,0,0.22);
          flex-shrink: 0;
        }
        .mb-badge-num {
          font-family: 'Nunito', sans-serif;
          font-weight: 900;
          font-size: 30px;
          color: #ffd54f;
          line-height: 1;
          text-shadow: 0 1px 6px rgba(0,0,0,0.4);
        }
        .mb-badge-label {
          font-family: 'Nunito', sans-serif;
          font-weight: 700;
          font-size: 13px;
          color: #fff;
          line-height: 1;
          margin-top: 2px;
        }
      `}</style>

      <div className="mb-banner">
        <div style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}>

          {/* Медаль слева */}
          <div className="mb-float hidden sm:block">
            <div className="mb-badge">
              <span className="mb-badge-num">81</span>
              <span className="mb-badge-label">год</span>
            </div>
          </div>

          {/* Центр */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2, padding: "0 16px", textAlign: "center" }}>
            <div className="mb-float2" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="mb-star" style={{ fontSize: 22 }}>⭐</span>
              <span style={{
                fontFamily: "'Nunito', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(20px, 4vw, 34px)",
                color: "#fff",
                letterSpacing: 1,
                textShadow: "1px 2px 8px rgba(0,0,0,0.4)",
              }}>
                С Днём Победы!
              </span>
              <span className="mb-star" style={{ fontSize: 22 }}>⭐</span>
            </div>
            <div style={{ color: "#ffcc80", fontSize: "clamp(12px, 2vw, 15px)", fontWeight: 600 }}>
              Поздравляем всех с великим праздником! 9 мая 🕊️
            </div>
          </div>

          {/* Медаль справа */}
          <div className="mb-float hidden sm:block">
            <div className="mb-badge">
              <span className="mb-badge-num">81</span>
              <span className="mb-badge-label">год</span>
            </div>
          </div>

          {/* Кнопка закрыть */}
          <button
            onClick={() => setClosed(true)}
            className="absolute top-2 right-2 text-red-200 hover:text-white transition-colors"
          >
            <Icon name="X" size={16} />
          </button>
        </div>
      </div>
    </>
  );
}

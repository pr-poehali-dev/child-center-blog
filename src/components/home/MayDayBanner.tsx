import { useState } from "react";
import Icon from "@/components/ui/icon";

const SHOW_FROM = new Date("2026-05-09T00:00:00");
const HIDE_AFTER = new Date("2026-05-12T00:00:00");

const FLOWERS_URL = "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/files/154bc063-f0d5-461d-bede-6ada2896bb66.jpg";

export default function MayDayBanner() {
  const [closed, setClosed] = useState(false);

  const now = new Date();
  if (now < SHOW_FROM || now >= HIDE_AFTER || closed) return null;

  return (
    <>
      <style>{`
        @keyframes mb-float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-5px); } }
        @keyframes mb-pulse { 0%,100% { opacity:1; } 50% { opacity:0.75; } }
        .mb-float  { animation: mb-float 3s ease-in-out infinite; }
        .mb-float2 { animation: mb-float 3.5s ease-in-out 0.4s infinite; }
        .mb-star   { animation: mb-pulse 2s ease-in-out infinite; }
      `}</style>

      <div style={{
        background: "linear-gradient(90deg, #b71c1c 0%, #c62828 40%, #b71c1c 100%)",
        borderBottom: "3px solid #ff8f00",
      }}>
        <div style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}>

          {/* Картинка слева */}
          <div className="mb-float hidden sm:block" style={{ flexShrink: 0 }}>
            <img src={FLOWERS_URL} alt="гвоздики" style={{ height: 90, width: 90, objectFit: "cover", borderRadius: "50%", border: "2px solid #ff8f00", display: "block" }} />
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
            <div style={{
              color: "#ffcc80",
              fontSize: "clamp(12px, 2vw, 15px)",
              fontWeight: 600,
            }}>
              Поздравляем всех с великим праздником! 9 мая 🕊️
            </div>
          </div>

          {/* Картинка справа */}
          <div className="mb-float hidden sm:block" style={{ flexShrink: 0 }}>
            <img src={FLOWERS_URL} alt="гвоздики" style={{ height: 90, width: 90, objectFit: "cover", borderRadius: "50%", border: "2px solid #ff8f00", display: "block", transform: "scaleX(-1)" }} />
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

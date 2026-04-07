import { useNavigate } from "react-router-dom";

const HIDE_AFTER = new Date("2026-04-15T00:00:00");

const EASTER_POSTS = [
  { id: 43, title: "Кулич творожный", desc: "Нежный, воздушный, тает во рту — и дети обожают готовить его вместе с мамой", emoji: "🍰", color: "#fff7ed", border: "#fed7aa", tag: "#ea580c" },
  { id: 44, title: "Пасхальный декупаж яиц", desc: "Красивые пасхальные яйца своими руками — весёлое творчество для детей любого возраста", emoji: "🎨", color: "#fdf4ff", border: "#e9d5ff", tag: "#9333ea" },

];

export default function EasterSection() {
  const navigate = useNavigate();

  if (new Date() >= HIDE_AFTER) return null;

  return (
    <>
      <style>{`
        @keyframes es-float { 0%,100% { transform: translateY(0px) rotate(-2deg); } 50% { transform: translateY(-8px) rotate(2deg); } }
        @keyframes es-float2 { 0%,100% { transform: translateY(0px) rotate(3deg); } 50% { transform: translateY(-10px) rotate(-3deg); } }
        @keyframes es-sparkle { 0%,100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.3); } }
        .es-float { animation: es-float 4s ease-in-out infinite; }
        .es-float2 { animation: es-float2 3.5s ease-in-out 0.5s infinite; }
        .es-sparkle { animation: es-sparkle 2s ease-in-out infinite; }
        .es-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .es-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.12); }
      `}</style>

      <section
        id="easter-section"
        style={{
          background: "linear-gradient(160deg, #fffbeb 0%, #fdf4ff 50%, #fff0f6 100%)",
          position: "relative",
          overflow: "hidden",
        }}
        className="py-16"
      >


        <div className="max-w-4xl mx-auto px-4 relative">

          {/* Заголовок */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="es-sparkle text-2xl">✨</span>
              <span
                className="text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full"
                style={{ background: "linear-gradient(90deg, #f97316, #db2777)", color: "white" }}
              >
                Пасхальная подборка
              </span>
              <span className="es-sparkle text-2xl" style={{ animationDelay: "0.5s" }}>✨</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-800 leading-tight">
              🐥 Готовимся к Пасхе<br />
              <span style={{ color: "#db2777" }}>вместе с детьми</span>
            </h2>
            <p className="text-gray-500 mt-3 text-base max-w-lg mx-auto">
              Рецепты, творчество и советы педагогов — всё для тёплого семейного праздника
            </p>
          </div>

          {/* Карточки */}
          <div className="grid sm:grid-cols-2 gap-5">
            {EASTER_POSTS.map(post => (
              <div
                key={post.id}
                className="es-card rounded-3xl p-6 cursor-pointer"
                style={{
                  background: post.color,
                  border: `2px solid ${post.border}`,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                }}
                onClick={() => navigate(`/blog/${post.id}`)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: post.border }}
                  >
                    {post.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span
                      className="inline-block text-xs font-black px-2.5 py-0.5 rounded-full mb-2"
                      style={{ background: post.tag, color: "white" }}
                    >
                      К Пасхе
                    </span>
                    <h3 className="font-black text-gray-800 text-base leading-snug mb-1">{post.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{post.desc}</p>
                    <div className="mt-3 text-sm font-black" style={{ color: post.tag }}>Читать →</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Нижний акцент */}
          <div className="text-center mt-10">
            <p className="text-gray-400 text-sm">
              🌷 Светлой и радостной Пасхи вашей семье!
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
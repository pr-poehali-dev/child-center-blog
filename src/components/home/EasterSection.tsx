import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import honeyStar from "@/assets/honey-star.png";
import WatercolorWave from "./WatercolorWave";

const HIDE_AFTER = new Date("2026-04-15T00:00:00");

const EASTER_POSTS = [
  { id: 43, title: "Кулич творожный", desc: "Нежный, воздушный, тает во рту — и дети обожают готовить его вместе с мамой" },
  { id: 44, title: "Пасхальный декупаж яиц", desc: "Красивые пасхальные яйца своими руками — весёлое творчество для детей любого возраста" },
];

export default function EasterSection() {
  const navigate = useNavigate();

  if (new Date() >= HIDE_AFTER) return null;

  return (
    <section
      id="easter-section"
      style={{ background: "#FFF9F3", position: "relative", overflow: "hidden" }}
      className="py-16"
    >
      <div className="max-w-4xl mx-auto px-4 relative">

        {/* Заголовок */}
        <div className="text-center mb-10">
          <div
            className="font-caveat text-2xl mb-1 lowercase inline-block"
            style={{ color: "#D9A441" }}
          >
            праздничная подборка
          </div>
          <h2 className="font-playfair font-bold text-3xl sm:text-4xl leading-tight" style={{ color: "#17364A" }}>
            Готовимся к Пасхе вместе с детьми
          </h2>
          <p className="font-golos mt-3 text-base max-w-lg mx-auto" style={{ color: "#4B4B4B" }}>
            Рецепты, творчество и советы педагогов — всё для тёплого семейного праздника
          </p>
        </div>

        {/* Карточки */}
        <div className="grid sm:grid-cols-2 gap-5">
          {EASTER_POSTS.map(post => (
            <div
              key={post.id}
              className="rounded-3xl p-6 cursor-pointer transition-transform hover:-translate-y-1"
              style={{ background: "#FBF6EE", boxShadow: "0 2px 5px rgba(0,0,0,0.05), 0 12px 24px rgba(0,0,0,0.07)" }}
              onClick={() => navigate(`/blog/${post.id}`)}
            >
              <div className="flex items-start gap-4">
                <img src={honeyStar} alt="" className="w-10 h-10 flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <span
                    className="inline-block font-golos text-xs font-bold px-2.5 py-0.5 rounded-full mb-2 text-white"
                    style={{ background: "#E8985F" }}
                  >
                    К Пасхе
                  </span>
                  <h3 className="font-playfair font-bold text-base leading-snug mb-1" style={{ color: "#17364A" }}>{post.title}</h3>
                  <p className="font-golos text-sm leading-relaxed" style={{ color: "#4B4B4B" }}>{post.desc}</p>
                  <div className="mt-3 flex items-center gap-1.5 text-sm font-bold" style={{ color: "#D9A441" }}>
                    Читать
                    <Icon name="ArrowRight" size={14} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Нижний акцент */}
        <div className="text-center mt-10">
          <p className="font-golos text-sm" style={{ color: "#8A8A8A" }}>
            Светлой и радостной Пасхи вашей семье!
          </p>
        </div>
      </div>
      <WatercolorWave />
    </section>
  );
}
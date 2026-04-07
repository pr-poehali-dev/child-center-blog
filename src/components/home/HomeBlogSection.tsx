import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StickerTag from "@/components/ui/sticker-tag";

const STICKERS_API = "https://functions.poehali.dev/abb60737-528d-41b4-95b0-c6cafb4e4e0f";

const POPULAR_POSTS = [
  { id: 43, title: "Кулич творожный", category: "recipes", emoji: "🍰", color: "bg-orange-50", border: "border-orange-200", tag: "bg-orange-100 text-orange-700", label: "Рецепты" },
  { id: 33, title: "Космические пончики⭐", category: "recipes", emoji: "🍩", color: "bg-purple-50", border: "border-purple-200", tag: "bg-purple-100 text-purple-700", label: "Рецепты" },
  { id: 16, title: "Гаджеты. Польза или вред?", category: "tips", emoji: "🎓", color: "bg-amber-50", border: "border-amber-200", tag: "bg-amber-100 text-amber-700", label: "Советы от педагога" },
  { id: 40, title: "Как выбрать летний лагерь для ребенка?", category: "summer", emoji: "☀️", color: "bg-yellow-50", border: "border-yellow-200", tag: "bg-yellow-100 text-yellow-700", label: "Летний клуб" },
  { id: 44, title: "Пасхальный декупаж яиц", category: "creative", emoji: "🎨", color: "bg-pink-50", border: "border-pink-200", tag: "bg-pink-100 text-pink-700", label: "Творчество" },
  { id: 39, title: "Как успокоить истерику ребенка?", category: "tips", emoji: "🎓", color: "bg-amber-50", border: "border-amber-200", tag: "bg-amber-100 text-amber-700", label: "Советы от педагога" },
];

function PopularPosts() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const toggle = () => {
    setOpen(prev => {
      if (!prev) setTimeout(() => document.getElementById("popular-posts-list")?.scrollIntoView({ behavior: "smooth" }), 50);
      return !prev;
    });
  };

  return (
    <>
      <style>{`
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 14px 0 #a855f7aa, 0 0 32px 10px #f472b688, 0 20px 48px 0 #fb923c44; }
          50% { box-shadow: 0 14px 0 #a855f7cc, 0 0 60px 20px #f472b6cc, 0 24px 64px 0 #fb923c77; }
        }
        @keyframes splat-bounce {
          0%, 100% { transform: translateY(0px) rotate(-3deg) scale(1); }
          50% { transform: translateY(-12px) rotate(3deg) scale(1.08); }
        }
        @keyframes wink-left {
          0%, 80%, 100% { ry: 9; }
          85%, 95% { ry: 1; }
        }
        @keyframes wink-right {
          0%, 88%, 100% { ry: 9; }
          92%, 98% { ry: 1; }
        }
        .popular-btn { animation: glow-pulse 2.4s ease-in-out infinite; }
        .popular-btn:hover { animation: none; box-shadow: 0 8px 0 #a855f7, 0 0 80px 28px #f472b6cc, 0 24px 64px 0 #fb923c99; transform: translateY(-4px) scale(1.05); }
        .splat-wrap { animation: splat-bounce 2.6s ease-in-out infinite; display: inline-block; filter: drop-shadow(0 12px 24px rgba(168,85,247,0.5)); }
        .eye-left { animation: wink-left 4s ease-in-out infinite; }
        .eye-right { animation: wink-right 5.5s ease-in-out 1.2s infinite; }
      `}</style>

      <section className="py-16 bg-white flex justify-center">
        <button
          id="popular-posts-toggle"
          onClick={toggle}
          className="popular-btn relative font-black px-14 py-8 rounded-[2.5rem] transition-all duration-300 flex items-center gap-8 cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #fde68a 0%, #fb923c 35%, #f472b6 70%, #a78bfa 100%)",
            border: "4px solid rgba(255,255,255,0.7)",
          }}
        >
          <div className="splat-wrap relative flex-shrink-0" style={{ width: 160, height: 160 }}>
            <img
              src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/541fd8a8-5245-4d70-8595-dad96bdd5912.png"
              alt="клякса"
              style={{ width: 160, height: 160, objectFit: "contain", display: "block" }}
            />
          </div>
          <div className="text-left">
            <div className="text-sm font-bold text-white/80 tracking-widest uppercase mb-1">Читают чаще всего</div>
            <div className="text-4xl font-black text-white leading-tight drop-shadow-lg">Статьи в топе</div>
            <div className="text-white/70 text-base font-semibold mt-1">{open ? "Свернуть ↑" : "Нажми — увидишь ↓"}</div>
          </div>
        </button>
      </section>

      <section id="popular-posts-list" className={`bg-orange-50 overflow-hidden transition-all duration-500 ease-in-out ${open ? "py-14 max-h-[2000px] opacity-100" : "max-h-0 py-0 opacity-0"}`}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-4">
            {POPULAR_POSTS.map(post => (
              <div
                key={post.id}
                onClick={() => navigate(`/blog/${post.id}`)}
                className={`${post.color} border ${post.border} rounded-3xl p-6 cursor-pointer hover:shadow-md transition-all hover:-translate-y-1`}
              >
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${post.tag}`}>
                  {post.emoji} {post.label}
                </span>
                <h3 className="font-black text-gray-800 text-base leading-snug">{post.title}</h3>
                <div className="mt-3 text-orange-500 text-sm font-bold">Читать →</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

interface HomeBlogSectionProps {
  stickers: Record<string, string>;
}

export default function HomeBlogSection({ stickers }: HomeBlogSectionProps) {
  const navigate = useNavigate();

  return (
    <>
      <section id="blog-promo" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="font-caveat text-orange-400 text-2xl mb-2">Блог</div>
            <h2 className="font-black text-4xl text-gray-800">Наш блог</h2>
            <p className="text-gray-500 mt-3 text-lg">Живые истории, советы и важные мысли от педагогов центра</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="relative bg-amber-50 border border-amber-100 rounded-3xl p-8 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer overflow-visible" onClick={() => navigate("/blog?category=tips")}>
              {stickers["tips"] && <div className="absolute -top-4 -right-3 z-10 rotate-[8deg]"><StickerTag text={stickers["tips"]} size="md" /></div>}
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-amber-200 shadow">
                <img src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/0197539d-8a43-48cb-984f-105c0ea5576e.png" alt="Советы от педагога" className="w-full h-full object-cover object-center" />
              </div>
              <h3 className="font-black text-lg text-gray-800 mb-3">Советы от педагога</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Практические советы и наблюдения от наших специалистов — для родителей и детей.</p>
            </div>
            <div className="relative bg-rose-50 border border-rose-100 rounded-3xl p-8 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer overflow-visible" onClick={() => navigate("/blog?category=life")}>
              {stickers["life"] && <div className="absolute -top-4 -right-3 z-10 rotate-[8deg]"><StickerTag text={stickers["life"]} size="md" /></div>}
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-rose-200 shadow">
                <img src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/22e93845-4c2c-4628-880d-afcfec7e8786.png" alt="Наша жизнь на ладони" className="w-full h-full object-cover object-center" />
              </div>
              <h3 className="font-black text-lg text-gray-800 mb-3">Наша жизнь на ладони</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Фото и видео из жизни центра: занятия, праздники, улыбки и добрые моменты.</p>
            </div>
            <div className="relative bg-teal-50 border border-teal-100 rounded-3xl p-8 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer overflow-visible" onClick={() => navigate("/blog?category=detail")}>
              {stickers["detail"] && <div className="absolute -top-4 -right-3 z-10 rotate-[8deg]"><StickerTag text={stickers["detail"]} size="md" /></div>}
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-teal-200 shadow">
                <img src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/a71a6275-d7f8-42f8-aa42-3c09f3686564.png" alt="Подробно о важном" className="w-full h-full object-cover object-center" />
              </div>
              <h3 className="font-black text-lg text-gray-800 mb-3">Подробно о важном</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Развёрнутые материалы о воспитании, развитии и важных темах для семьи.</p>
            </div>
            <div className="relative bg-yellow-50 border border-yellow-100 rounded-3xl p-8 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer overflow-visible" onClick={() => navigate("/blog?category=summer")}>
              {stickers["summer"] && <div className="absolute -top-4 -right-3 z-10 rotate-[8deg]"><StickerTag text={stickers["summer"]} size="md" /></div>}
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-yellow-200 shadow">
                <img src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/2616ec37-92bb-4d46-8895-ba8e9193a111.png" alt="Лето с нами" className="w-full h-full object-cover object-center" />
              </div>
              <h3 className="font-black text-lg text-gray-800 mb-3">Лето с нами. Новости летнего клуба</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Всё о летнем клубе: программа, новости, яркие моменты и анонсы.</p>
            </div>
            <div className="relative bg-indigo-50 border border-indigo-100 rounded-3xl p-8 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer overflow-visible" onClick={() => navigate("/blog?category=afterschool")}>
              {stickers["afterschool"] && <div className="absolute -top-4 -right-3 z-10 rotate-[8deg]"><StickerTag text={stickers["afterschool"]} size="md" /></div>}
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-indigo-200 shadow">
                <img src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/6e1b8fbb-a82f-46f2-bf6e-293d270f8290.png" alt="Группа продлённого дня" className="w-full h-full object-cover object-center" />
              </div>
              <h3 className="font-black text-lg text-gray-800 mb-3">Группа продлённого дня</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Всё о группе продлённого дня: расписание, новости и полезная информация.</p>
            </div>
            <div className="relative bg-sky-50 border border-sky-100 rounded-3xl p-8 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer overflow-visible" onClick={() => navigate("/blog?category=english")}>
              {stickers["english"] && <div className="absolute -top-4 -right-3 z-10 rotate-[8deg]"><StickerTag text={stickers["english"]} size="md" /></div>}
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-sky-200 shadow">
                <img src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/cfee62df-ab60-46fb-98c2-d612abb288c8.png" alt="Группа английского языка" className="w-full h-full object-cover object-center" />
              </div>
              <h3 className="font-black text-lg text-gray-800 mb-3">Группа английского языка</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Новости, материалы и анонсы группы английского языка.</p>
            </div>
            <div className="relative bg-purple-50 border border-purple-100 rounded-3xl p-8 hover:shadow-md transition-all hover:-translate-y-1 overflow-visible">
              {(stickers["experiments"] || stickers["chefs"] || stickers["masters"]) && <div className="absolute -top-4 -right-3 z-10 rotate-[8deg]"><StickerTag text={stickers["experiments"] || stickers["chefs"] || stickers["masters"]} size="md" /></div>}
              <div className="text-center mb-5">
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-purple-200 shadow">
                  <img src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/3a509872-bc53-4f4f-9a6d-82c65ff04619.png" alt="Творим с детьми" className="w-full h-full object-cover object-top" />
                </div>
                <h3 className="font-black text-lg text-gray-800 mb-3">Творим с детьми</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Все секреты мастер-классов тут ↓</p>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => navigate("/blog?category=experiments")} className="flex items-center gap-2 bg-white rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 hover:bg-purple-100 transition-colors text-left">
                  <span className="text-xl">🔬</span> Экспериментаторы
                </button>
                <button onClick={() => navigate("/blog?category=chefs")} className="flex items-center gap-2 bg-white rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 hover:bg-purple-100 transition-colors text-left">
                  <span className="text-xl">👨‍🍳</span> Шеф-повара
                </button>
                <button onClick={() => navigate("/blog?category=masters")} className="flex items-center gap-2 bg-white rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 hover:bg-purple-100 transition-colors text-left">
                  <span className="text-xl">✨</span> Мастера вдохновения
                </button>
              </div>
            </div>
            <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer" onClick={() => navigate("/blog/qa")}>
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-rose-200 shadow">
                <img src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/15744313-9270-4292-bb6b-c44dc00a492a.png" alt="Спрашивали — Отвечаем" className="w-full h-full object-cover object-top" />
              </div>
              <h3 className="font-black text-lg text-gray-800 mb-3">Спрашивали — Отвечаем</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Задайте вопрос нашим педагогам — отвечаем публично, чтобы помочь всем родителям.</p>
            </div>
          </div>
        </div>
      </section>

      <PopularPosts />
    </>
  );
}

export { STICKERS_API };
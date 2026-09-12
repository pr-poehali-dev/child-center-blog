import { useNavigate } from "react-router-dom";
import StickerTag from "@/components/ui/sticker-tag";

const STICKERS_API = "https://functions.poehali.dev/abb60737-528d-41b4-95b0-c6cafb4e4e0f";

interface HomeBlogSectionProps {
  stickers: Record<string, string>;
}

export default function HomeBlogSection({ stickers }: HomeBlogSectionProps) {
  const navigate = useNavigate();

  return (
    <>
      <section id="blog-promo" className="py-24" style={{ background: "#DFF3EA" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="font-caveat text-orange-400 text-2xl mb-2">Блог</div>
            <h2 className="font-black text-4xl text-[#175064]">Наш блог</h2>
            <p className="text-gray-500 mt-3 text-lg">Живые истории, советы и важные мысли от педагогов центра</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="relative bg-amber-50 border border-amber-100 rounded-3xl p-8 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer overflow-visible" onClick={() => navigate("/blog?category=tips")}>
              {stickers["tips"] && <div className="absolute -top-4 -right-3 z-10 rotate-[8deg]"><StickerTag text={stickers["tips"]} size="md" /></div>}
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-amber-200 shadow">
                <img src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/fc2b0c58-4105-46d0-93d5-e373075eb2d0.png" alt="Советы от педагога" className="w-full h-full object-cover object-center" />
              </div>
              <h3 className="font-black text-lg text-gray-800 mb-3">Советы от педагога</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Практические советы и наблюдения от наших специалистов — для родителей и детей.</p>
            </div>
            <div className="relative bg-rose-50 border border-rose-100 rounded-3xl p-8 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer overflow-visible" onClick={() => navigate("/blog?category=life")}>
              {stickers["life"] && <div className="absolute -top-4 -right-3 z-10 rotate-[8deg]"><StickerTag text={stickers["life"]} size="md" /></div>}
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-rose-200 shadow">
                <img src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/3e1180a2-ba29-45c0-977e-b19759634836.png" alt="Наша жизнь на ладони" className="w-full h-full object-cover object-center" />
              </div>
              <h3 className="font-black text-lg text-gray-800 mb-3">Наша жизнь на ладони</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Фото и видео из жизни центра: занятия, праздники, улыбки и добрые моменты.</p>
            </div>
            <div className="relative bg-teal-50 border border-teal-100 rounded-3xl p-8 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer overflow-visible" onClick={() => navigate("/blog?category=detail")}>
              {stickers["detail"] && <div className="absolute -top-4 -right-3 z-10 rotate-[8deg]"><StickerTag text={stickers["detail"]} size="md" /></div>}
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-teal-200 shadow">
                <img src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/072074a0-eccc-4e52-bfc3-895a0133e340.png" alt="Подробно о важном" className="w-full h-full object-cover object-center" />
              </div>
              <h3 className="font-black text-lg text-gray-800 mb-3">Подробно о важном</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Развёрнутые материалы о воспитании, развитии и важных темах для семьи.</p>
            </div>
            <div className="relative bg-yellow-50 border border-yellow-100 rounded-3xl p-8 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer overflow-visible" onClick={() => navigate("/blog?category=summer")}>
              {stickers["summer"] && <div className="absolute -top-4 -right-3 z-10 rotate-[8deg]"><StickerTag text={stickers["summer"]} size="md" /></div>}
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-yellow-200 shadow">
                <img src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/891253d8-5214-4c7a-aca8-7895b0ff0faf.png" alt="Лето с нами" className="w-full h-full object-cover object-center" />
              </div>
              <h3 className="font-black text-lg text-gray-800 mb-3">Лето с нами. Новости летнего клуба</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Всё о летнем клубе: программа, новости, яркие моменты и анонсы.</p>
            </div>
            <div className="relative bg-indigo-50 border border-indigo-100 rounded-3xl p-8 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer overflow-visible" onClick={() => navigate("/blog?category=afterschool")}>
              {stickers["afterschool"] && <div className="absolute -top-4 -right-3 z-10 rotate-[8deg]"><StickerTag text={stickers["afterschool"]} size="md" /></div>}
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-indigo-200 shadow">
                <img src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/75067361-7100-4dfc-a8ff-74dbb3c31f2f.png" alt="Группа продлённого дня" className="w-full h-full object-cover object-center" />
              </div>
              <h3 className="font-black text-lg text-gray-800 mb-3">Группа продлённого дня</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Всё о группе продлённого дня: расписание, новости и полезная информация.</p>
            </div>
            <div className="relative bg-sky-50 border border-sky-100 rounded-3xl p-8 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer overflow-visible" onClick={() => navigate("/blog?category=english")}>
              {stickers["english"] && <div className="absolute -top-4 -right-3 z-10 rotate-[8deg]"><StickerTag text={stickers["english"]} size="md" /></div>}
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-sky-200 shadow">
                <img src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/7cdc878c-d7c7-4f01-9ebf-54f1810638a0.png" alt="Группа английского языка" className="w-full h-full object-cover object-center" />
              </div>
              <h3 className="font-black text-lg text-gray-800 mb-3">Группа английского языка</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Новости, материалы и анонсы группы английского языка.</p>
            </div>
            <div className="relative bg-purple-50 border border-purple-100 rounded-3xl p-8 hover:shadow-md transition-all hover:-translate-y-1 overflow-visible">
              {(stickers["experiments"] || stickers["chefs"] || stickers["masters"]) && <div className="absolute -top-4 -right-3 z-10 rotate-[8deg]"><StickerTag text={stickers["experiments"] || stickers["chefs"] || stickers["masters"]} size="md" /></div>}
              <div className="text-center mb-5">
                <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-purple-200 shadow">
                  <img src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/e3edf15e-5a98-4284-80b2-1fe977766be7.png" alt="Творим с детьми" className="w-full h-full object-cover object-center" />
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
            <div className="relative bg-green-50 border border-green-100 rounded-3xl p-8 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer overflow-visible" onClick={() => navigate("/blog?category=plate")}>
              {stickers["plate"] && <div className="absolute -top-4 -right-3 z-10 rotate-[8deg]"><StickerTag text={stickers["plate"]} size="md" /></div>}
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-green-200 shadow">
                <img src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/a445ee00-c3e9-41a4-aa0f-5d5867132009.png" alt="Тарелка для всех" className="w-full h-full object-cover object-center" />
              </div>
              <h3 className="font-black text-lg text-gray-800 mb-3">Тарелка для всех</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Безглютеновое, безказеиновое и безлактозное питание для самых любимых — для детей.</p>
            </div>
            <div className="relative bg-orange-50 border border-orange-100 rounded-3xl p-8 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer overflow-visible" onClick={() => navigate("/blog?category=yasli")}>
              {stickers["yasli"] && <div className="absolute -top-4 -right-3 z-10 rotate-[8deg]"><StickerTag text={stickers["yasli"]} size="md" /></div>}
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-orange-200 shadow">
                <img src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/1f3a038b-b3f1-4137-bee0-88620b450964.png" alt="Ясли" className="w-full h-full object-cover object-center" />
              </div>
              <h3 className="font-black text-lg text-gray-800 mb-3">Ясли (1,5–3 года)</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Новости и советы ясельной группы: мягкая адаптация, забота и первые шаги к самостоятельности.</p>
            </div>
            <div className="relative bg-yellow-50 border border-yellow-200 rounded-3xl p-8 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer overflow-visible" onClick={() => navigate("/blog?category=school")}>
              {stickers["school"] && <div className="absolute -top-4 -right-3 z-10 rotate-[8deg]"><StickerTag text={stickers["school"]} size="md" /></div>}
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-yellow-300 shadow">
                <img src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/557103f2-a5e2-4b19-bf13-7d385bbdeda7.png" alt="Подготовка к школе" className="w-full h-full object-cover object-center" />
              </div>
              <h3 className="font-black text-lg text-gray-800 mb-3">Подготовка к школе</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Чтение, счёт, письмо и развитие мышления — всё, что нужно будущему первокласснику.</p>
            </div>
            <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer" onClick={() => navigate("/blog/qa")}>
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-rose-200 shadow">
                <img src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/ea37ac57-0151-42c4-96c8-09560aa13604.png" alt="Спрашивали — Отвечаем" className="w-full h-full object-cover object-center" />
              </div>
              <h3 className="font-black text-lg text-gray-800 mb-3">Спрашивали — Отвечаем</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Задайте вопрос нашим педагогам — отвечаем публично, чтобы помочь всем родителям.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export { STICKERS_API };
import { useNavigate } from "react-router-dom";
import StickerTag from "@/components/ui/sticker-tag";
import SectionTitle from "./SectionTitle";

const STICKERS_API = "https://functions.poehali.dev/abb60737-528d-41b4-95b0-c6cafb4e4e0f";

interface CategoryTile {
  id: string;
  title: string;
  description: string;
  image: string;
  stickerKey?: string;
  onClick: (navigate: ReturnType<typeof useNavigate>) => void;
}

const TILES: CategoryTile[] = [
  {
    id: "tips",
    title: "Советы от педагога",
    description: "Практические советы и наблюдения от наших специалистов — для родителей и детей.",
    image: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/fc2b0c58-4105-46d0-93d5-e373075eb2d0.png",
    stickerKey: "tips",
    onClick: nav => nav("/blog?category=tips"),
  },
  {
    id: "life",
    title: "Наша жизнь на ладони",
    description: "Фото и видео из жизни центра: занятия, праздники, улыбки и добрые моменты.",
    image: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/3e1180a2-ba29-45c0-977e-b19759634836.png",
    stickerKey: "life",
    onClick: nav => nav("/blog?category=life"),
  },
  {
    id: "detail",
    title: "Подробно о важном",
    description: "Развёрнутые материалы о воспитании, развитии и важных темах для семьи.",
    image: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/072074a0-eccc-4e52-bfc3-895a0133e340.png",
    stickerKey: "detail",
    onClick: nav => nav("/blog?category=detail"),
  },
  {
    id: "summer",
    title: "Лето с нами. Новости летнего клуба",
    description: "Всё о летнем клубе: программа, новости, яркие моменты и анонсы.",
    image: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/891253d8-5214-4c7a-aca8-7895b0ff0faf.png",
    stickerKey: "summer",
    onClick: nav => nav("/blog?category=summer"),
  },
  {
    id: "afterschool",
    title: "Группа продлённого дня",
    description: "Всё о группе продлённого дня: расписание, новости и полезная информация.",
    image: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/75067361-7100-4dfc-a8ff-74dbb3c31f2f.png",
    stickerKey: "afterschool",
    onClick: nav => nav("/blog?category=afterschool"),
  },
  {
    id: "english",
    title: "Группа английского языка",
    description: "Новости, материалы и анонсы группы английского языка.",
    image: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/cde3cc15-0383-45e7-9c3a-943b8484a102.png",
    stickerKey: "english",
    onClick: nav => nav("/blog?category=english"),
  },
  {
    id: "masters",
    title: "Творим с детьми",
    description: "Экспериментаторы, шеф-повара и мастера вдохновения — все секреты мастер-классов тут.",
    image: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/e3edf15e-5a98-4284-80b2-1fe977766be7.png",
    onClick: nav => nav("/blog?category=experiments"),
  },
  {
    id: "plate",
    title: "Тарелка для всех",
    description: "Безглютеновое, безказеиновое и безлактозное питание для самых любимых — для детей.",
    image: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/a445ee00-c3e9-41a4-aa0f-5d5867132009.png",
    stickerKey: "plate",
    onClick: nav => nav("/blog?category=plate"),
  },
  {
    id: "yasli",
    title: "Ясли (1,5–3 года)",
    description: "Новости и советы ясельной группы: мягкая адаптация, забота и первые шаги к самостоятельности.",
    image: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/1f3a038b-b3f1-4137-bee0-88620b450964.png",
    stickerKey: "yasli",
    onClick: nav => nav("/blog?category=yasli"),
  },
  {
    id: "school",
    title: "Подготовка к школе",
    description: "Чтение, счёт, письмо и развитие мышления — всё, что нужно будущему первокласснику.",
    image: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/557103f2-a5e2-4b19-bf13-7d385bbdeda7.png",
    stickerKey: "school",
    onClick: nav => nav("/blog?category=school"),
  },
  {
    id: "qa",
    title: "Спрашивали — Отвечаем",
    description: "Задайте вопрос нашим педагогам — отвечаем публично, чтобы помочь всем родителям.",
    image: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/ea37ac57-0151-42c4-96c8-09560aa13604.png",
    onClick: nav => nav("/blog/qa"),
  },
];

interface HomeBlogSectionProps {
  stickers: Record<string, string>;
}

export default function HomeBlogSection({ stickers }: HomeBlogSectionProps) {
  const navigate = useNavigate();

  return (
    <section id="blog-promo" className="py-24" style={{ background: "#D3EDE1" }}>
      <div className="max-w-6xl mx-auto px-4">
        <SectionTitle
          overline="блог"
          title="Наш блог"
          description="Живые истории, советы и важные мысли от педагогов центра"
        />
        <div className="grid md:grid-cols-3 gap-6">
          {TILES.map((tile, i) => {
            const stickerText = tile.stickerKey ? stickers[tile.stickerKey] : undefined;
            const tilt = i % 2 === 0 ? "-0.6deg" : "0.6deg";
            return (
              <div
                key={tile.id}
                onClick={() => tile.onClick(navigate)}
                className="group relative rounded-[18px] p-[6px] cursor-pointer transition-transform duration-300 shadow-[0_6px_16px_rgba(23,54,74,0.14),0_16px_40px_rgba(23,54,74,0.16)] md:hover:shadow-[0_10px_22px_rgba(23,54,74,0.18),0_24px_52px_rgba(23,54,74,0.2)]"
                style={{ background: "#FFFFFF", transform: `rotate(${tilt})` }}
                onMouseEnter={e => { if (window.matchMedia("(hover: hover)").matches) e.currentTarget.style.transform = "rotate(0deg) translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = `rotate(${tilt})`; }}
              >
                {stickerText && (
                  <div className="absolute -top-3 -right-2 z-20 rotate-[8deg]">
                    <StickerTag text={stickerText} size="md" />
                  </div>
                )}
                <div
                  className="relative rounded-[14px] overflow-hidden h-[200px]"
                  style={{ boxShadow: "inset 0 0 0 1px rgba(217,164,65,0.35)" }}
                >
                  <img
                    src={tile.image}
                    alt={tile.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: "saturate(1.15) contrast(1.05)" }}
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 h-[70%]"
                    style={{ background: "linear-gradient(180deg, transparent 0%, rgba(251,246,238,0.55) 40%, #FBF6EE 100%)" }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-black text-base text-gray-800 mb-1 leading-snug">{tile.title}</h3>
                    <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">{tile.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export { STICKERS_API };
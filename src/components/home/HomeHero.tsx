import { BookingDropdown } from "./BookingDropdowns";
import honeyStar from "@/assets/honey-star.png";

interface HomeHeroProps {
  onFormClick: () => void;
  onScrollTo: (id: string) => void;
}

interface Polaroid {
  url: string;
  caption: string;
  rotate: number;
}

const POLAROIDS: Polaroid[] = [
  { url: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/886d25b8-fb6a-49da-884e-b62ebb14ebd8.jpg", caption: "малыши", rotate: -3 },
  { url: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/66ff53cc-a574-4fa5-ba0a-cc50bd4b7baa.jpg", caption: "старшие", rotate: 2 },
  { url: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/e3b913e3-8b0a-499d-8945-e6c49eb58b2d.jpg", caption: "продлёнка", rotate: -2.5 },
];

const CARD_WIDTH = 190;
const CARD_PAD = 4;

export default function HomeHero({ onFormClick }: HomeHeroProps) {
  return (
    <section
      id="home"
      className="relative overflow-hidden flex items-center"
      style={{
        minHeight: "calc(100vh - 4rem)",
        backgroundColor: "#FBF6EE",
        backgroundImage: "url('https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/files/8a31947b-4071-467a-9597-b2a82c68f2ff.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 md:py-4 relative z-10 w-full flex flex-col md:flex-row items-center gap-8 md:gap-2">

        {/* СТОЛБИК ПОЛАРОИДОВ — десктоп */}
        <div className="hidden md:flex flex-col items-start shrink-0 relative" style={{ marginLeft: 48 }}>
          {POLAROIDS.map((p, i) => (
            <div key={i} className="relative" style={{ marginTop: i === 0 ? 0 : 10 }}>
              <div
                className="bg-white"
                style={{
                  width: CARD_WIDTH,
                  padding: CARD_PAD,
                  transform: `rotate(${p.rotate}deg) translateX(${i === 1 ? 26 : 0}px)`,
                  boxShadow: "0 2px 5px rgba(0,0,0,0.12), 0 10px 20px rgba(0,0,0,0.14)",
                }}
              >
                <div className="w-full aspect-square overflow-hidden bg-gray-100">
                  <img src={p.url} alt={p.caption} className="w-full h-full object-cover" />
                </div>
                <div
                  className="font-caveat text-center leading-none"
                  style={{ color: "#D9A441", fontSize: 14, marginTop: 2, height: 16 }}
                >
                  {p.caption}
                </div>
              </div>
              {i < POLAROIDS.length - 1 && (
                <img
                  src={honeyStar}
                  alt=""
                  className="absolute z-10"
                  style={{ width: 24, height: 24, right: i === 0 ? 6 : "auto", left: i === 1 ? -8 : "auto", bottom: -14 }}
                />
              )}
            </div>
          ))}
        </div>

        {/* СТОЛБИК ПОЛАРОИДОВ — мобильный, горизонтальный ряд с нахлёстом */}
        <div className="flex md:hidden items-center justify-center order-3 mt-2">
          {POLAROIDS.map((p, i) => (
            <div
              key={i}
              className="bg-white p-1.5 relative"
              style={{
                width: 120,
                marginLeft: i === 0 ? 0 : -30,
                transform: `rotate(${p.rotate}deg)`,
                zIndex: i,
                boxShadow: "0 2px 5px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.12)",
              }}
            >
              <div className="w-full aspect-square overflow-hidden bg-gray-100">
                <img src={p.url} alt={p.caption} className="w-full h-full object-cover" />
              </div>
            </div>
          ))}
        </div>

        {/* ТЕКСТОВАЯ ГРУППА */}
        <div className="flex-1 flex flex-col items-center gap-10 order-2 md:order-none">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="font-playfair text-4xl md:text-5xl font-extrabold text-[#175064] leading-tight mb-4">
              Блог детского центра «Рыбка Долли»
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Статьи педагогов и психолога: адаптация, питание, подготовка к школе — и жизнь нашего центра
            </p>
          </div>

          <div className="text-center max-w-2xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xl mx-auto">
              <button
                onClick={() => document.getElementById("popular-posts")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="flex-1 bg-white hover:bg-orange-50 text-orange-500 font-bold px-8 py-4 rounded-full text-lg border-2 border-orange-200 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                Читать статьи в топе
              </button>
              <BookingDropdown onFormClick={onFormClick} className="flex-1" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
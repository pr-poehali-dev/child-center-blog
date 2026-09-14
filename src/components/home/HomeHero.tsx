import { BookingDropdown } from "./BookingDropdowns";
import honeyStar from "@/assets/honey-star.png";
import flyingStar from "@/assets/flying-star.png";

interface HomeHeroProps {
  onFormClick: () => void;
  onScrollTo: (id: string) => void;
}

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
      {/* Летящая звезда с хвостом — десктоп, над H1 в правой трети */}
      <img
        src={flyingStar}
        alt=""
        className="hidden md:block absolute pointer-events-none select-none"
        style={{
          width: 130,
          top: "16%",
          right: "18%",
          transform: "rotate(-8deg)",
          zIndex: 5,
        }}
      />
      {/* Летящая звезда — мобильная, над H1 */}
      <img
        src={flyingStar}
        alt=""
        className="block md:hidden absolute pointer-events-none select-none"
        style={{
          width: 80,
          top: "10%",
          right: "8%",
          transform: "rotate(-8deg)",
          zIndex: 5,
        }}
      />

      {/* Маленькая медовая звезда у левого края подзаголовка — десктоп */}
      <img
        src={honeyStar}
        alt=""
        className="hidden md:block absolute pointer-events-none select-none"
        style={{ width: 28, opacity: 0.85, top: "52%", left: "20%", transform: "rotate(12deg)", zIndex: 5 }}
      />
      {/* Маленькая медовая звезда у правой кнопки — десктоп */}
      <img
        src={honeyStar}
        alt=""
        className="hidden md:block absolute pointer-events-none select-none"
        style={{ width: 20, opacity: 0.85, bottom: "20%", right: "24%", transform: "rotate(-10deg)", zIndex: 5 }}
      />
      {/* Маленькая медовая звезда на левом гребне волны — десктоп */}
      <img
        src={honeyStar}
        alt=""
        className="hidden md:block absolute pointer-events-none select-none"
        style={{ width: 24, opacity: 0.85, bottom: "10%", left: "6%", transform: "rotate(15deg)", zIndex: 5 }}
      />
      {/* Маленькая медовая звезда у кнопки — мобильная */}
      <img
        src={honeyStar}
        alt=""
        className="block md:hidden absolute pointer-events-none select-none"
        style={{ width: 16, opacity: 0.85, bottom: "24%", right: "10%", transform: "rotate(12deg)", zIndex: 5 }}
      />

      <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col gap-10 relative z-10 w-full">

        {/* ЗАГОЛОВОК */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="font-playfair text-4xl md:text-5xl font-extrabold text-[#175064] leading-tight mb-4">
            Блог детского центра «Рыбка Долли»
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Статьи педагогов и психолога: адаптация, питание, подготовка к школе — и жизнь нашего центра
          </p>
        </div>

        {/* КНОПКИ */}
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
    </section>
  );
}
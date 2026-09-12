import { BookingDropdown } from "./BookingDropdowns";
import HomePolaroidCollage from "./HomePolaroidCollage";

interface HomeHeroProps {
  onFormClick: () => void;
  onScrollTo: (id: string) => void;
}

export default function HomeHero({ onFormClick, onScrollTo }: HomeHeroProps) {
  return (
    <section
      id="home"
      className="pt-20 relative overflow-hidden"
      style={{
        backgroundColor: "#FBF6EE",
        backgroundImage: "url('https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/files/8a31947b-4071-467a-9597-b2a82c68f2ff.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-20 flex flex-col gap-10 relative z-10">

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

        {/* КОЛЛАЖ ЖИВЫХ ФОТО */}
        <HomePolaroidCollage />
      </div>
    </section>
  );
}
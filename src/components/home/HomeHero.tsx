import { useState } from "react";
import Icon from "@/components/ui/icon";
import { BookingDropdown, ContactDropdown } from "./BookingDropdowns";

interface HomeHeroProps {
  onFormClick: () => void;
  onScrollTo: (id: string) => void;
}

export default function HomeHero({ onFormClick, onScrollTo }: HomeHeroProps) {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section id="home" className="pt-20 min-h-screen flex items-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-orange-100 rounded-full opacity-60 blur-2xl" />
        <div className="absolute bottom-20 right-20 w-56 h-56 bg-yellow-100 rounded-full opacity-60 blur-2xl" />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-rose-100 rounded-full opacity-30 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col gap-8 relative z-10">

        {/* ЗАГОЛОВОК */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-16 mb-6">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-5 py-2 rounded-full" style={{fontFamily: 'Pacifico, cursive', fontSize: '1.25rem'}}>
              <span>✨</span> Детский центр «Рыбка Долли»
            </div>
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <button
                onClick={() => document.getElementById("popular-posts-list")?.scrollIntoView({ behavior: "smooth" })}
                className="w-28 h-28 rounded-full flex items-center justify-center transition-all duration-150 hover:-translate-y-2 active:translate-y-1"
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  filter: "drop-shadow(0 8px 0px rgba(168,85,247,0.5)) drop-shadow(0 12px 20px rgba(244,114,182,0.4))",
                }}
              >
                <img
                  src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/541fd8a8-5245-4d70-8595-dad96bdd5912.png"
                  alt="клякса"
                  className="w-full h-full object-contain"
                />
              </button>
              <span className="text-sm font-black text-orange-600 tracking-wide">Статьи в топе</span>
            </div>
          </div>
          <h1 className="font-nunito text-5xl md:text-6xl font-black text-gray-800 leading-tight mb-4">
            Растём вместе
            <span className="block font-caveat text-orange-400 text-5xl mt-1">с радостью!</span>
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Блог для любящих родителей: статьи, советы педагогов, новости центра и запись на занятия онлайн.
          </p>
        </div>

        {/* ВИДЕО */}
        <div className="flex items-center justify-center relative group cursor-pointer max-w-3xl mx-auto w-full" onClick={() => setVideoOpen(true)}>
          <div className="absolute -inset-3 rounded-[2rem] bg-orange-300 opacity-40 blur-2xl" />
          <div className="absolute -inset-1.5 rounded-[1.75rem] bg-gradient-to-br from-orange-300 via-yellow-200 to-rose-300 opacity-60 blur-lg" />
          <video
            src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/779ce9f8-bba6-46ae-b44c-d6d9359a793d.mp4"
            className="relative rounded-3xl shadow-2xl w-full max-h-[500px] object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white/90 rounded-full p-4 shadow-lg">
              <Icon name="Play" size={32} className="text-orange-400 fill-orange-400" />
            </div>
          </div>
        </div>

        {/* КНОПКИ */}
        <div className="text-center max-w-2xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xl mx-auto">
            <BookingDropdown onFormClick={onFormClick} className="flex-1" />
            <ContactDropdown label="Забронировать смену летнего клуба" className="bg-yellow-400 hover:bg-yellow-500 text-white" wrapperClassName="flex-1" />
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            <button
              onClick={() => onScrollTo("articles")}
              className="bg-white hover:bg-orange-50 text-orange-500 font-bold px-8 py-3 rounded-full text-base border-2 border-orange-200 transition-all"
            >
              Читать блог
            </button>
            <a
              href="https://vk.com/app6379730_-179759189#l=6"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-orange-50 text-orange-500 font-bold px-8 py-3 rounded-full text-base border-2 border-orange-200 transition-all"
            >
              Подробнее о садике
            </a>
            <a
              href="https://vk.com/app6379730_-179759189#l=8"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-orange-50 text-orange-500 font-bold px-8 py-3 rounded-full text-base border-2 border-orange-200 transition-all"
            >
              Подробнее о летнем клубе
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {[["✨", "Счастливые дети"], ["🎓", "Квалифицированные педагоги"], ["8 лет", "работаем"]].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="font-caveat text-4xl text-orange-400 leading-tight">{num}</div>
                <div className="font-black text-base text-gray-700 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {videoOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setVideoOpen(false)}>
            <button className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors" onClick={() => setVideoOpen(false)}>
              <Icon name="X" size={32} />
            </button>
            <video
              src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/779ce9f8-bba6-46ae-b44c-d6d9359a793d.mp4"
              className="max-w-full max-h-[90vh] rounded-2xl"
              controls
              autoPlay
              onClick={e => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </section>
  );
}
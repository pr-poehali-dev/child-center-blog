import { useState } from "react";
import Icon from "@/components/ui/icon";
import { MAX_LINK } from "./constants";
import { BookingDropdown } from "./BookingDropdowns";

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
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-start relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-5 py-2 rounded-full mb-6" style={{fontFamily: 'Pacifico, cursive', fontSize: '1.25rem'}}>
            <span>✨</span> Детский центр «Рыбка Долли»
          </div>
          <h1 className="font-nunito text-5xl md:text-6xl font-black text-gray-800 leading-tight mb-4">
            Растём вместе
            <span className="block font-caveat text-orange-400 text-5xl mt-1">с радостью!</span>
          </h1>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            Блог для любящих родителей: статьи, советы педагогов, новости центра и запись на занятия онлайн.
          </p>
          <div className="flex flex-wrap gap-3">
            <BookingDropdown onFormClick={onFormClick} />
            <a
              href={MAX_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-8 py-4 rounded-full text-lg transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Забронировать смену летнего клуба
            </a>
            <button
              onClick={() => onScrollTo("articles")}
              className="bg-white hover:bg-orange-50 text-orange-500 font-bold px-8 py-4 rounded-full text-lg border-2 border-orange-200 transition-all"
            >
              Читать блог
            </button>
            <a
              href="https://vk.com/app6379730_-179759189#l=6"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-orange-50 text-orange-500 font-bold px-8 py-4 rounded-full text-lg border-2 border-orange-200 transition-all"
            >
              Подробнее о садике
            </a>
            <a
              href="https://vk.com/app6379730_-179759189#l=8"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-orange-50 text-orange-500 font-bold px-8 py-4 rounded-full text-lg border-2 border-orange-200 transition-all"
            >
              Подробнее о летнем клубе
            </a>
          </div>
          <div className="flex gap-8 mt-10">
            {[["", "Счастливые дети"], ["", "Квалифицированные педагоги"], ["8 лет", "работаем"]].map(([num, label]) => (
              <div key={label}>
                <div className="font-black text-2xl text-gray-800">{num}</div>
                <div className="text-sm text-gray-400">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center relative group cursor-pointer" onClick={() => setVideoOpen(true)}>
          <video
            src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/64a006b0-d1da-436d-9e51-7a1f0a85ed09.mp4"
            className="rounded-3xl shadow-2xl w-full max-h-[500px] object-cover"
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

        {videoOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setVideoOpen(false)}>
            <button className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors" onClick={() => setVideoOpen(false)}>
              <Icon name="X" size={32} />
            </button>
            <video
              src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/64a006b0-d1da-436d-9e51-7a1f0a85ed09.mp4"
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

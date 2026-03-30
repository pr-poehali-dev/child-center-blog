import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

export default function Contacts() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fffdf8] font-nunito">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors">
            <Icon name="ArrowLeft" size={20} />
            <span className="text-sm font-semibold">На главную</span>
          </button>
          <img
            src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/badbdcbb-25d9-4f41-a4b9-b704f68d9351.png"
            alt="Рыбка Долли"
            className="h-10 w-auto"
          />
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 pt-28 pb-16">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-800 mb-2">Контакты</h1>
          <p className="text-gray-500 text-lg">Детский центр «Рыбка Долли» — Керчь</p>
        </div>

        <div className="grid gap-6">
          {/* Адрес */}
          <div className="bg-white rounded-3xl p-8 border border-orange-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-orange-100 rounded-2xl w-12 h-12 flex items-center justify-center flex-shrink-0">
                <Icon name="MapPin" size={22} className="text-orange-500" />
              </div>
              <div>
                <h2 className="font-black text-gray-800 text-lg mb-1">Адрес</h2>
                <p className="text-gray-600 leading-relaxed">
                  Республика Крым, г. Керчь<br />
                  <span className="text-gray-400 text-sm">Детский развивающий центр «Рыбка Долли»</span>
                </p>
              </div>
            </div>
          </div>

          {/* Телефон */}
          <div className="bg-white rounded-3xl p-8 border border-orange-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-orange-100 rounded-2xl w-12 h-12 flex items-center justify-center flex-shrink-0">
                <Icon name="Phone" size={22} className="text-orange-500" />
              </div>
              <div>
                <h2 className="font-black text-gray-800 text-lg mb-1">Телефон</h2>
                <div className="flex flex-col gap-1">
                  <a href="tel:+79881521698" className="text-orange-500 font-bold text-lg hover:text-orange-600 transition-colors">
                    +7 (988) 152-16-98
                  </a>
                  <a href="tel:+79787120353" className="text-orange-500 font-bold text-lg hover:text-orange-600 transition-colors">
                    +7 (978) 712-03-53
                  </a>
                </div>
                <p className="text-gray-400 text-sm mt-1">Звонки и WhatsApp</p>
              </div>
            </div>
          </div>

          {/* Telegram */}
          <div className="bg-white rounded-3xl p-8 border border-orange-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-sky-100 rounded-2xl w-12 h-12 flex items-center justify-center flex-shrink-0">
                <Icon name="Send" size={22} className="text-sky-500" />
              </div>
              <div>
                <h2 className="font-black text-gray-800 text-lg mb-1">Telegram</h2>
                <a
                  href="https://t.me/irinadolli"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-500 font-bold text-lg hover:text-sky-600 transition-colors"
                >
                  @irinadolli
                </a>
                <p className="text-gray-400 text-sm mt-1">Напишите нам в Telegram</p>
              </div>
            </div>
          </div>

          {/* Режим работы */}
          <div className="bg-white rounded-3xl p-8 border border-orange-100 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="bg-violet-100 rounded-2xl w-12 h-12 flex items-center justify-center flex-shrink-0">
                <Icon name="Clock" size={22} className="text-violet-500" />
              </div>
              <div className="w-full">
                <h2 className="font-black text-gray-800 text-lg mb-3">Режим работы</h2>
                <div className="space-y-2">
                  {[
                    { day: "Понедельник — пятница", time: "8:00 — 20:00" },
                    { day: "Суббота", time: "9:00 — 18:00" },
                    { day: "Воскресенье", time: "Выходной" },
                  ].map((item) => (
                    <div key={item.day} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.day}</span>
                      <span className={`font-bold ${item.time === "Выходной" ? "text-gray-400" : "text-gray-800"}`}>
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Карта */}
          <div className="bg-white rounded-3xl overflow-hidden border border-orange-100 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-rose-100 rounded-2xl w-12 h-12 flex items-center justify-center flex-shrink-0">
                  <Icon name="Map" size={22} className="text-rose-500" />
                </div>
                <div>
                  <h2 className="font-black text-gray-800 text-lg">Мы на карте</h2>
                  <p className="text-gray-400 text-sm">г. Керчь, Республика Крым</p>
                </div>
              </div>
            </div>
            <div className="aspect-[16/9]">
              <iframe
                src="https://yandex.ru/map-widget/v1/?text=Керчь%2C%20Республика%20Крым&z=13&l=map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                title="Карта Керчи"
              />
            </div>
          </div>
        </div>

        {/* Кнопка записи */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate("/")}
            className="bg-orange-400 hover:bg-orange-500 text-white font-black px-10 py-4 rounded-2xl text-lg transition-colors shadow-lg shadow-orange-200"
          >
            Записаться на занятие
          </button>
          <p className="text-gray-400 text-sm mt-3">Пробное занятие — бесплатно</p>
        </div>
      </main>
    </div>
  );
}
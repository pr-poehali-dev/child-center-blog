import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const VISIT_COUNTER_API = "https://functions.poehali.dev/7d977bf0-24cd-492c-aa4e-0c0324d97f97";

function VisitCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const key = 'visit_counted_day';
    const today = new Date().toISOString().slice(0, 10);
    const already = localStorage.getItem(key) === today;

    if (already) {
      fetch(VISIT_COUNTER_API)
        .then(r => r.json())
        .then(d => setCount(d.total))
        .catch(() => {});
    } else {
      fetch(VISIT_COUNTER_API, { method: 'POST' })
        .then(r => r.json())
        .then(d => { setCount(d.total); localStorage.setItem(key, today); })
        .catch(() => {});
    }
  }, []);

  if (count === null) return null;

  return (
    <div className="mt-3 text-xs text-gray-600 opacity-50">
      Нас посетили {count.toLocaleString('ru-RU')} раз
    </div>
  );
}

interface HomeContactsSectionProps {
  onFormClick: () => void;
}

export default function HomeContactsSection({ onFormClick }: HomeContactsSectionProps) {
  return (
    <>
      {/* CONTACTS */}
      <section id="contacts" className="py-24 bg-gradient-to-b from-orange-50 to-amber-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="font-caveat text-orange-400 text-2xl mb-2">Контакты</div>
            <h2 className="font-black text-4xl text-gray-800">Мы всегда на связи</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h3 className="font-black text-xl text-gray-800 mb-6">Как нас найти</h3>
              <div className="space-y-5">
                {[
                  { icon: "Phone", label: "Телефон", value: "+7 (988) 152-16-98" },
                  { icon: "Phone", label: "Телефон", value: "+7 (978) 712-03-53" },
                ].map((c) => (
                  <div key={c.value} className="flex gap-4 items-start">
                    <div className="bg-orange-100 rounded-xl p-2.5 shrink-0">
                      <Icon name={c.icon} size={18} className="text-orange-500" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 font-semibold">{c.label}</div>
                      <a href={`tel:${c.value.replace(/\D/g, '+')}`} className="text-gray-700 font-semibold text-sm hover:text-orange-500 transition-colors">{c.value}</a>
                    </div>
                  </div>
                ))}
                <div className="flex gap-4 items-start">
                  <div className="bg-orange-100 rounded-xl p-2.5 shrink-0">
                    <Icon name="MapPin" size={18} className="text-orange-500" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-semibold">Адрес</div>
                    <a href="https://yandex.ru/maps/?text=г.+Керчь,+ул.+Циолковского,+12" target="_blank" rel="noopener noreferrer" className="text-gray-700 font-semibold text-sm hover:text-orange-500 transition-colors">г. Керчь, ул. Циолковского, 12</a>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-orange-100 rounded-xl p-2.5 shrink-0">
                    <Icon name="Users" size={18} className="text-orange-500" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-semibold">ВКонтакте</div>
                    <a href="https://vk.com/rybka_dolli" target="_blank" rel="noopener noreferrer" className="text-gray-700 font-semibold text-sm hover:text-orange-500 transition-colors">vk.com/rybka_dolli</a>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-orange-100 rounded-xl p-2.5 shrink-0">
                    <Icon name="Clock" size={18} className="text-orange-500" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-semibold">Режим работы</div>
                    <div className="text-gray-700 font-semibold text-sm">Пн — Пт: 8:00 — 18:00</div>
                    <div className="text-gray-400 text-xs">Сб — Вс: выходной</div>
                  </div>
                </div>
                <a
                  href="https://ribkadollli.ru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3 hover:shadow-md transition-all hover:-translate-y-0.5 w-full"
                >
                  <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.332 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" fill="#FFC107"/>
                    <path d="M6.306 14.691l6.571 4.819C14.655 16.108 19.001 13 24 13c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" fill="#FF3D00"/>
                    <path d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.31 0-9.821-3.317-11.558-7.975l-6.522 5.025C9.505 39.556 16.227 44 24 44z" fill="#4CAF50"/>
                    <path d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" fill="#1976D2"/>
                  </svg>
                  <div>
                    <div className="text-xs text-gray-400 font-semibold">Основной сайт</div>
                    <div className="text-gray-700 font-semibold text-sm">ribkadollli.ru</div>
                  </div>
                </a>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-400 to-rose-400 rounded-3xl p-8 text-white flex flex-col justify-center text-center">
              <div className="text-5xl mb-4">🌟</div>
              <h3 className="font-black text-2xl mb-3">Запишитесь сейчас</h3>
              <p className="opacity-90 mb-6 leading-relaxed">Познакомьтесь с педагогом и оцените атмосферу центра.</p>
              <button onClick={onFormClick} className="bg-white text-orange-500 font-black px-8 py-4 rounded-2xl hover:bg-orange-50 transition-colors text-lg shadow-lg">
                Записаться
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SEO TEXT BLOCK */}
      <section className="bg-white py-10 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-lg font-black text-gray-700 mb-4">Детский центр «Рыбка Долли» в Керчи — всё для развития вашего ребёнка</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-gray-500 leading-relaxed">
            <div>
              <h3 className="font-bold text-gray-600 mb-2">Занятия для детей</h3>
              <p>Проводим развивающие занятия для детей от 2 до 10 лет в мини-группах. Занятия для дошкольников 3, 4, 5 и 6 лет с опытными педагогами. Индивидуальный подход к каждому ребёнку, комфортные условия, маленькие группы. Раннее развитие малышей через игру.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-600 mb-2">Логопед и развитие речи</h3>
              <p>Детский логопед — постановка звуков, коррекция речи, запуск речи у малышей. Занятия с логопедом индивидуально и в мини-группах. Логопедические занятия для дошкольников с результатом. Развитие речи дети — наша специализация.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-600 mb-2">Подготовка к школе</h3>
              <p>Курс подготовки к школе для дошкольников в Керчи. Обучение чтению по слогам, письму, счёту. Будущий первоклассник будет готов: развитие внимания, памяти, логики и мышления. Подготовка к школе в мини-группах и индивидуально.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-600 mb-2">Английский язык для детей</h3>
              <p>Английский для детей с 4 лет через игру в Керчи. Курсы английского для дошкольников и школьников в группах и индивидуально. Разговорный английский, обучение с нуля. Английский для малышей — игровой формат занятий.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-600 mb-2">Группа продлённого дня</h3>
              <p>Частная продлёнка в Керчи — присмотр за детьми после школы. Помощь с домашними заданиями, развивающие занятия, питание. Продлёнка полный день и полдня. Безопасные условия, опытные педагоги.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-600 mb-2">Летний клуб и кружки</h3>
              <p>Летний дневной лагерь для детей в Керчи — насыщенная программа, творчество и игры. Кружки для детей, развивашки дошкольникам, детские кружки по интересам. Центр раннего развития — куда отдать ребёнка от 2 до 10 лет.</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-6 text-center">
            Детский центр «Рыбка Долли» — официальный центр развития детей в Керчи. Лицензированные педагоги, проверенная методика, центр с результатом. Первое занятие бесплатно — запишитесь онлайн!
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-300 py-10 text-center">
        <div className="text-2xl mb-2">🌟</div>
        <div className="font-caveat text-orange-300 text-xl font-bold mb-1">Рыбка Долли</div>
        <div className="text-sm opacity-60">© 2026 Детский центр «Рыбка Долли». Все права защищены.</div>
        <VisitCounter />
        <a href="/admin" className="mt-4 inline-block text-xs text-gray-600 hover:text-gray-400 transition-colors">
          Вход для администратора
        </a>
      </footer>
    </>
  );
}
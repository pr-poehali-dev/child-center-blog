import { useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/files/71d16c53-1370-4775-941c-4d3a2598f774.jpg";

const NAV_LINKS = [
  { label: "Главная", id: "home" },
  { label: "О центре", id: "about" },
  { label: "Статьи", id: "articles" },
  { label: "Команда", id: "team" },
  { label: "Отзывы", id: "reviews" },
  { label: "Контакты", id: "contacts" },
];

const ARTICLES = [
  { emoji: "🎨", tag: "Творчество", title: "Как рисование развивает мышление ребёнка", desc: "Узнайте, почему регулярные занятия рисованием — мощный инструмент развития.", date: "18 марта 2026", color: "bg-rose-50" },
  { emoji: "🧩", tag: "Развитие", title: "5 игр для развития логики дошкольников", desc: "Простые и увлекательные игры, которые можно делать дома каждый день.", date: "10 марта 2026", color: "bg-amber-50" },
  { emoji: "🎭", tag: "Мероприятия", title: "Как прошёл наш весенний спектакль", desc: "Дети готовились целый месяц — и вот настал день премьеры. Делимся эмоциями!", date: "5 марта 2026", color: "bg-violet-50" },
  { emoji: "🌱", tag: "Советы", title: "Адаптация в детском саду: советы родителям", desc: "Первые дни в новом коллективе — стресс. Рассказываем, как помочь малышу.", date: "28 февраля 2026", color: "bg-teal-50" },
  { emoji: "🎵", tag: "Музыка", title: "Музыка и эмоциональный интеллект", desc: "Почему дети, занимающиеся музыкой, легче выражают эмоции.", date: "20 февраля 2026", color: "bg-sky-50" },
  { emoji: "🏃", tag: "Здоровье", title: "Движение — жизнь: физическая активность для детей", desc: "Сколько нужно двигаться ребёнку в день? Мнение наших педагогов.", date: "12 февраля 2026", color: "bg-lime-50" },
];

const TEAM = [
  { name: "Анна Смирнова", role: "Директор центра", emoji: "👩‍🏫", desc: "15 лет в детском образовании. Любит йогу и путешествия.", color: "bg-rose-100" },
  { name: "Михаил Петров", role: "Педагог по развитию", emoji: "🧑‍🎨", desc: "Специалист по дошкольной педагогике. Автор 3 методик.", color: "bg-amber-100" },
  { name: "Елена Козлова", role: "Психолог", emoji: "👩‍⚕️", desc: "Помогает детям и родителям найти общий язык.", color: "bg-teal-100" },
  { name: "Дмитрий Волков", role: "Педагог по спорту", emoji: "🧑‍🤸", desc: "Мастер спорта по гимнастике. Весёлые тренировки гарантированы!", color: "bg-sky-100" },
];

const REVIEWS = [
  { name: "Ольга М.", text: "Наш сын ходит уже год — просто расцвёл! Педагоги внимательные, атмосфера тёплая. Рекомендую всем!", stars: 5, child: "Сын, 5 лет", color: "bg-rose-50" },
  { name: "Сергей и Ирина Н.", text: "Дочка каждое утро бежит в центр сама — это лучший показатель. Статьи в блоге очень помогают.", stars: 5, child: "Дочь, 4 года", color: "bg-amber-50" },
  { name: "Татьяна К.", text: "Записались через сайт — очень удобно! Первое занятие пробное и бесплатное. Остались навсегда 😊", stars: 5, child: "Сын, 6 лет", color: "bg-violet-50" },
];

const CLASSES = [
  { name: "Рисование и творчество", age: "3–7 лет", time: "Пн, Ср 10:00", emoji: "🎨" },
  { name: "Логика и математика", age: "5–8 лет", time: "Вт, Чт 11:00", emoji: "🧮" },
  { name: "Музыка и ритм", age: "3–6 лет", time: "Пн, Пт 09:00", emoji: "🎵" },
  { name: "Спорт и движение", age: "4–9 лет", time: "Сб 10:00", emoji: "⚽" },
  { name: "Английский для малышей", age: "5–8 лет", time: "Ср, Пт 15:00", emoji: "🌍" },
  { name: "Театральная студия", age: "6–12 лет", time: "Сб 12:00", emoji: "🎭" },
];

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", child: "", cls: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const openBooking = (cls = "") => {
    setForm((f) => ({ ...f, cls }));
    setBookingOpen(true);
    setSubmitted(false);
    setSendError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSendError("");
    try {
      const res = await fetch("https://functions.poehali.dev/a38028da-1fda-42f8-8c38-6c5bc5522662", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setSendError("Не удалось отправить заявку. Попробуйте ещё раз.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffdf8] font-nunito text-gray-700">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => scrollTo("home")} className="flex items-center gap-2">
            <img src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/badbdcbb-25d9-4f41-a4b9-b704f68d9351.png" alt="Рыбка Долли" className="h-10 w-auto" />
          </button>
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className={`text-sm font-semibold transition-colors hover:text-orange-500 ${activeSection === l.id ? "text-orange-500" : "text-gray-600"}`}
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => openBooking()}
              className="bg-orange-400 hover:bg-orange-500 text-white text-sm font-bold px-5 py-2 rounded-full transition-all hover:shadow-md"
            >
              Записаться
            </button>
          </div>
          <button className="md:hidden text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-orange-100 px-4 py-3 flex flex-col gap-3">
            {NAV_LINKS.map((l) => (
              <button key={l.id} onClick={() => scrollTo(l.id)} className="text-left text-sm font-semibold text-gray-600 hover:text-orange-500 py-1">
                {l.label}
              </button>
            ))}
            <button onClick={() => openBooking()} className="bg-orange-400 text-white text-sm font-bold px-5 py-2 rounded-full w-fit">
              Записаться
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
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
              <button
                onClick={() => openBooking()}
                className="bg-orange-400 hover:bg-orange-500 text-white font-bold px-8 py-4 rounded-full text-lg transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                Записаться на занятие
              </button>
              <button
                onClick={() => scrollTo("articles")}
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

        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="font-caveat text-orange-400 text-2xl mb-2">О нас</div>
            <h2 className="font-black text-4xl text-gray-800">Место, где дети расцветают</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { emoji: "💛", title: "Тёплая атмосфера", desc: "Каждый ребёнок чувствует себя особенным. Наши педагоги создают пространство доверия и радости." },
              { emoji: "🎓", title: "Профессиональный подход", desc: "Программы основаны на современных методиках. Регулярно обновляем материалы и повышаем квалификацию." },
              { emoji: "🌈", title: "Развитие через игру", desc: "Учёба — это весело! Все занятия построены на игровых методах, соответствующих возрасту ребёнка." },
            ].map((item) => (
              <div key={item.title} className="text-center p-8 bg-gradient-to-b from-orange-50 to-white rounded-3xl border border-orange-100">
                <div className="text-5xl mb-4">{item.emoji}</div>
                <h3 className="font-black text-xl text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLASSES */}
      <section className="py-24 bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="font-caveat text-orange-400 text-2xl mb-2">Расписание</div>
            <h2 className="font-black text-4xl text-gray-800">Наши занятия</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CLASSES.map((cls) => (
              <div key={cls.name} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-orange-100">
                <div className="text-3xl mb-3">{cls.emoji}</div>
                <h3 className="font-black text-lg text-gray-800 mb-2">{cls.name}</h3>
                <div className="flex gap-2 mb-4">
                  <span className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full">{cls.age}</span>
                  <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-3 py-1 rounded-full">{cls.time}</span>
                </div>
                <button onClick={() => openBooking(cls.name)} className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-2.5 rounded-2xl transition-colors text-sm">
                  Записаться
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ARTICLES */}
      <section id="articles" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="font-caveat text-orange-400 text-2xl mb-2">Блог</div>
            <h2 className="font-black text-4xl text-gray-800">Полезные статьи</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ARTICLES.map((a) => (
              <article key={a.title} className={`${a.color} rounded-3xl p-6 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer border border-white`}>
                <div className="text-3xl mb-3">{a.emoji}</div>
                <span className="bg-white text-gray-500 text-xs font-bold px-3 py-1 rounded-full">{a.tag}</span>
                <h3 className="font-black text-lg text-gray-800 mt-3 mb-2 leading-snug">{a.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{a.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{a.date}</span>
                  <span className="text-orange-400 font-bold text-sm">Читать →</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" className="py-24 bg-gradient-to-b from-rose-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="font-caveat text-orange-400 text-2xl mb-2">Команда</div>
            <h2 className="font-black text-4xl text-gray-800">Наши педагоги</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-center mb-14">
            <video
              src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/8393d0ab-cc73-4e76-b85c-c3a4cf0b36dc.mp4"
              className="rounded-3xl shadow-2xl w-full object-contain"
              autoPlay
              muted
              loop
              playsInline
            />
            <div>
              <p className="text-gray-600 text-lg leading-relaxed">
                В нашем центре работают люди, любящие детей и своё дело. Они получают только положительные отзывы от родителей и умеют найти подход к любому ребёнку.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mt-4">
                Такое возможно только тогда, когда люди искренне любят свою работу, когда им комфортно на своём рабочем месте, когда это их профессия. Мы гордимся своими кадрами, помогаем им развиваться и легко идти по дороге своей профессии.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((m) => (
              <div key={m.name} className="text-center bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                <div className={`${m.color} w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4`}>{m.emoji}</div>
                <h3 className="font-black text-gray-800 mb-1">{m.name}</h3>
                <div className="text-orange-400 font-semibold text-sm mb-3">{m.role}</div>
                <p className="text-gray-500 text-sm leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="font-caveat text-orange-400 text-2xl mb-2">Отзывы</div>
            <h2 className="font-black text-4xl text-gray-800">Говорят родители</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((r) => (
              <div key={r.name} className={`${r.color} rounded-3xl p-7 border border-white`}>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: r.stars }).map((_, i) => <span key={i} className="text-yellow-400 text-lg">★</span>)}
                </div>
                <p className="text-gray-600 leading-relaxed mb-5 italic">«{r.text}»</p>
                <div className="flex items-center gap-3">
                  <div className="bg-orange-200 rounded-full w-10 h-10 flex items-center justify-center font-black text-orange-600">{r.name[0]}</div>
                  <div>
                    <div className="font-black text-gray-800 text-sm">{r.name}</div>
                    <div className="text-gray-400 text-xs">{r.child}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-400 to-rose-400 rounded-3xl p-8 text-white flex flex-col justify-center text-center">
              <div className="text-5xl mb-4">🌟</div>
              <h3 className="font-black text-2xl mb-3">Запишитесь сейчас</h3>
              <p className="opacity-90 mb-6 leading-relaxed">Первое занятие — бесплатно! Познакомьтесь с педагогом и оцените атмосферу центра.</p>
              <button onClick={() => openBooking()} className="bg-white text-orange-500 font-black px-8 py-4 rounded-2xl hover:bg-orange-50 transition-colors text-lg shadow-lg">
                Записаться бесплатно
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-300 py-10 text-center">
        <div className="text-2xl mb-2">🌟</div>
        <div className="font-caveat text-orange-300 text-xl font-bold mb-1">Рыбка Долли</div>
        <div className="text-sm opacity-60">© 2026 Детский центр «Рыбка Долли». Все права защищены.</div>
        <a
          href="/admin"
          className="mt-4 inline-block text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          Вход для администратора
        </a>
      </footer>

      {/* BOOKING MODAL */}
      {bookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setBookingOpen(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setBookingOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600">
              <Icon name="X" size={22} />
            </button>
            {!submitted ? (
              <>
                <div className="text-3xl mb-2">📋</div>
                <h3 className="font-black text-2xl text-gray-800 mb-1">Запись на занятие</h3>
                <p className="text-gray-400 text-sm mb-6">Первое пробное занятие — бесплатно!</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Ваше имя</label>
                    <input required className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" placeholder="Мама / папа" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Телефон</label>
                    <input required className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" placeholder="+7 (___) ___-__-__" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Имя и возраст ребёнка</label>
                    <input required className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" placeholder="Маша, 5 лет" value={form.child} onChange={(e) => setForm({ ...form, child: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">Занятие</label>
                    <select className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-white" value={form.cls} onChange={(e) => setForm({ ...form, cls: e.target.value })}>
                      <option value="">Выберите занятие</option>
                      {CLASSES.map((c) => <option key={c.name} value={c.name}>{c.emoji} {c.name}</option>)}
                    </select>
                  </div>
                  {sendError && (
                    <p className="text-red-500 text-sm text-center">{sendError}</p>
                  )}
                  <button type="submit" disabled={sending} className="w-full bg-orange-400 hover:bg-orange-500 disabled:opacity-60 text-white font-black py-4 rounded-2xl transition-colors text-base mt-2">
                    {sending ? "Отправляем..." : "Отправить заявку"}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="font-black text-2xl text-gray-800 mb-3">Заявка принята!</h3>
                <p className="text-gray-500 leading-relaxed mb-6">Мы свяжемся с вами в ближайшее время. Первое занятие — бесплатно!</p>
                <button onClick={() => setBookingOpen(false)} className="bg-orange-400 hover:bg-orange-500 text-white font-bold px-8 py-3 rounded-2xl transition-colors">
                  Отлично, спасибо!
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
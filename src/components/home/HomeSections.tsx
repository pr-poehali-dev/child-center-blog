import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { TEAM, REVIEWS } from "./constants";

const REVIEWS_API = "https://functions.poehali.dev/1c662b6b-5f56-4e25-b517-f6fdfc24912b";

const BG_COLORS = ["bg-rose-50", "bg-amber-50", "bg-violet-50", "bg-teal-50", "bg-sky-50", "bg-orange-50"];

function LiveReviews() {
  const [reviews, setReviews] = useState<{id: number; name: string; child: string | null; text: string; stars: number}[]>([]);

  useEffect(() => {
    fetch(REVIEWS_API)
      .then(r => r.json())
      .then(d => setReviews(d.reviews || []));
  }, []);

  if (reviews.length === 0) return null;

  return (
    <>
      {reviews.map((r, i) => (
        <div key={r.id} className={`${BG_COLORS[i % BG_COLORS.length]} rounded-3xl p-7 border border-white`}>
          <div className="flex gap-1 mb-4">
            {Array.from({ length: r.stars }).map((_, j) => <span key={j} className="text-yellow-400 text-lg">★</span>)}
          </div>
          <p className="text-gray-600 leading-relaxed mb-5 italic">«{r.text}»</p>
          <div className="flex items-center gap-3">
            <div className="bg-orange-200 rounded-full w-10 h-10 flex items-center justify-center font-black text-orange-600">{r.name[0]}</div>
            <div>
              <div className="font-black text-gray-800 text-sm">{r.name}</div>
              {r.child && <div className="text-gray-400 text-xs">{r.child}</div>}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

function ReviewForm() {
  const [form, setForm] = useState({ name: "", child: "", text: "", stars: 5 });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await fetch(REVIEWS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSent(true);
    setSending(false);
  };

  if (sent) return (
    <div className="bg-orange-50 rounded-3xl p-8 text-center border border-orange-100">
      <div className="text-4xl mb-3">🙏</div>
      <div className="font-black text-gray-800 text-lg mb-1">Спасибо за отзыв!</div>
      <div className="text-gray-500 text-sm">После проверки он появится на сайте.</div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="bg-orange-50 rounded-3xl p-8 border border-orange-100">
      <h3 className="font-black text-xl text-gray-800 mb-5">Оставить отзыв</h3>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1 block">Ваше имя</label>
          <input required className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-white" placeholder="Мама / папа" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1 block">Ребёнок (необязательно)</label>
          <input className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-white" placeholder="Маша, 5 лет" value={form.child} onChange={e => setForm({...form, child: e.target.value})} />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1 block">Оценка</label>
          <div className="flex gap-1">
            {[1,2,3,4,5].map(s => (
              <button key={s} type="button" onClick={() => setForm({...form, stars: s})}
                className={`text-2xl transition-transform hover:scale-110 ${s <= form.stars ? "text-yellow-400" : "text-gray-300"}`}>★</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1 block">Ваш отзыв</label>
          <textarea required rows={4} className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-white resize-none" placeholder="Расскажите о вашем опыте..." value={form.text} onChange={e => setForm({...form, text: e.target.value})} />
        </div>
        <button type="submit" disabled={sending} className="w-full bg-orange-400 hover:bg-orange-500 disabled:opacity-60 text-white font-black py-3.5 rounded-2xl transition-colors">
          {sending ? "Отправляем..." : "Отправить отзыв"}
        </button>
      </div>
    </form>
  );
}

interface HomeSectionsProps {
  onFormClick: () => void;
}

export default function HomeSections({ onFormClick }: HomeSectionsProps) {
  const navigate = useNavigate();

  return (
    <>
      {/* BLOG PROMO */}
      <section id="blog-promo" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="font-caveat text-orange-400 text-2xl mb-2">Блог</div>
            <h2 className="font-black text-4xl text-gray-800">Наш блог</h2>
            <p className="text-gray-500 mt-3 text-lg">Живые истории, советы и важные мысли от педагогов центра</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-amber-50 border border-amber-100 rounded-3xl p-8 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer" onClick={() => navigate("/blog")}>
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-amber-200 shadow">
                <img src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/0197539d-8a43-48cb-984f-105c0ea5576e.png" alt="Советы от педагога" className="w-full h-full object-cover object-center" />
              </div>
              <h3 className="font-black text-lg text-gray-800 mb-3">Советы от педагога</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Практические советы и наблюдения от наших специалистов — для родителей и детей.</p>
            </div>
            <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer" onClick={() => navigate("/blog")}>
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-rose-200 shadow">
                <img src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/22e93845-4c2c-4628-880d-afcfec7e8786.png" alt="Наша жизнь на ладони" className="w-full h-full object-cover object-center" />
              </div>
              <h3 className="font-black text-lg text-gray-800 mb-3">Наша жизнь на ладони</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Фото и видео из жизни центра: занятия, праздники, улыбки и добрые моменты.</p>
            </div>
            <div className="bg-teal-50 border border-teal-100 rounded-3xl p-8 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer" onClick={() => navigate("/blog")}>
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-teal-200 shadow">
                <img src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/a71a6275-d7f8-42f8-aa42-3c09f3686564.png" alt="Подробно о важном" className="w-full h-full object-cover object-center" />
              </div>
              <h3 className="font-black text-lg text-gray-800 mb-3">Подробно о важном</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Развёрнутые материалы о воспитании, развитии и важных темах для семьи.</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-100 rounded-3xl p-8 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer" onClick={() => navigate("/blog")}>
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-yellow-200 shadow">
                <img src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/2616ec37-92bb-4d46-8895-ba8e9193a111.png" alt="Лето с нами" className="w-full h-full object-cover object-center" />
              </div>
              <h3 className="font-black text-lg text-gray-800 mb-3">Лето с нами. Новости летнего клуба</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Всё о летнем клубе: программа, новости, яркие моменты и анонсы.</p>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-8 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer" onClick={() => navigate("/blog")}>
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-indigo-200 shadow">
                <img src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/6e1b8fbb-a82f-46f2-bf6e-293d270f8290.png" alt="Группа продлённого дня" className="w-full h-full object-cover object-center" />
              </div>
              <h3 className="font-black text-lg text-gray-800 mb-3">Группа продлённого дня</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Всё о группе продлённого дня: расписание, новости и полезная информация.</p>
            </div>
            <div className="bg-sky-50 border border-sky-100 rounded-3xl p-8 text-center hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer" onClick={() => navigate("/blog")}>
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-4 border-sky-200 shadow">
                <img src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/cfee62df-ab60-46fb-98c2-d612abb288c8.png" alt="Группа английского языка" className="w-full h-full object-cover object-center" />
              </div>
              <h3 className="font-black text-lg text-gray-800 mb-3">Группа английского языка</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Новости, материалы и анонсы группы английского языка.</p>
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={() => navigate("/blog")}
              className="bg-orange-400 hover:bg-orange-500 text-white font-black px-10 py-4 rounded-full text-lg transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Перейти в блог →
            </button>
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
          <div className="grid md:grid-cols-2 gap-10 items-center">
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
              <div className="mt-6">
                <Icon name="Heart" size={36} className="text-red-400" strokeWidth={1.5} />
              </div>
            </div>
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
          <div className="grid md:grid-cols-3 gap-6 mb-10">
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
            <LiveReviews />
          </div>
          <div className="max-w-lg mx-auto">
            <ReviewForm />
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
              <p className="opacity-90 mb-6 leading-relaxed">Познакомьтесь с педагогом и оцените атмосферу центра.</p>
              <button onClick={onFormClick} className="bg-white text-orange-500 font-black px-8 py-4 rounded-2xl hover:bg-orange-50 transition-colors text-lg shadow-lg">
                Записаться
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
        <a href="/admin" className="mt-4 inline-block text-xs text-gray-600 hover:text-gray-400 transition-colors">
          Вход для администратора
        </a>
      </footer>
    </>
  );
}
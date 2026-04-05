import { useState, useEffect } from "react";
import { REVIEWS } from "./constants";

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
      <h3 className="font-black text-xl text-gray-800 mb-1">Оставить отзыв в блоге</h3>
      <p className="text-gray-400 text-sm mb-5">Отзыв появится на этом сайте после проверки</p>
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

export default function HomeReviewsSection() {
  return (
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
        <div className="max-w-lg mx-auto space-y-4">
          <a
            href="https://yandex.ru/maps/org/rybka_dolli/1719871147/reviews/?add-review=true"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full bg-[#FC3F1D] hover:bg-[#e5361a] text-white font-black py-4 rounded-2xl transition-colors text-base shadow-md"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 2C7.25 2 3 6.25 3 11.5C3 16.75 7.25 21 12.5 21C17.75 21 22 16.75 22 11.5C22 6.25 17.75 2 12.5 2ZM14 16H11V13H8L12.5 8L17 13H14V16Z" fill="white"/>
            </svg>
            Оставить отзыв на Яндексе
          </a>
          <ReviewForm />
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { REVIEWS } from "./constants";
import SectionTitle from "./SectionTitle";
import honeyStar from "@/assets/honey-star.png";
import Honeypot from "@/components/ui/Honeypot";
import { useAntiSpam } from "@/lib/antispam";

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
            {Array.from({ length: r.stars }).map((_, j) => <img key={j} src={honeyStar} alt="★" className="w-4 h-4" />)}
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
  const [agreed, setAgreed] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const { honeypot, setHoneypot, isSpam, formLoadedAt } = useAntiSpam();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSpam()) return;
    setSending(true);
    await fetch(REVIEWS_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, company: honeypot, form_loaded_at: formLoadedAt }),
    });
    setSent(true);
    setSending(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof (window as any).ym === "function") (window as any).ym(108285412, "reachGoal", "review_submit");
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
        <Honeypot value={honeypot} onChange={setHoneypot} />
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
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
            required
            className="mt-0.5 accent-orange-400 w-4 h-4 shrink-0"
          />
          <span className="text-xs text-gray-500 leading-relaxed">
            Согласен(а) с{" "}
            <Link to="/privacy" target="_blank" className="text-orange-500 underline hover:text-orange-600">
              обработкой персональных данных
            </Link>
          </span>
        </label>
        <button type="submit" disabled={sending || !agreed} className="w-full bg-orange-400 hover:bg-orange-500 disabled:opacity-60 text-white font-black py-3.5 rounded-2xl transition-colors">
          {sending ? "Отправляем..." : "Отправить отзыв"}
        </button>
      </div>
    </form>
  );
}

export default function HomeReviewsSection() {
  return (
    <section id="reviews" className="py-14 bg-[#FFF9F3]">
      <div className="max-w-6xl mx-auto px-4">
        <SectionTitle overline="отзывы" title="Говорят родители" />
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {REVIEWS.map((r) => (
            <div key={r.name} className={`${r.color} rounded-3xl p-7 border border-white`}>
              <div className="flex gap-1 mb-4">
                {Array.from({ length: r.stars }).map((_, i) => <img key={i} src={honeyStar} alt="★" className="w-4 h-4" />)}
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
            className="flex items-center justify-center gap-3 w-full bg-[#17364A] hover:bg-[#0f2734] text-white font-black py-4 rounded-2xl transition-colors text-base shadow-md"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="12" fill="#FC3F1D"/>
              <path d="M13.6 6H11.7C9.6 6 8.4 7.1 8.4 8.7C8.4 10.1 9.1 10.8 10.3 11.6L8.1 15H9.9L12 11.8H12.9V15H14.3V6H13.6ZM12.9 10.5H12C10.9 10.5 10.1 9.9 10.1 8.7C10.1 7.5 10.9 6.9 12 6.9H12.9V10.5Z" fill="white"/>
            </svg>
            Оставить отзыв на Яндексе
          </a>
          <ReviewForm />
        </div>
      </div>
    </section>
  );
}
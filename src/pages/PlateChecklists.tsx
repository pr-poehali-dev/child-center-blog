import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const PLATE_API = "https://functions.poehali.dev/654937a6-cde9-49df-ba82-e36b291807c7";
const SUBSCRIBERS_API = "https://functions.poehali.dev/ad0992ef-212b-47b2-9265-aedfd9a33c3f";
const STORAGE_KEY = "plate_subscriber_email";

interface Checklist {
  id: number;
  title: string;
  description: string;
  pdf_url: string;
  cover_emoji: string;
}

export default function PlateChecklists() {
  const [email, setEmail] = useState(() => localStorage.getItem(STORAGE_KEY) || "");
  const [name, setName] = useState("");
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadChecklists = async (emailVal: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${PLATE_API}?email=${encodeURIComponent(emailVal)}`);
      const data = await res.json();
      if (res.ok) {
        setChecklists(data.checklists || []);
        setIsSubscribed(true);
        localStorage.setItem(STORAGE_KEY, emailVal);
      } else if (data.error === "not_subscribed") {
        setIsSubscribed(false);
        setChecklists([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      loadChecklists(saved);
    }
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubscribing(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(SUBSCRIBERS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Готово! Добро пожаловать в «Тарелку для всех» 🥗");
        await loadChecklists(email.trim().toLowerCase());
      } else if (data.error === "Этот email уже подписан") {
        await loadChecklists(email.trim().toLowerCase());
      } else {
        setError(data.error || "Что-то пошло не так, попробуйте ещё раз");
      }
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-300">
        <Icon name="Loader2" size={36} className="animate-spin" />
      </div>
    );
  }

  if (isSubscribed) {
    return (
      <div className="mb-8">
        {success && (
          <div className="mb-5 bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <p className="text-green-800 font-semibold text-sm">{success}</p>
          </div>
        )}
        <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl px-5 py-4 flex items-center gap-3">
          <Icon name="CheckCircle" size={20} className="text-green-500 shrink-0" />
          <p className="text-green-800 font-semibold text-sm">Вы подписаны — все рецепты открыты для вас!</p>
        </div>

        {checklists.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🥗</div>
            <div className="font-black text-xl text-gray-400 mb-2">Рецепты скоро появятся</div>
            <div className="text-gray-400 text-sm">Подписка активна — как только выйдет первый рецепт, он сразу будет здесь</div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {checklists.map(item => (
              <a
                key={item.id}
                href={item.pdf_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-4 bg-white border border-green-100 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div className="text-4xl shrink-0">{item.cover_emoji}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-gray-800 text-base leading-snug mb-1 group-hover:text-green-600 transition-colors">{item.title}</h3>
                  {item.description && (
                    <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                  )}
                  <div className="mt-2 flex items-center gap-1 text-green-600 text-sm font-bold">
                    <Icon name="FileDown" size={14} />
                    Скачать PDF
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="bg-white border border-green-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-green-400 to-teal-500 px-8 py-8 text-center">
          <div className="text-5xl mb-3">🥗</div>
          <h2 className="font-black text-white text-2xl leading-tight mb-2">Рецепты-чеклисты<br/>бесплатно!</h2>
          <p className="text-white/85 text-sm leading-relaxed max-w-sm mx-auto">
            Подпишитесь на блог и получите доступ ко всем рецептам безглютенового, безказеинового и безлактозного питания
          </p>
        </div>
        <div className="px-8 py-7">
          <form onSubmit={handleSubscribe} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Ваше имя</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Мария"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="maria@email.com"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm font-medium">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={subscribing}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:opacity-60 text-white font-black py-3.5 rounded-xl text-base transition-all flex items-center justify-center gap-2"
            >
              {subscribing ? (
                <><Icon name="Loader2" size={18} className="animate-spin" /> Подписываю...</>
              ) : (
                <><Icon name="Gift" size={18} /> Получить рецепты</>
              )}
            </button>
            <p className="text-center text-xs text-gray-400">
              Подписка на блог «Рыбка Долли» — только полезное, никакого спама
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

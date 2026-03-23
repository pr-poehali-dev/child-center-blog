import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";

const API_URL = "https://functions.poehali.dev/1a73d1e8-5437-405c-895e-6835413def1c";
const AUTH_URL = "https://functions.poehali.dev/a8c159bd-d63c-431b-a970-462abd7cd949";
const TOKEN_KEY = "admin_token";

const STATUS_CONFIG: Record<string, { label: string; color: string; next: string; nextLabel: string }> = {
  new:       { label: "Новая",        color: "bg-orange-100 text-orange-700", next: "confirmed", nextLabel: "Подтвердить" },
  confirmed: { label: "Подтверждена", color: "bg-green-100 text-green-700",   next: "done",      nextLabel: "Завершить"   },
  done:      { label: "Завершена",    color: "bg-gray-100 text-gray-500",      next: "new",       nextLabel: "Обновить"    },
};

interface Booking {
  id: number;
  name: string;
  phone: string;
  child: string;
  cls: string;
  status: string;
  created_at: string;
}

function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError("Неверный пароль. Попробуйте ещё раз.");
      } else {
        localStorage.setItem(TOKEN_KEY, data.token);
        onLogin(data.token);
      }
    } catch {
      setError("Ошибка соединения. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffdf8] font-nunito flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌟</div>
          <h1 className="font-black text-2xl text-gray-800">Панель администратора</h1>
          <p className="text-gray-400 text-sm mt-1">Детский центр «Солнышко»</p>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-orange-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1.5 block">Пароль</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  required
                  autoFocus
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 pr-11 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Icon name={show ? "EyeOff" : "Eye"} size={17} />
                </button>
              </div>
            </div>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-2xl font-semibold">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-400 hover:bg-orange-500 disabled:opacity-60 text-white font-black py-3.5 rounded-2xl transition-colors"
            >
              {loading ? "Проверяем..." : "Войти"}
            </button>
          </form>
        </div>
        <div className="text-center mt-6">
          <a href="/" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">← Вернуться на сайт</a>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setBookings(data.bookings || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (token) load(); }, [token]);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  const updateStatus = async (id: number, status: string) => {
    setUpdating(id);
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    await load();
    setUpdating(null);
  };

  if (!token) return <LoginScreen onLogin={setToken} />;

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);
  const counts = {
    all: bookings.length,
    new: bookings.filter(b => b.status === "new").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    done: bookings.filter(b => b.status === "done").length,
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-[#fffdf8] font-nunito">
      {/* Header */}
      <div className="bg-white border-b border-orange-100 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌟</span>
            <div>
              <div className="font-black text-gray-800 text-lg leading-tight">Панель администратора</div>
              <div className="text-xs text-gray-400">Детский центр «Солнышко»</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={load} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 transition-colors">
              <Icon name="RefreshCw" size={15} />
              <span className="hidden md:inline">Обновить</span>
            </button>
            <a href="/" className="flex items-center gap-1.5 text-sm bg-orange-100 text-orange-600 font-bold px-4 py-2 rounded-full hover:bg-orange-200 transition-colors">
              <Icon name="ArrowLeft" size={15} />
              <span className="hidden md:inline">На сайт</span>
            </a>
            <button onClick={logout} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-400 transition-colors">
              <Icon name="LogOut" size={15} />
              <span className="hidden md:inline">Выйти</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { key: "all",       label: "Всего",        emoji: "📋", bg: "bg-white" },
            { key: "new",       label: "Новых",        emoji: "🆕", bg: "bg-orange-50" },
            { key: "confirmed", label: "Подтверждено", emoji: "✅", bg: "bg-green-50" },
            { key: "done",      label: "Завершено",    emoji: "🏁", bg: "bg-gray-50" },
          ].map(s => (
            <button
              key={s.key}
              onClick={() => setFilter(s.key)}
              className={`${s.bg} ${filter === s.key ? "ring-2 ring-orange-400" : ""} rounded-2xl p-4 text-left border border-orange-100 hover:shadow-sm transition-all`}
            >
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className="font-black text-2xl text-gray-800">{counts[s.key as keyof typeof counts]}</div>
              <div className="text-xs text-gray-400 font-semibold">{s.label}</div>
            </button>
          ))}
        </div>

        {/* Bookings */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-4xl mb-3 animate-spin inline-block">⏳</div>
            <div>Загружаем заявки...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-orange-100">
            <div className="text-5xl mb-4">📭</div>
            <div className="font-black text-gray-700 text-xl mb-2">Заявок пока нет</div>
            <div className="text-gray-400 text-sm">Они появятся здесь, как только родители начнут записываться</div>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(b => {
              const cfg = STATUS_CONFIG[b.status] || STATUS_CONFIG.new;
              return (
                <div key={b.id} className="bg-white rounded-2xl border border-orange-100 p-5 hover:shadow-sm transition-all">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <div className="text-xs text-gray-400 font-semibold mb-0.5">Родитель</div>
                        <div className="font-black text-gray-800 text-sm">{b.name}</div>
                        <div className="text-orange-500 text-sm font-semibold">{b.phone}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-semibold mb-0.5">Ребёнок</div>
                        <div className="font-bold text-gray-700 text-sm">{b.child}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-semibold mb-0.5">Занятие</div>
                        <div className="font-bold text-gray-700 text-sm">{b.cls || "—"}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-semibold mb-0.5">Дата</div>
                        <div className="text-gray-500 text-sm">{formatDate(b.created_at)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`${cfg.color} text-xs font-bold px-3 py-1.5 rounded-full`}>{cfg.label}</span>
                      <button
                        onClick={() => updateStatus(b.id, cfg.next)}
                        disabled={updating === b.id}
                        className="bg-orange-400 hover:bg-orange-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
                      >
                        {updating === b.id ? "..." : cfg.nextLabel}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

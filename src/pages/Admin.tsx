import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { API_URL, TOKEN_KEY, Booking } from "@/components/admin/constants";
import LoginScreen from "@/components/admin/LoginScreen";
import BlogManager from "@/components/admin/BlogManager";
import BookingsManager from "@/components/admin/BookingsManager";

export default function Admin() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState<number | null>(null);
  const [tab, setTab] = useState<"bookings" | "blog">("bookings");

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

  return (
    <div className="min-h-screen bg-[#fffdf8] font-nunito">
      {/* Header */}
      <div className="bg-white border-b border-orange-100 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌟</span>
            <div>
              <div className="font-black text-gray-800 text-lg leading-tight">Панель администратора</div>
              <div className="text-xs text-gray-400">Детский центр «Рыбка Долли»</div>
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

      {/* TABS */}
      <div className="bg-white border-b border-orange-100">
        <div className="max-w-5xl mx-auto px-4 flex gap-1 pt-2">
          {[
            { key: "bookings", label: "Заявки", emoji: "📋" },
            { key: "blog",     label: "Блог",   emoji: "✍️" },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as "bookings" | "blog")}
              className={`flex items-center gap-1.5 px-5 py-3 text-sm font-bold border-b-2 transition-colors ${
                tab === t.key
                  ? "border-orange-400 text-orange-500"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {tab === "bookings" ? (
          <BookingsManager
            bookings={bookings}
            loading={loading}
            filter={filter}
            updating={updating}
            onFilterChange={setFilter}
            onRefresh={load}
            onUpdateStatus={updateStatus}
          />
        ) : (
          <BlogManager />
        )}
      </div>
    </div>
  );
}

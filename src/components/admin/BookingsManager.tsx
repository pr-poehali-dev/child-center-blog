import Icon from "@/components/ui/icon";
import { API_URL, STATUS_CONFIG, Booking } from "./constants";

interface Props {
  bookings: Booking[];
  loading: boolean;
  filter: string;
  updating: number | null;
  onFilterChange: (f: string) => void;
  onRefresh: () => void;
  onUpdateStatus: (id: number, status: string) => void;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
};

export default function BookingsManager({ bookings, loading, filter, updating, onFilterChange, onUpdateStatus }: Props) {
  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);
  const counts = {
    all: bookings.length,
    new: bookings.filter(b => b.status === "new").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    done: bookings.filter(b => b.status === "done").length,
  };

  return (
    <>
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
            onClick={() => onFilterChange(s.key)}
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
                      onClick={() => onUpdateStatus(b.id, cfg.next)}
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
    </>
  );
}

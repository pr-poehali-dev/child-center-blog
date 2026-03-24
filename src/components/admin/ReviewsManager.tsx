import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { TOKEN_KEY } from "./constants";

const REVIEWS_API = "https://functions.poehali.dev/1c662b6b-5f56-4e25-b517-f6fdfc24912b";

interface Review {
  id: number;
  name: string;
  child: string | null;
  text: string;
  stars: number;
  approved: boolean;
  created_at: string;
}

export default function ReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    const token = localStorage.getItem(TOKEN_KEY) || "";
    const res = await fetch(REVIEWS_API, { headers: { Authorization: token } });
    const data = await res.json();
    setReviews(data.reviews || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const act = async (id: number, action: "approve" | "reject") => {
    setActing(id);
    const token = localStorage.getItem(TOKEN_KEY) || "";
    await fetch(REVIEWS_API, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({ id, action }),
    });
    await load();
    setActing(null);
  };

  const pending = reviews.filter(r => !r.approved);
  const approved = reviews.filter(r => r.approved);

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  const ReviewCard = ({ r }: { r: Review }) => (
    <div className={`rounded-2xl border p-5 ${r.approved ? "bg-green-50 border-green-100" : "bg-orange-50 border-orange-100"}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <div className="flex gap-0.5 mb-1">
            {Array.from({ length: r.stars }).map((_, i) => <span key={i} className="text-yellow-400">★</span>)}
          </div>
          <div className="font-black text-gray-800 text-sm">{r.name}{r.child && <span className="font-normal text-gray-400 ml-1">• {r.child}</span>}</div>
          <div className="text-xs text-gray-400 mt-0.5">{formatDate(r.created_at)}</div>
        </div>
        <div className="flex gap-2 shrink-0">
          {!r.approved && (
            <button
              onClick={() => act(r.id, "approve")}
              disabled={acting === r.id}
              className="flex items-center gap-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
            >
              <Icon name="Check" size={13} /> Одобрить
            </button>
          )}
          <button
            onClick={() => act(r.id, "reject")}
            disabled={acting === r.id}
            className="flex items-center gap-1 bg-red-100 hover:bg-red-200 disabled:opacity-50 text-red-600 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
          >
            <Icon name="Trash2" size={13} /> Удалить
          </button>
        </div>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed mt-2">«{r.text}»</p>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-black text-xl text-gray-800">Отзывы</h2>
        <button onClick={load} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 transition-colors">
          <Icon name="RefreshCw" size={15} />
          Обновить
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-gray-300"><Icon name="Loader2" size={32} className="animate-spin" /></div>
      ) : (
        <>
          {pending.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-orange-100 text-orange-600 text-xs font-black px-3 py-1 rounded-full">{pending.length} на проверке</div>
              </div>
              <div className="flex flex-col gap-3">
                {pending.map(r => <ReviewCard key={r.id} r={r} />)}
              </div>
            </div>
          )}

          {approved.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-green-100 text-green-700 text-xs font-black px-3 py-1 rounded-full">{approved.length} опубликовано</div>
              </div>
              <div className="flex flex-col gap-3">
                {approved.map(r => <ReviewCard key={r.id} r={r} />)}
              </div>
            </div>
          )}

          {reviews.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <div className="text-4xl mb-3">⭐</div>
              <div className="font-black text-lg">Отзывов пока нет</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

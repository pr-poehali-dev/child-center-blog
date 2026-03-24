import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const BLOG_API = "https://functions.poehali.dev/d84b54ca-2906-4a84-be8b-264f6d13e325";

const CATEGORIES = [
  { id: "tips", label: "Советы от педагога", emoji: "🎓", color: "bg-amber-50", border: "border-amber-200", tag: "bg-amber-100 text-amber-700" },
  { id: "life", label: "Наша жизнь на ладони", emoji: "🌈", color: "bg-rose-50", border: "border-rose-200", tag: "bg-rose-100 text-rose-700" },
  { id: "detail", label: "Подробно о важном", emoji: "📖", color: "bg-teal-50", border: "border-teal-200", tag: "bg-teal-100 text-teal-700" },
  { id: "summer", label: "Лето с нами. Новости летнего клуба", emoji: "☀️", color: "bg-yellow-50", border: "border-yellow-200", tag: "bg-yellow-100 text-yellow-700" },
];

interface MediaItem {
  type: "image" | "video";
  url: string;
}

interface Post {
  id: number;
  category: string;
  title: string;
  content: string;
  media: MediaItem[];
  created_at: string;
}

function MediaGallery({ media }: { media: MediaItem[] }) {
  const [active, setActive] = useState<MediaItem | null>(null);
  if (!media || media.length === 0) return null;
  return (
    <>
      <div className={`grid gap-2 mt-4 ${media.length === 1 ? "grid-cols-1" : media.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
        {media.map((m, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity aspect-square bg-gray-100"
            onClick={() => setActive(m)}
          >
            {m.type === "video" ? (
              <video src={m.url} className="w-full h-full object-cover" muted playsInline />
            ) : (
              <img src={m.url} alt="" className="w-full h-full object-cover" />
            )}
          </div>
        ))}
      </div>
      {active && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setActive(null)}>
          <button className="absolute top-4 right-4 text-white" onClick={() => setActive(null)}>
            <Icon name="X" size={28} />
          </button>
          {active.type === "video" ? (
            <video src={active.url} className="max-w-full max-h-[90vh] rounded-2xl" controls autoPlay onClick={e => e.stopPropagation()} />
          ) : (
            <img src={active.url} alt="" className="max-w-full max-h-[90vh] rounded-2xl object-contain" onClick={e => e.stopPropagation()} />
          )}
        </div>
      )}
    </>
  );
}

function PostCard({ post }: { post: Post }) {
  const cat = CATEGORIES.find(c => c.id === post.category);
  const [expanded, setExpanded] = useState(false);
  const isLong = post.content.length > 300;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <article className={`${cat?.color || "bg-white"} rounded-3xl p-6 border ${cat?.border || "border-gray-100"} shadow-sm`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${cat?.tag || "bg-gray-100 text-gray-500"}`}>
          {cat?.emoji} {cat?.label}
        </span>
        <span className="text-xs text-gray-400 shrink-0">{formatDate(post.created_at)}</span>
      </div>
      <h3 className="font-black text-lg text-gray-800 mb-3 leading-snug">{post.title}</h3>
      {post.content && (
        <div className="text-gray-600 text-sm leading-relaxed">
          <p className={!expanded && isLong ? "line-clamp-4" : ""}>
            {post.content}
          </p>
          {isLong && (
            <button className="text-orange-500 font-semibold text-sm mt-1 hover:underline" onClick={() => setExpanded(!expanded)}>
              {expanded ? "Свернуть" : "Читать полностью"}
            </button>
          )}
        </div>
      )}
      <MediaGallery media={post.media} />
    </article>
  );
}

export default function Blog() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("tips");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async (cat: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${BLOG_API}?category=${cat}`);
      const data = await res.json();
      setPosts(data.posts || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts(activeTab);
  }, [activeTab]);

  const activeCat = CATEGORIES.find(c => c.id === activeTab)!;

  return (
    <div className="min-h-screen bg-[#fffdf8] font-nunito text-gray-700">
      {/* HEADER */}
      <div className="bg-white border-b border-orange-100 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors font-semibold">
            <Icon name="ArrowLeft" size={20} />
            <span className="hidden sm:inline">На главную</span>
          </button>
          <div className="flex-1 text-center">
            <div className="font-black text-gray-800 text-lg leading-tight">Блог центра</div>
            <div className="font-caveat text-orange-400 text-sm">Рыбка Долли</div>
          </div>
          <div className="w-16" />
        </div>

        {/* TABS */}
        <div className="max-w-3xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === cat.id
                  ? "bg-orange-400 text-white shadow-sm"
                  : "bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-500"
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-300">
            <Icon name="Loader2" size={36} className="animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">{activeCat.emoji}</div>
            <div className="font-black text-xl text-gray-400 mb-2">Пока пусто</div>
            <div className="text-gray-400 text-sm">Скоро здесь появятся записи в разделе «{activeCat.label}»</div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
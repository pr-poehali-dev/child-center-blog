import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Icon from "@/components/ui/icon";

function usePageMeta(title: string, description: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = title;
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", name); document.head.appendChild(el); }
      el.content = content;
    };
    const setOg = (prop: string, content: string) => {
      let el = document.querySelector(`meta[property="${prop}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute("property", prop); document.head.appendChild(el); }
      el.content = content;
    };
    setMeta("description", description);
    setOg("og:title", title);
    setOg("og:description", description);
    setOg("og:type", "website");
    return () => { document.title = prev; };
  }, [title, description]);
}

const SEO_BY_CATEGORY: Record<string, { title: string; description: string }> = {
  tips: {
    title: "Советы педагогов | Блог детского центра «Рыбка Долли» Керчь",
    description: "Советы опытных педагогов детского центра «Рыбка Долли»: воспитание, адаптация, развитие ребёнка. Читайте бесплатно на сайте.",
  },
  life: {
    title: "Наша жизнь | Блог детского центра «Рыбка Долли» Керчь",
    description: "Новости и живые истории из жизни детского центра «Рыбка Долли» в Керчи. Праздники, занятия, эмоции.",
  },
  detail: {
    title: "Подробно о важном | Блог детского центра «Рыбка Долли» Керчь",
    description: "Подробные статьи о здоровье, психологии и развитии детей от педагогов центра «Рыбка Долли» в Керчи.",
  },
  summer: {
    title: "Летний клуб | Детский центр «Рыбка Долли» Керчь",
    description: "Летний клуб для детей в Керчи — «Рыбка Долли». Новости смен, расписание, запись онлайн.",
  },
  afterschool: {
    title: "Группа продлённого дня | Детский центр «Рыбка Долли» Керчь",
    description: "Группа продлённого дня для детей в Керчи. Безопасно, интересно, с заботой — детский центр «Рыбка Долли».",
  },
  english: {
    title: "Английский язык для детей | Детский центр «Рыбка Долли» Керчь",
    description: "Занятия английским языком для детей в Керчи. Игровой метод, опытные педагоги — детский центр «Рыбка Долли».",
  },
};

const MAX_LINK = "https://max.ru/u/f9LHodD0cOIKcG0itfDWIZMQp22OCCCC7iCwIUARylW6FIn7W2H3IZ-imyY";
const TG_LINK = "https://t.me/irinadolli";

function ContactDropdown({ label, emoji, colorClass }: { label: string; emoji: string; colorClass: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full mb-6">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-center gap-2 w-full ${colorClass} text-white font-black px-8 py-4 rounded-2xl text-lg transition-all hover:shadow-lg`}
      >
        <span>{emoji}</span>
        {label}
        <Icon name={open ? "ChevronUp" : "ChevronDown"} size={20} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-10">
          <a
            href={MAX_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors font-bold text-gray-700"
          >
            <span className="text-xl">💬</span>
            Написать в MAX
          </a>
          <div className="border-t border-gray-100" />
          <a
            href={TG_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors font-bold text-gray-700"
          >
            <span className="text-xl">✈️</span>
            Написать в Telegram
          </a>
        </div>
      )}
    </div>
  );
}

const BLOG_API = "https://functions.poehali.dev/d84b54ca-2906-4a84-be8b-264f6d13e325";

const CATEGORIES = [
  { id: "tips", label: "Советы от педагога", emoji: "🎓", color: "bg-amber-50", border: "border-amber-200", tag: "bg-amber-100 text-amber-700" },
  { id: "life", label: "Наша жизнь на ладони", emoji: "🌈", color: "bg-rose-50", border: "border-rose-200", tag: "bg-rose-100 text-rose-700" },
  { id: "detail", label: "Подробно о важном", emoji: "📖", color: "bg-teal-50", border: "border-teal-200", tag: "bg-teal-100 text-teal-700" },
  { id: "summer",      label: "Лето с нами. Новости летнего клуба", emoji: "☀️", color: "bg-yellow-50",  border: "border-yellow-200",  tag: "bg-yellow-100 text-yellow-700"  },
  { id: "afterschool", label: "Группа продлённого дня",    emoji: "📚", color: "bg-indigo-50",  border: "border-indigo-200",  tag: "bg-indigo-100 text-indigo-700"  },
  { id: "english",     label: "Группа английского языка", emoji: "🇬🇧", color: "bg-sky-50",    border: "border-sky-200",    tag: "bg-sky-100 text-sky-700"        },
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
  teacher_photo?: string;
  teacher_name?: string;
}

function VideoThumb({ url, onClick }: { url: string; onClick: () => void }) {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaying(true);
    ref.current?.play();
  };

  return (
    <div className="w-full h-full relative bg-gray-900" onClick={onClick}>
      <video
        ref={ref}
        src={url}
        className="w-full h-full object-cover"
        playsInline
        preload="metadata"
        controls={playing}
        onEnded={() => setPlaying(false)}
      />
      {!playing && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={handlePlay}
        >
          <div className="bg-black/50 rounded-full p-3">
            <Icon name="Play" size={32} className="text-white" />
          </div>
        </div>
      )}
    </div>
  );
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
            className={`rounded-2xl overflow-hidden bg-gray-100 group ${m.type === "video" ? "aspect-video" : media.length === 1 ? "cursor-pointer" : "aspect-square cursor-pointer"}`}
            onClick={m.type === "image" ? () => setActive(m) : undefined}
          >
            {m.type === "video" ? (
              <VideoThumb url={m.url} onClick={() => setActive(m)} />
            ) : (
              <img src={m.url} alt="" className={`w-full transition-transform duration-500 group-hover:scale-105 ${media.length === 1 ? "h-auto object-contain" : "h-full object-cover"}`} />
            )}
          </div>
        ))}
      </div>
      {active && active.type === "image" && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setActive(null)}>
          <button className="absolute top-4 right-4 text-white" onClick={() => setActive(null)}>
            <Icon name="X" size={28} />
          </button>
          <img src={active.url} alt="" className="max-w-full max-h-[90vh] rounded-2xl object-contain" onClick={e => e.stopPropagation()} />
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
          {(post.teacher_photo || post.teacher_name) ? (
            <div className="flex items-start gap-3 mb-3">
              <div className="flex flex-col items-center gap-1 shrink-0">
                {post.teacher_photo ? (
                  <img
                    src={post.teacher_photo}
                    alt="Автор"
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-300 shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-500 text-lg font-black">
                    {post.teacher_name?.charAt(0).toUpperCase()}
                  </div>
                )}
                {post.teacher_name && (
                  <span className="text-xs font-semibold text-amber-700 text-center leading-tight max-w-[56px]">{post.teacher_name}</span>
                )}
              </div>
              <p className={!expanded && isLong ? "line-clamp-4" : ""}>{post.content}</p>
            </div>
          ) : (
            <p className={!expanded && isLong ? "line-clamp-4" : ""}>{post.content}</p>
          )}
          {isLong && (
            <button className="text-orange-500 font-semibold text-sm mt-1 hover:underline" onClick={() => setExpanded(!expanded)}>
              {expanded ? "Свернуть" : "Читать полностью"}
            </button>
          )}
        </div>
      )}
      <MediaGallery media={post.media} />
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2 flex-wrap">
        <a
          href={`/blog/${post.id}`}
          className="text-orange-500 font-bold text-sm hover:underline flex items-center gap-1"
          onClick={e => e.stopPropagation()}
        >
          Открыть статью →
        </a>
        <a
          href={`https://vk.com/share.php?url=${encodeURIComponent("https://blogribkadolli.ru/blog/" + post.id)}&title=${encodeURIComponent(post.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-xs font-bold transition-opacity hover:opacity-80"
          style={{ background: "#0077FF" }}
          onClick={e => e.stopPropagation()}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2zm2.18 13.36h-1.6c-.6 0-.79-.48-1.87-1.57-1-.92-1.43-1.04-1.68-1.04-.34 0-.44.1-.44.57v1.43c0 .41-.13.65-1.22.65-1.8 0-3.8-1.09-5.2-3.13C3.57 9.67 3.1 7.7 3.1 7.27c0-.25.1-.48.57-.48h1.6c.43 0 .59.19.75.65.83 2.38 2.2 4.47 2.77 4.47.21 0 .31-.1.31-.65V9.1c-.07-1.17-.68-1.27-.68-1.69 0-.2.16-.41.43-.41h2.52c.36 0 .49.19.49.62v3.33c0 .36.16.49.27.49.21 0 .39-.13.78-.52 1.2-1.35 2.06-3.43 2.06-3.43.11-.25.31-.48.74-.48h1.6c.48 0 .59.25.48.6-.2.93-2.14 3.67-2.14 3.67-.17.27-.23.39 0 .69.17.23.73.71 1.1 1.14.68.77 1.2 1.42 1.34 1.87.14.44-.08.67-.53.67z"/></svg>
          ВКонтакте
        </a>
      </div>
    </article>
  );
}

export default function Blog() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const validIds = CATEGORIES.map(c => c.id);
  const paramCat = searchParams.get("category") || "";
  const [activeTab, setActiveTab] = useState(validIds.includes(paramCat) ? paramCat : "tips");
  const seo = SEO_BY_CATEGORY[activeTab] ?? {
    title: "Блог детского центра «Рыбка Долли» — Керчь",
    description: "Блог детского центра «Рыбка Долли» в Керчи — советы педагогов, новости центра, статьи о развитии детей.",
  };
  usePageMeta(seo.title, seo.description);
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
    setSearchParams({ category: activeTab }, { replace: true });
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
          <button
            onClick={() => navigate("/blog/qa")}
            className="flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all bg-rose-100 text-rose-600 hover:bg-rose-200"
          >
            <img src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/15744313-9270-4292-bb6b-c44dc00a492a.png" alt="" className="w-5 h-5 object-contain" />
            <span>Спрашивали — Отвечаем</span>
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {activeTab === "summer" && (
          <ContactDropdown label="Забронировать смену летнего клуба" emoji="☀️" colorClass="bg-yellow-400 hover:bg-yellow-500" />
        )}
        {activeTab === "afterschool" && (
          <ContactDropdown label="Записаться в группу" emoji="📚" colorClass="bg-indigo-500 hover:bg-indigo-600" />
        )}
        {activeTab === "english" && (
          <ContactDropdown label="Записаться в группу английского" emoji="🇬🇧" colorClass="bg-sky-500 hover:bg-sky-600" />
        )}
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
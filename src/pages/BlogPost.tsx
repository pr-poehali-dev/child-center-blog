import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const BLOG_API = "https://functions.poehali.dev/d84b54ca-2906-4a84-be8b-264f6d13e325";

const CATEGORIES: Record<string, { label: string; emoji: string; color: string; border: string; tag: string }> = {
  tips:        { label: "Советы от педагога",              emoji: "🎓", color: "bg-amber-50",  border: "border-amber-200",  tag: "bg-amber-100 text-amber-700"  },
  life:        { label: "Наша жизнь на ладони",            emoji: "🌈", color: "bg-rose-50",   border: "border-rose-200",   tag: "bg-rose-100 text-rose-700"    },
  detail:      { label: "Подробно о важном",               emoji: "📖", color: "bg-teal-50",   border: "border-teal-200",   tag: "bg-teal-100 text-teal-700"    },
  summer:      { label: "Лето с нами. Летний клуб",        emoji: "☀️", color: "bg-yellow-50", border: "border-yellow-200", tag: "bg-yellow-100 text-yellow-700"},
  afterschool: { label: "Группа продлённого дня",          emoji: "📚", color: "bg-indigo-50", border: "border-indigo-200", tag: "bg-indigo-100 text-indigo-700"},
  english:     { label: "Группа английского языка",        emoji: "🇬🇧", color: "bg-sky-50",   border: "border-sky-200",    tag: "bg-sky-100 text-sky-700"      },
};

interface MediaItem { type: "image" | "video"; url: string; }
interface Post {
  id: number; category: string; title: string; content: string;
  media: MediaItem[]; created_at: string; teacher_photo?: string; teacher_name?: string;
}

function VideoThumb({ url }: { url: string }) {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  return (
    <div className="w-full rounded-2xl overflow-hidden bg-gray-900 relative">
      <video ref={ref} src={url} className="w-full" playsInline preload="metadata" controls={playing} onEnded={() => setPlaying(false)} />
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={() => { setPlaying(true); ref.current?.play(); }}>
          <div className="bg-black/50 rounded-full p-4"><Icon name="Play" size={36} className="text-white" /></div>
        </div>
      )}
    </div>
  );
}

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${BLOG_API}?id=${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.post) {
          setPost(d.post);
          const title = `${d.post.title} | Блог детского центра «Рыбка Долли»`;
          const desc = d.post.content.slice(0, 160).replace(/\n/g, " ");
          const firstImg = d.post.media?.find((m: MediaItem) => m.type === "image")?.url;
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
          setMeta("description", desc);
          setOg("og:title", title);
          setOg("og:description", desc);
          setOg("og:type", "article");
          setOg("og:url", `https://blogribkadolli.ru/blog/${id}`);
          if (firstImg) setOg("og:image", firstImg);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const cat = post ? CATEGORIES[post.category] : null;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

  const shareVk = () => {
    if (!post) return;
    const url = `https://vk.com/share.php?url=${encodeURIComponent(`https://blogribkadolli.ru/blog/${post.id}`)}&title=${encodeURIComponent(post.title)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#fffdf8] font-nunito text-gray-700">
      {/* HEADER */}
      <div className="bg-white border-b border-orange-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate("/blog")} className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors font-semibold">
            <Icon name="ArrowLeft" size={20} />
            <span>Назад в блог</span>
          </button>
          <div className="flex-1" />
          <button onClick={() => navigate("/")} className="text-sm text-gray-400 hover:text-orange-500 transition-colors font-semibold">
            На главную
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {loading && (
          <div className="flex justify-center py-24">
            <div className="w-10 h-10 border-4 border-orange-300 border-t-orange-500 rounded-full animate-spin" />
          </div>
        )}

        {!loading && !post && (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">😕</div>
            <p className="text-gray-500 font-semibold">Статья не найдена</p>
            <button onClick={() => navigate("/blog")} className="mt-6 text-orange-500 font-bold hover:underline">← Вернуться в блог</button>
          </div>
        )}

        {post && (
          <article>
            {/* Категория и дата */}
            <div className="flex items-center justify-between mb-4">
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${cat?.tag || "bg-gray-100 text-gray-500"}`}>
                {cat?.emoji} {cat?.label}
              </span>
              <span className="text-sm text-gray-400">{formatDate(post.created_at)}</span>
            </div>

            {/* Заголовок */}
            <h1 className="text-3xl font-black text-gray-800 leading-tight mb-6">{post.title}</h1>

            {/* Автор */}
            {(post.teacher_photo || post.teacher_name) && (
              <div className="flex items-center gap-3 mb-6 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                {post.teacher_photo ? (
                  <img src={post.teacher_photo} alt="Автор" className="w-14 h-14 rounded-full object-cover border-2 border-amber-300 shadow-sm flex-shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-500 text-xl font-black flex-shrink-0">
                    {post.teacher_name?.charAt(0).toUpperCase()}
                  </div>
                )}
                {post.teacher_name && <span className="font-bold text-amber-800">{post.teacher_name}</span>}
              </div>
            )}

            {/* Текст */}
            {post.content && (
              <div className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap mb-6">{post.content}</div>
            )}

            {/* Медиа */}
            {post.media?.length > 0 && (
              <div className={`grid gap-3 mb-6 ${post.media.length === 1 ? "grid-cols-1" : post.media.length === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3"}`}>
                {post.media.map((m, i) =>
                  m.type === "video" ? (
                    <div key={i} className={post.media.length === 1 ? "" : "aspect-square overflow-hidden rounded-2xl"}>
                      <VideoThumb url={m.url} />
                    </div>
                  ) : (
                    <div key={i} className={`rounded-2xl overflow-hidden cursor-pointer ${post.media.length === 1 ? "" : "aspect-square"}`} onClick={() => setLightbox(m.url)}>
                      <img src={m.url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  )
                )}
              </div>
            )}

            {/* Поделиться */}
            <div className="border-t border-gray-100 pt-6 flex items-center justify-between">
              <span className="text-sm text-gray-400">Понравилось? Поделитесь!</span>
              <button
                onClick={shareVk}
                className="flex items-center gap-2 px-5 py-2 rounded-full text-white text-sm font-bold transition-opacity hover:opacity-80"
                style={{ background: "#0077FF" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2zm2.18 13.36h-1.6c-.6 0-.79-.48-1.87-1.57-1-.92-1.43-1.04-1.68-1.04-.34 0-.44.1-.44.57v1.43c0 .41-.13.65-1.22.65-1.8 0-3.8-1.09-5.2-3.13C3.57 9.67 3.1 7.7 3.1 7.27c0-.25.1-.48.57-.48h1.6c.43 0 .59.19.75.65.83 2.38 2.2 4.47 2.77 4.47.21 0 .31-.1.31-.65V9.1c-.07-1.17-.68-1.27-.68-1.69 0-.2.16-.41.43-.41h2.52c.36 0 .49.19.49.62v3.33c0 .36.16.49.27.49.21 0 .39-.13.78-.52 1.2-1.35 2.06-3.43 2.06-3.43.11-.25.31-.48.74-.48h1.6c.48 0 .59.25.48.6-.2.93-2.14 3.67-2.14 3.67-.17.27-.23.39 0 .69.17.23.73.71 1.1 1.14.68.77 1.2 1.42 1.34 1.87.14.44-.08.67-.53.67z"/></svg>
                ВКонтакте
              </button>
            </div>
          </article>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white" onClick={() => setLightbox(null)}>
            <Icon name="X" size={32} />
          </button>
          <img src={lightbox} alt="" className="max-w-full max-h-full object-contain rounded-xl" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

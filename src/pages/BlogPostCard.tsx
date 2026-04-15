import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";
import StickerTag from "@/components/ui/sticker-tag";
import { MediaGallery } from "./BlogMediaGallery";
import { CATEGORIES, SUBSCRIBERS_API, MAX_LINK, TG_LINK, Post } from "./blog-types";

export function SubscribeForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "exists">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch(SUBSCRIBERS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      if (res.status === 409) { setStatus("exists"); return; }
      if (!res.ok) { setStatus("error"); return; }
      setStatus("success");
      setName("");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pb-12">
      <div className="bg-gradient-to-br from-orange-50 to-rose-50 border border-orange-100 rounded-3xl p-7">
        <div className="flex items-start gap-4">
          <div className="text-4xl shrink-0">📬</div>
          <div className="flex-1">
            <h3 className="font-black text-gray-800 text-lg leading-tight">Подпишитесь на блог</h3>
            <p className="text-gray-500 text-sm mt-1 mb-4">Получайте уведомления о новых статьях прямо на почту</p>

            {status === "success" ? (
              <div className="flex items-center gap-2 text-green-600 font-semibold text-sm bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <Icon name="CheckCircle" size={18} />
                Отлично! Вы подписаны. Ждите писем от нас ☀️
              </div>
            ) : status === "exists" ? (
              <div className="flex items-center gap-2 text-orange-600 font-semibold text-sm bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
                <Icon name="Info" size={18} />
                Этот email уже подписан на блог
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Ваше имя"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="flex-1 border border-orange-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="flex-1 border border-orange-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap"
                >
                  {status === "loading" ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Icon name="Bell" size={15} />
                  )}
                  Подписаться
                </button>
              </form>
            )}
            {status === "error" && (
              <p className="text-red-500 text-xs mt-2">Ошибка. Попробуйте ещё раз.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContactDropdown({ label, emoji, colorClass }: { label: string; emoji: string; colorClass: string }) {
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

export function PostCard({ post, categoryStickerText }: { post: Post; categoryStickerText?: string }) {
  const activeSticker = post.sticker?.trim() || categoryStickerText?.trim() || "";
  const cat = CATEGORIES.find(c => c.id === post.category);
  const [expanded, setExpanded] = useState(false);
  const isLong = post.content.length > 300;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <article className={`relative ${cat?.color || "bg-white"} rounded-3xl p-6 border ${cat?.border || "border-gray-100"} shadow-sm overflow-visible`}>
      {activeSticker && (
        <div className="absolute -top-4 -right-3 z-10 rotate-[8deg]">
          <StickerTag text={activeSticker} size="md" />
        </div>
      )}
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

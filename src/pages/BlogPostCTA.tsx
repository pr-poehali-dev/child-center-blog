import Icon from "@/components/ui/icon";
import { withBlogUtm } from "@/lib/analytics";
import { Post } from "./useBlogPostData";

interface BlogPostCTAProps {
  post: Post;
  onShareVk: () => void;
}

export default function BlogPostCTA({ post, onShareVk }: BlogPostCTAProps) {
  return (
    <>
      {/* Кастомная кнопка-призыв */}
      {post.cta_text?.trim() && post.cta_url?.trim() && (
        <div className="mb-6 flex justify-center">
          <a
            href={withBlogUtm(post.cta_url)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-rose-400 hover:from-orange-500 hover:to-rose-500 text-white font-black px-8 py-4 rounded-2xl text-base shadow-md transition-all"
          >
            {post.cta_text}
            <Icon name="ArrowRight" size={18} />
          </a>
        </div>
      )}

      {/* Блок-призыв */}
      <div className="my-8 rounded-3xl overflow-hidden bg-gradient-to-br from-orange-400 to-rose-400 p-6 text-white text-center">
        <div className="text-4xl mb-3">🐟</div>
        <h3 className="font-black text-xl mb-2 leading-tight">Хотите записать ребёнка к нам?</h3>
        <p className="text-white/85 text-sm mb-5 leading-relaxed">Приходите на пробное занятие — познакомимся, покажем центр и подберём программу для вашего ребёнка</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/#booking"
            onClick={() => { if (post?.checklist_url) sessionStorage.setItem("booking_checklist_url", post.checklist_url); else sessionStorage.removeItem("booking_checklist_url"); }}
            className="inline-flex items-center justify-center gap-2 bg-white text-orange-500 font-black px-6 py-3 rounded-2xl text-sm hover:bg-orange-50 transition-colors"
          >
            Записаться на занятие
          </a>
          <a
            href="https://t.me/irinadolli"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-colors"
          >
            ✈️ Написать в Telegram
          </a>
        </div>
      </div>

      {/* Мосты на сайты продлёнки и летнего клуба */}
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        <a
          href={withBlogUtm("https://schooldolli.ru", "cta")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-black px-5 py-3.5 rounded-2xl text-sm transition-colors"
        >
          <span className="text-lg">📚</span> Записаться в продлёнку
        </a>
        <a
          href={withBlogUtm("https://dolliklub.ru", "cta")}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-black px-5 py-3.5 rounded-2xl text-sm transition-colors"
        >
          <span className="text-lg">☀️</span> Записаться в летний клуб
        </a>
      </div>

      {/* Поделиться */}
      <div className="border-t border-gray-100 pt-6 flex items-center justify-between">
        <span className="text-sm text-gray-400">
          {post.category === "plate"
            ? "Поделитесь с подругой, у которой ребёнок на диете БГБЛ!"
            : "Понравилось? Поделитесь!"}
        </span>
        <button
          onClick={onShareVk}
          className="flex items-center gap-2 px-5 py-2 rounded-full text-white text-sm font-bold transition-opacity hover:opacity-80"
          style={{ background: "#0077FF" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2zm2.18 13.36h-1.6c-.6 0-.79-.48-1.87-1.57-1-.92-1.43-1.04-1.68-1.04-.34 0-.44.1-.44.57v1.43c0 .41-.13.65-1.22.65-1.8 0-3.8-1.09-5.2-3.13C3.57 9.67 3.1 7.7 3.1 7.27c0-.25.1-.48.57-.48h1.6c.43 0 .59.19.75.65.83 2.38 2.2 4.47 2.77 4.47.21 0 .31-.1.31-.65V9.1c-.07-1.17-.68-1.27-.68-1.69 0-.2.16-.41.43-.41h2.52c.36 0 .49.19.49.62v3.33c0 .36.16.49.27.49.21 0 .39-.13.78-.52 1.2-1.35 2.06-3.43 2.06-3.43.11-.25.31-.48.74-.48h1.6c.48 0 .59.25.48.6-.2.93-2.14 3.67-2.14 3.67-.17.27-.23.39 0 .69.17.23.73.71 1.1 1.14.68.77 1.2 1.42 1.34 1.87.14.44-.08.67-.53.67z"/></svg>
          ВКонтакте
        </button>
      </div>
    </>
  );
}
import Icon from "@/components/ui/icon";
import { withBlogUtm } from "@/lib/analytics";
import { Post } from "./useBlogPostData";
import BlogShareBar from "./BlogShareBar";

interface BlogPostCTAProps {
  post: Post;
  shareUrl: string;
}

export default function BlogPostCTA({ post, shareUrl }: BlogPostCTAProps) {
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
      <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-sm text-gray-400">
          {post.category === "plate"
            ? "Поделитесь с подругой, у которой ребёнок на диете БГБЛ!"
            : "Понравилось? Поделитесь!"}
        </span>
        <BlogShareBar url={shareUrl} title={post.title} />
      </div>
    </>
  );
}
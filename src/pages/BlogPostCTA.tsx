import Icon from "@/components/ui/icon";
import { withBlogUtm } from "@/lib/analytics";
import BlogDirectionPicker from "@/components/BlogDirectionPicker";
import { Post } from "./useBlogPostData";
import BlogShareBar from "./BlogShareBar";
import { SubscribeForm } from "./BlogPostCard";

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

      {/* Поделиться */}
      <div className="border-t border-gray-100 pt-6 pb-2 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-sm text-gray-400">
          {post.category === "plate"
            ? "Поделитесь с подругой, у которой ребёнок на диете БГБЛ!"
            : "Понравилось? Поделитесь!"}
        </span>
        <BlogShareBar url={shareUrl} title={post.title} />
      </div>

      {/* Единый мостик выбора направления — тот же компонент, что на страницах категорий,
          сразу за ним подписка на блог, как на страницах категорий. Статья читается в узкой
          колонке (max-w-2xl), а эти блоки рассчитаны на max-w-3xl — "раздуваем" их на всю
          ширину экрана и центрируем заново, чтобы форма подписки не обрезалась по ширине. */}
      <div className="w-screen relative left-1/2 -ml-[50vw]">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <BlogDirectionPicker />
        </div>
        <SubscribeForm />
      </div>
    </>
  );
}
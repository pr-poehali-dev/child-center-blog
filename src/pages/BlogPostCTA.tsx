import Icon from "@/components/ui/icon";
import { withBlogUtm } from "@/lib/analytics";
import BrandBridgeCard from "@/components/BrandBridgeCard";
import WatercolorWave from "@/components/home/WatercolorWave";
import honeyStar from "@/assets/honey-star.png";
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
      <div className="relative overflow-hidden my-8" style={{ background: "#FBF6EE", borderRadius: 20, boxShadow: "0 2px 5px rgba(0,0,0,0.05), 0 14px 28px rgba(0,0,0,0.08)" }}>
        <div className="relative p-7 text-center">
          <img src={honeyStar} alt="" className="w-10 h-10 mx-auto mb-3" />
          <h3 className="font-playfair font-bold leading-tight" style={{ color: "#17364A", fontSize: 21 }}>Хотите записать ребёнка к нам?</h3>
          <p className="font-golos mt-2 mb-5" style={{ color: "#4B4B4B", fontSize: 14.5 }}>Приходите на пробное занятие — познакомимся, покажем центр и подберём программу для вашего ребёнка</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/#booking"
              onClick={() => { if (post?.checklist_url) sessionStorage.setItem("booking_checklist_url", post.checklist_url); else sessionStorage.removeItem("booking_checklist_url"); }}
              className="inline-flex items-center justify-center gap-2 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-colors"
              style={{ background: "#E8985F" }}
            >
              Записаться на занятие
            </a>
          </div>
        </div>
        <WatercolorWave />
      </div>

      {/* Мосты на сайты продлёнки и летнего клуба */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <BrandBridgeCard
          href={withBlogUtm("https://schooldolli.ru", "cta")}
          title="Записаться в продлёнку"
          subtitle="Присмотр, уроки и полдник каждый будний день"
        />
        <BrandBridgeCard
          href={withBlogUtm("https://dolliklub.ru", "cta")}
          title="Записаться в летний клуб"
          subtitle="Смены, программа и яркие каникулы для детей"
        />
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
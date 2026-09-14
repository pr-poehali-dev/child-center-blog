import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import StickerTag from "@/components/ui/sticker-tag";
import { CATEGORIES, useBlogPostData } from "./useBlogPostData";
import BlogPostRecipeCard from "./BlogPostRecipeCard";
import BlogPostMedia, { BlogPostLightbox } from "./BlogPostMedia";
import BlogPostCTA from "./BlogPostCTA";
import honeyStar from "@/assets/honey-star.png";

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { post, loading } = useBlogPostData(id);
  const [lightbox, setLightbox] = useState<string | null>(null);

  // Если статья открыта по старому числовому id, а у неё уже есть человекочитаемый slug — 
  // незаметно переводим адрес на канонический (для случаев когда SPA уже загружен, без перезагрузки страницы)
  useEffect(() => {
    if (post?.slug && id && id !== post.slug) {
      navigate(`/blog/${post.slug}`, { replace: true });
    }
  }, [post?.slug, id, navigate]);

  const cat = post ? CATEGORIES[post.category] : null;
  const ingredientsList = (post?.recipe_ingredients || "").split("\n").map(s => s.trim()).filter(Boolean);
  const stepsList = (post?.recipe_steps || "").split("\n").map(s => s.trim()).filter(Boolean);
  const isRecipe = post?.category === "plate" && (
    post.recipe_time?.trim() || post.recipe_servings?.trim() ||
    post.recipe_calories?.trim() || post.recipe_proteins?.trim() || post.recipe_fats?.trim() || post.recipe_carbs?.trim() ||
    ingredientsList.length > 0 || stepsList.length > 0
  );

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

  const shareUrl = post ? `https://blogribkadolli.ru/blog/${post.slug || post.id}` : "";

  return (
    <div className="min-h-screen bg-[#FFF9F3] font-nunito text-gray-700">
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
            <img src={honeyStar} alt="" className="w-14 h-14 mx-auto mb-4 opacity-70" />
            <p className="text-gray-500 font-semibold">Статья не найдена</p>
            <button onClick={() => navigate("/blog")} className="mt-6 text-orange-500 font-bold hover:underline">← Вернуться в блог</button>
          </div>
        )}

        {post && (
          <article>
            {/* Категория и дата */}
            <div className="flex items-center justify-between mb-4">
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${cat?.tag || "bg-gray-100 text-gray-500"}`}>
                {cat?.label}
              </span>
              <span className="text-sm text-gray-400">{formatDate(post.created_at)}</span>
            </div>

            {/* Заголовок */}
            <h1 className="text-3xl font-black text-gray-800 leading-tight mb-4">{post.title}</h1>

            {/* Стикер поста */}
            {post.sticker?.trim() && (
              <div className="flex items-start mb-4">
                <StickerTag text={post.sticker.trim()} size="lg" />
              </div>
            )}

            {/* Карточка рецепта: время, порции, КБЖУ */}
            {isRecipe && (
              <BlogPostRecipeCard post={post} ingredientsList={ingredientsList} stepsList={stepsList} />
            )}

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

            <BlogPostMedia post={post} onOpenLightbox={setLightbox} />

            <BlogPostCTA post={post} shareUrl={shareUrl} />
          </article>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <BlogPostLightbox url={lightbox} post={post} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}
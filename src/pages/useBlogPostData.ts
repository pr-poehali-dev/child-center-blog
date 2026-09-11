import { useState, useEffect } from "react";
import { trackGoal } from "@/lib/analytics";

const BLOG_API = "https://functions.poehali.dev/d84b54ca-2906-4a84-be8b-264f6d13e325";

export const CATEGORIES: Record<string, { label: string; emoji: string; color: string; border: string; tag: string }> = {
  tips:        { label: "Советы от педагога",              emoji: "🎓", color: "bg-amber-50",  border: "border-amber-200",  tag: "bg-amber-100 text-amber-700"  },
  life:        { label: "Наша жизнь на ладони",            emoji: "🌈", color: "bg-rose-50",   border: "border-rose-200",   tag: "bg-rose-100 text-rose-700"    },
  detail:      { label: "Подробно о важном",               emoji: "📖", color: "bg-teal-50",   border: "border-teal-200",   tag: "bg-teal-100 text-teal-700"    },
  summer:      { label: "Лето с нами. Летний клуб",        emoji: "☀️", color: "bg-yellow-50", border: "border-yellow-200", tag: "bg-yellow-100 text-yellow-700"},
  afterschool: { label: "Продлёнка",          emoji: "📚", color: "bg-indigo-50", border: "border-indigo-200", tag: "bg-indigo-100 text-indigo-700"},
  english:     { label: "Группа английского языка",        emoji: "🇬🇧", color: "bg-sky-50",    border: "border-sky-200",    tag: "bg-sky-100 text-sky-700"       },
  experiments: { label: "Экспериментаторы",                emoji: "🔬", color: "bg-purple-50", border: "border-purple-200", tag: "bg-purple-100 text-purple-700" },
  chefs:       { label: "Шеф-повара",                      emoji: "👨‍🍳", color: "bg-orange-50", border: "border-orange-200", tag: "bg-orange-100 text-orange-700" },
  masters:     { label: "Мастера вдохновения",              emoji: "🎨", color: "bg-pink-50",   border: "border-pink-200",   tag: "bg-pink-100 text-pink-700"     },
  plate:       { label: "Тарелка для всех",                 emoji: "🥗", color: "bg-green-50",  border: "border-green-200",  tag: "bg-green-100 text-green-700"   },
  yasli:       { label: "Ясли (1,5–3 года)",                emoji: "🍼", color: "bg-orange-50", border: "border-orange-200", tag: "bg-orange-100 text-orange-700" },
  school:      { label: "Подготовка к школе",               emoji: "🎒", color: "bg-yellow-50", border: "border-yellow-300", tag: "bg-yellow-100 text-yellow-800" },
};

export interface MediaItem { type: "image" | "video" | "document"; url: string; name?: string; alt?: string; caption?: string; }
export interface Post {
  id: number; category: string; title: string; content: string;
  media: MediaItem[]; created_at: string; teacher_photo?: string; teacher_name?: string; sticker?: string; checklist_url?: string;
  cta_text?: string; cta_url?: string;
  recipe_time?: string; recipe_servings?: string;
  recipe_calories?: string; recipe_proteins?: string; recipe_fats?: string; recipe_carbs?: string;
  recipe_ingredients?: string; recipe_steps?: string;
  slug?: string; seo_title?: string; seo_description?: string;
}

export function useBlogPostData(id: string | undefined) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const isNumeric = /^\d+$/.test(id);
    const query = isNumeric ? `id=${id}` : `slug=${encodeURIComponent(id)}`;
    fetch(`${BLOG_API}?${query}`)
      .then(r => r.json())
      .then(d => {
        if (d.post) {
          setPost(d.post);
          const isPlate = d.post.category === "plate";
          const urlPath = d.post.slug || d.post.id;
          const seoTitle = d.post.seo_title?.trim();
          const title = seoTitle
            ? `${seoTitle} | Блог детского центра «Рыбка Долли»`
            : isPlate
              ? `${d.post.title} | Рецепт за подписку`
              : `${d.post.title} | Блог детского центра «Рыбка Долли»`;
          const rawDesc = d.post.content.replace(/\n/g, " ").trim();
          const autoDesc = rawDesc.length > 160
            ? (rawDesc.slice(0, 160).lastIndexOf(" ") > 100
                ? rawDesc.slice(0, rawDesc.slice(0, 160).lastIndexOf(" ")) + "..."
                : rawDesc.slice(0, 160) + "...")
            : rawDesc || d.post.title;
          const seoDesc = d.post.seo_description?.trim();
          const desc = seoDesc
            ? seoDesc
            : isPlate
              ? `${d.post.title} — нежные и вкусные! Скачайте пошаговый рецепт-чеклист за подписку. Подходит детям с аллергией и целиакией.`
              : autoDesc;
          const FALLBACK_IMG = "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/badbdcbb-25d9-4f41-a4b9-b704f68d9351.png";
          const firstImgItem = d.post.media?.find((m: MediaItem) => m.type === "image");
          const firstImg = firstImgItem?.url || FALLBACK_IMG;
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
          const setCanonical = (href: string) => {
            let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
            if (!el) { el = document.createElement("link"); el.setAttribute("rel", "canonical"); document.head.appendChild(el); }
            el.href = href;
          };
          setMeta("description", desc);
          setOg("og:title", title);
          setOg("og:description", desc);
          setOg("og:type", "article");
          setOg("og:url", `https://blogribkadolli.ru/blog/${urlPath}`);
          setOg("og:image", firstImg);
          setCanonical(`https://blogribkadolli.ru/blog/${urlPath}`);

          const schema: Record<string, unknown> = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": seoTitle || d.post.title,
            "description": desc,
            "url": `https://blogribkadolli.ru/blog/${urlPath}`,
            "datePublished": d.post.created_at,
            "dateModified": d.post.created_at,
            "inLanguage": "ru-RU",
            "publisher": {
              "@type": "Organization",
              "name": "Детский центр «Рыбка Долли»",
              "url": "https://blogribkadolli.ru/",
              "logo": {
                "@type": "ImageObject",
                "url": "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/badbdcbb-25d9-4f41-a4b9-b704f68d9351.png"
              }
            },
            "isPartOf": {
              "@type": "Blog",
              "name": "Блог детского центра «Рыбка Долли»",
              "url": "https://blogribkadolli.ru/blog"
            }
          };
          if (d.post.teacher_name) {
            const authorSchema: Record<string, unknown> = {
              "@type": "Person",
              "name": d.post.teacher_name,
              "worksFor": {
                "@type": "Organization",
                "name": "Детский центр «Рыбка Долли»"
              }
            };
            if (d.post.teacher_photo) authorSchema["image"] = d.post.teacher_photo;
            schema["author"] = authorSchema;
          }
          if (firstImg) {
            schema["image"] = { "@type": "ImageObject", "url": firstImg };
          }
          let ldEl = document.querySelector('script[data-schema="blogpost"]') as HTMLScriptElement | null;
          if (!ldEl) {
            ldEl = document.createElement("script");
            ldEl.setAttribute("type", "application/ld+json");
            ldEl.setAttribute("data-schema", "blogpost");
            document.head.appendChild(ldEl);
          }
          ldEl.textContent = JSON.stringify(schema);

          // Schema.org Recipe для постов категории «Тарелка для всех»
          if (isPlate) {
            const recipe: Record<string, unknown> = {
              "@context": "https://schema.org",
              "@type": "Recipe",
              "name": d.post.title,
              "description": desc,
              "url": `https://blogribkadolli.ru/blog/${id}`,
              "datePublished": d.post.created_at,
              "inLanguage": "ru-RU",
              "recipeCategory": "Безглютеновая выпечка",
              "keywords": "безглютеновые блины, рецепты без молока для детей, безлактозное питание, рецепты при целиакии, выпечка для аллергиков, зеленая гречка рецепты",
              "suitableForDiet": ["https://schema.org/GlutenFreeDiet", "https://schema.org/LowLactoseDiet"],
              "author": {
                "@type": "Organization",
                "name": "Детский центр «Рыбка Долли»",
                "url": "https://blogribkadolli.ru/"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Детский центр «Рыбка Долли»",
                "url": "https://blogribkadolli.ru/",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/badbdcbb-25d9-4f41-a4b9-b704f68d9351.png"
                }
              }
            };
            if (firstImg) recipe["image"] = firstImg;
            if (d.post.teacher_name) {
              recipe["author"] = { "@type": "Person", "name": d.post.teacher_name };
            }
            const recipeIngredientsArr: string[] = (d.post.recipe_ingredients || "").split("\n").map((s: string) => s.trim()).filter(Boolean);
            const recipeStepsArr: string[] = (d.post.recipe_steps || "").split("\n").map((s: string) => s.trim()).filter(Boolean);
            if (recipeIngredientsArr.length) recipe["recipeIngredient"] = recipeIngredientsArr;
            if (recipeStepsArr.length) {
              recipe["recipeInstructions"] = recipeStepsArr.map((step: string) => ({ "@type": "HowToStep", "text": step }));
            }
            if (d.post.recipe_servings?.trim()) recipe["recipeYield"] = d.post.recipe_servings.trim();
            if (d.post.recipe_time?.trim()) recipe["totalTime"] = d.post.recipe_time.trim();
            if (d.post.recipe_calories?.trim() || d.post.recipe_proteins?.trim() || d.post.recipe_fats?.trim() || d.post.recipe_carbs?.trim()) {
              const nutrition: Record<string, unknown> = { "@type": "NutritionInformation" };
              if (d.post.recipe_calories?.trim()) nutrition["calories"] = `${d.post.recipe_calories.trim()} ккал`;
              if (d.post.recipe_proteins?.trim()) nutrition["proteinContent"] = d.post.recipe_proteins.trim();
              if (d.post.recipe_fats?.trim()) nutrition["fatContent"] = d.post.recipe_fats.trim();
              if (d.post.recipe_carbs?.trim()) nutrition["carbohydrateContent"] = d.post.recipe_carbs.trim();
              recipe["nutrition"] = nutrition;
            }
            let recipeEl = document.querySelector('script[data-schema="recipe"]') as HTMLScriptElement | null;
            if (!recipeEl) {
              recipeEl = document.createElement("script");
              recipeEl.setAttribute("type", "application/ld+json");
              recipeEl.setAttribute("data-schema", "recipe");
              document.head.appendChild(recipeEl);
            }
            recipeEl.textContent = JSON.stringify(recipe);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!post) return;
    let fired = false;
    const handleScroll = () => {
      if (fired) return;
      const scrolled = window.scrollY + window.innerHeight;
      const full = document.documentElement.scrollHeight;
      if (full > 0 && scrolled / full >= 0.9) {
        fired = true;
        trackGoal("read_end");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [post]);

  return { post, loading };
}
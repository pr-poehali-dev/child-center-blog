import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import StickerTag from "@/components/ui/sticker-tag";

const BLOG_API = "https://functions.poehali.dev/d84b54ca-2906-4a84-be8b-264f6d13e325";

const CATEGORIES: Record<string, { label: string; emoji: string; color: string; border: string; tag: string }> = {
  tips:        { label: "Советы от педагога",              emoji: "🎓", color: "bg-amber-50",  border: "border-amber-200",  tag: "bg-amber-100 text-amber-700"  },
  life:        { label: "Наша жизнь на ладони",            emoji: "🌈", color: "bg-rose-50",   border: "border-rose-200",   tag: "bg-rose-100 text-rose-700"    },
  detail:      { label: "Подробно о важном",               emoji: "📖", color: "bg-teal-50",   border: "border-teal-200",   tag: "bg-teal-100 text-teal-700"    },
  summer:      { label: "Лето с нами. Летний клуб",        emoji: "☀️", color: "bg-yellow-50", border: "border-yellow-200", tag: "bg-yellow-100 text-yellow-700"},
  afterschool: { label: "Группа продлённого дня",          emoji: "📚", color: "bg-indigo-50", border: "border-indigo-200", tag: "bg-indigo-100 text-indigo-700"},
  english:     { label: "Группа английского языка",        emoji: "🇬🇧", color: "bg-sky-50",    border: "border-sky-200",    tag: "bg-sky-100 text-sky-700"       },
  experiments: { label: "Экспериментаторы",                emoji: "🔬", color: "bg-purple-50", border: "border-purple-200", tag: "bg-purple-100 text-purple-700" },
  chefs:       { label: "Шеф-повара",                      emoji: "👨‍🍳", color: "bg-orange-50", border: "border-orange-200", tag: "bg-orange-100 text-orange-700" },
  masters:     { label: "Мастера вдохновения",              emoji: "🎨", color: "bg-pink-50",   border: "border-pink-200",   tag: "bg-pink-100 text-pink-700"     },
  plate:       { label: "Тарелка для всех",                 emoji: "🥗", color: "bg-green-50",  border: "border-green-200",  tag: "bg-green-100 text-green-700"   },
};

interface MediaItem { type: "image" | "video" | "document"; url: string; name?: string; alt?: string; caption?: string; }
interface Post {
  id: number; category: string; title: string; content: string;
  media: MediaItem[]; created_at: string; teacher_photo?: string; teacher_name?: string; sticker?: string; checklist_url?: string;
  cta_text?: string; cta_url?: string;
  recipe_time?: string; recipe_servings?: string;
  recipe_calories?: string; recipe_proteins?: string; recipe_fats?: string; recipe_carbs?: string;
  recipe_ingredients?: string; recipe_steps?: string;
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
          const isPlate = d.post.category === "plate";
          const title = isPlate
            ? `${d.post.title} | Рецепт за подписку`
            : `${d.post.title} | Блог детского центра «Рыбка Долли»`;
          const rawDesc = d.post.content.replace(/\n/g, " ").trim();
          const autoDesc = rawDesc.length > 160
            ? (rawDesc.slice(0, 160).lastIndexOf(" ") > 100
                ? rawDesc.slice(0, rawDesc.slice(0, 160).lastIndexOf(" ")) + "..."
                : rawDesc.slice(0, 160) + "...")
            : rawDesc || d.post.title;
          const desc = isPlate
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
          setMeta("description", desc);
          setOg("og:title", title);
          setOg("og:description", desc);
          setOg("og:type", "article");
          setOg("og:url", `https://blogribkadolli.ru/blog/${id}`);
          setOg("og:image", firstImg);

          const schema: Record<string, unknown> = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": d.post.title,
            "description": desc,
            "url": `https://blogribkadolli.ru/blog/${id}`,
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
            schema["author"] = {
              "@type": "Person",
              "name": d.post.teacher_name,
              "worksFor": {
                "@type": "Organization",
                "name": "Детский центр «Рыбка Долли»"
              }
            };
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

  const shareVk = () => {
    if (!post) return;
    const shareTitle = post.category === "plate"
      ? `Поделитесь с подругой, у которой ребенок на диете БГБЛ! ${post.title}`
      : post.title;
    const url = `https://vk.com/share.php?url=${encodeURIComponent(`https://blogribkadolli.ru/blog/${post.id}`)}&title=${encodeURIComponent(shareTitle)}`;
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
            <h1 className="text-3xl font-black text-gray-800 leading-tight mb-4">{post.title}</h1>

            {/* Стикер поста */}
            {post.sticker?.trim() && (
              <div className="flex items-start mb-4">
                <StickerTag text={post.sticker.trim()} size="lg" />
              </div>
            )}

            {/* Карточка рецепта: время, порции, КБЖУ */}
            {isRecipe && (
              <div className="mb-6 rounded-3xl border-2 border-green-100 bg-[#fffdf5] overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-5 py-3 flex items-center gap-2">
                  <span className="text-xl">📖</span>
                  <span className="text-white font-black text-sm tracking-wide uppercase">Рецепт</span>
                </div>
                <div className="p-5">
                  {(post.recipe_time?.trim() || post.recipe_servings?.trim()) && (
                    <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-dashed border-green-200">
                      {post.recipe_time?.trim() && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Icon name="Clock" size={18} className="text-green-500" />
                          <span className="text-sm font-bold">{post.recipe_time}</span>
                        </div>
                      )}
                      {post.recipe_servings?.trim() && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Icon name="Users" size={18} className="text-green-500" />
                          <span className="text-sm font-bold">{post.recipe_servings}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {(post.recipe_calories?.trim() || post.recipe_proteins?.trim() || post.recipe_fats?.trim() || post.recipe_carbs?.trim()) && (
                    <div className="mb-5">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">КБЖУ на порцию</p>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { label: "Ккал", value: post.recipe_calories },
                          { label: "Белки", value: post.recipe_proteins },
                          { label: "Жиры", value: post.recipe_fats },
                          { label: "Углев.", value: post.recipe_carbs },
                        ].map((item, i) => (
                          <div key={i} className="bg-green-50 border border-green-100 rounded-xl py-2.5 text-center">
                            <div className="font-black text-green-700 text-base">{item.value || "—"}</div>
                            <div className="text-[10px] text-gray-500 font-semibold uppercase">{item.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {ingredientsList.length > 0 && (
                    <div className="mb-5">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Ингредиенты</p>
                      <ul className="flex flex-col gap-2">
                        {ingredientsList.map((ing, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="mt-0.5 w-4 h-4 rounded-full border-2 border-green-400 shrink-0" />
                            {ing}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {stepsList.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Приготовление</p>
                      <ol className="flex flex-col gap-3">
                        {stepsList.map((step, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
                            <span className="w-6 h-6 rounded-full bg-green-500 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              </div>
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

            {/* Медиа (фото и видео) */}
            {post.media?.filter(m => m.type !== "document").length > 0 && (() => {
              const visMedia = post.media.filter(m => m.type !== "document");
              const cols = visMedia.length === 1 ? "grid-cols-1" : visMedia.length === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3";
              return (
                <div className={`grid gap-3 mb-6 ${cols}`}>
                  {visMedia.map((m, i) =>
                    m.type === "video" ? (
                      <div key={i} className={visMedia.length === 1 ? "" : "aspect-square overflow-hidden rounded-2xl"}>
                        <VideoThumb url={m.url} />
                      </div>
                    ) : (
                      <div key={i} className="flex flex-col gap-1">
                        <div className={`rounded-2xl overflow-hidden cursor-pointer ${visMedia.length === 1 ? "" : "aspect-square"}`} onClick={() => setLightbox(m.url)}>
                          <img src={m.url} alt={m.alt || post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        </div>
                        {m.caption && (
                          <p className="text-xs text-gray-500 text-center px-1 leading-snug">{m.caption}</p>
                        )}
                      </div>
                    )
                  )}
                </div>
              );
            })()}

            {/* Документы */}
            {post.media?.filter(m => m.type === "document").length > 0 && (
              <div className="flex flex-col gap-2 mb-6">
                <p className="text-xs font-bold text-gray-500 mb-1">Прикреплённые документы</p>
                {post.media.filter(m => m.type === "document").map((m, i) => {
                  const ext = m.url.split('.').pop()?.toLowerCase() || '';
                  const isPdf = ext === 'pdf';
                  return (
                    <a
                      key={i}
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-2xl px-4 py-3 transition-colors group"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-xs ${isPdf ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
                        {isPdf ? "PDF" : "DOC"}
                      </div>
                      <span className="text-sm font-semibold text-blue-700 group-hover:text-blue-800 truncate flex-1">
                        {m.name || `Документ.${ext}`}
                      </span>
                      <Icon name="Download" size={16} className="text-blue-400 shrink-0" />
                    </a>
                  );
                })}
              </div>
            )}

            {/* Кастомная кнопка-призыв */}
            {post.cta_text?.trim() && post.cta_url?.trim() && (
              <div className="mb-6 flex justify-center">
                <a
                  href={post.cta_url}
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

            {/* Поделиться */}
            <div className="border-t border-gray-100 pt-6 flex items-center justify-between">
              <span className="text-sm text-gray-400">
                {post.category === "plate"
                  ? "Поделитесь с подругой, у которой ребёнок на диете БГБЛ!"
                  : "Понравилось? Поделитесь!"}
              </span>
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
      {lightbox && (() => {
        const lbItem = post?.media?.find(m => m.url === lightbox);
        return (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
            <button className="absolute top-4 right-4 text-white" onClick={() => setLightbox(null)}>
              <Icon name="X" size={32} />
            </button>
            <div className="flex flex-col items-center gap-3" onClick={e => e.stopPropagation()}>
              <img src={lightbox} alt={lbItem?.alt || ""} className="max-w-full max-h-[85vh] object-contain rounded-xl" />
              {lbItem?.caption && <p className="text-white/80 text-sm text-center">{lbItem.caption}</p>}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { usePageMeta } from "@/hooks/usePageMeta";
import { BLOG_API, STICKERS_API, CATEGORIES, SEO_BY_CATEGORY, Post } from "./blog-types";
import { PostCard, ContactDropdown, SubscribeForm } from "./BlogPostCard";
import PlateChecklists from "./PlateChecklists";

export default function Blog() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const validIds = CATEGORIES.map(c => c.id);
  const paramCat = searchParams.get("category") || "";
  const [activeTab, setActiveTab] = useState(validIds.includes(paramCat) ? paramCat : "tips");
  const postsRef = useRef<HTMLDivElement>(null);
  const scrolledRef = useRef(false);
  const seo = SEO_BY_CATEGORY[activeTab] ?? {
    title: "Блог детского центра «Рыбка Долли» — Керчь",
    description: "Блог педагогов детского центра «Рыбка Долли» в Керчи: советы по воспитанию, развитию речи и подготовке к школе, новости центра, летний клуб, английский для детей. Читайте бесплатно.",
  };
  usePageMeta({ title: seo.title, description: seo.description, url: `https://blogribkadolli.ru/blog?category=${activeTab}`, type: "website" });
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [stickers, setStickers] = useState<Record<string, string>>({});

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
    fetch(STICKERS_API).then(r => r.json()).then(d => setStickers(d.stickers || {})).catch(() => {});
  }, []);

  useEffect(() => {
    loadPosts(activeTab);
    setSearchParams({ category: activeTab }, { replace: true });
  }, [activeTab]);

  useEffect(() => {
    if (paramCat && validIds.includes(paramCat) && !scrolledRef.current) {
      scrolledRef.current = true;
      setTimeout(() => {
        postsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, []);

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
              id={cat.id === "summer" ? "summer-blog" : undefined}
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
      <div ref={postsRef} className="max-w-3xl mx-auto px-4 py-8">
        {activeCat.subtitle && (
          <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 mb-6 flex items-start gap-3">
            <span className="text-2xl mt-0.5">{activeCat.emoji}</span>
            <p className="text-green-800 font-semibold text-sm leading-relaxed">{activeCat.subtitle}</p>
          </div>
        )}
        {activeTab === "summer" && (
          <ContactDropdown label="Забронировать смену летнего клуба" emoji="☀️" colorClass="bg-yellow-400 hover:bg-yellow-500" />
        )}
        {activeTab === "afterschool" && (
          <ContactDropdown label="Записаться в группу" emoji="📚" colorClass="bg-indigo-500 hover:bg-indigo-600" />
        )}
        {activeTab === "english" && (
          <ContactDropdown label="Записаться в группу английского" emoji="🇬🇧" colorClass="bg-sky-500 hover:bg-sky-600" />
        )}
        {activeTab === "plate" && <PlateChecklists />}
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
            {posts.map((post, idx) => (
              <PostCard key={post.id} post={post} categoryStickerText={idx === 0 ? stickers[post.category] : undefined} />
            ))}
          </div>
        )}
      </div>
      <SubscribeForm />
    </div>
  );
}
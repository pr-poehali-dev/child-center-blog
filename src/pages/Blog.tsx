import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { usePageMeta } from "@/hooks/usePageMeta";
import { BLOG_API, STICKERS_API, CATEGORIES, SEO_BY_CATEGORY, Post } from "./blog-types";
import { ContactDropdown, SubscribeForm } from "./BlogPostCard";
import BlogCompactCard from "./BlogCompactCard";
import BlogHero from "./BlogHero";
import BlogCategoryHeader, { getCategoryImage } from "./BlogCategoryHeader";
import BlogCategoryMedallions from "./BlogCategoryMedallions";
import PlateChecklists from "./PlateChecklists";
import BlogDirectionPicker from "@/components/BlogDirectionPicker";
import honeyStar from "@/assets/honey-star.png";

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
  const [categoryDescriptions, setCategoryDescriptions] = useState<Record<string, string>>({});

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
    fetch(STICKERS_API).then(r => r.json()).then(d => {
      setCategoryDescriptions(d.descriptions || {});
    }).catch(() => {});
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
    <div className="min-h-screen bg-[#FFF9F3] font-nunito text-gray-700">
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

        {/* MEDALLIONS */}
        <BlogCategoryMedallions
          activeTab={activeTab}
          onSelect={id => setActiveTab(id)}
          onQaClick={() => navigate("/blog/qa")}
        />
      </div>

      {/* HERO */}
      <BlogHero />

      {/* CONTENT */}
      <div ref={postsRef} className="max-w-5xl mx-auto px-4 py-4 md:py-6">
        <BlogCategoryHeader
          label={activeCat.label}
          image={getCategoryImage(activeTab)}
          description={categoryDescriptions[activeTab]}
        />
        {activeCat.subtitle && (
          <div className="rounded-2xl px-5 py-4 mb-6 flex items-start gap-3" style={{ background: "#FBF6EE" }}>
            <img src={honeyStar} alt="" className="w-6 h-6 mt-0.5 shrink-0" />
            <p className="font-golos font-semibold text-sm leading-relaxed" style={{ color: "#17364A" }}>{activeCat.subtitle}</p>
          </div>
        )}
        {activeTab === "summer" && (
          <ContactDropdown label="Забронировать смену летнего клуба" />
        )}
        {activeTab === "afterschool" && (
          <ContactDropdown label="Записаться в группу" />
        )}
        {activeTab === "english" && (
          <ContactDropdown label="Записаться в группу английского" />
        )}
        {activeTab === "plate" && <PlateChecklists />}
        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-300">
            <Icon name="Loader2" size={36} className="animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24">
            <img src={honeyStar} alt="" className="w-14 h-14 mx-auto mb-4 opacity-70" />
            <div className="font-black text-xl text-gray-400 mb-2">Пока пусто</div>
            <div className="text-gray-400 text-sm">Скоро здесь появятся записи в разделе «{activeCat.label}»</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {posts.map(post => (
              <BlogCompactCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <BlogDirectionPicker />
      </div>
      <SubscribeForm />
    </div>
  );
}
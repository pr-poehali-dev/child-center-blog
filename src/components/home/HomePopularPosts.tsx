import { useNavigate } from "react-router-dom";

const POPULAR_POSTS = [
  {
    id: 63, slug: "", title: "Лето-2026 в «Рыбке Долли»: больше 100 детей, море и мастер-классы",
    category: "summer", emoji: "☀️", tag: "bg-yellow-100 text-yellow-700", label: "Летний клуб",
    image: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/blog/2db05ee4-9993-4866-ad00-6a5448ca2dd2.jpg",
  },
  {
    id: 64, slug: "", title: "Продленка снова полная — и к нам вернулись пятиклассники",
    category: "afterschool", emoji: "📚", tag: "bg-indigo-100 text-indigo-700", label: "Продлёнка",
    image: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/blog/2a5c87bc-0351-4644-a938-d97b5793c709.jpg",
  },
  {
    id: 65, slug: "adaptaciya", title: "Ни одной лишней слёзки: как устроена адаптация в «Рыбке Долли»",
    category: "tips", emoji: "🎓", tag: "bg-amber-100 text-amber-700", label: "Советы от педагога",
    image: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/blog/86ee6be6-a75c-4eb6-a03e-ba8553e7bd0f.jpg",
  },
  {
    id: 66, slug: "ne-hochu-v-sadik", title: "«Не хочу в садик!» Что отвечать и как помочь ребёнку",
    category: "tips", emoji: "🎓", tag: "bg-amber-100 text-amber-700", label: "Советы от педагога",
    image: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/blog/e4e0c0ba-8e5a-40e2-be58-0cc79a205156.jpg",
  },
  {
    id: 61, slug: "", title: "Мамина забота в каждом дне: открываем набор в ясельную группу!",
    category: "tips", emoji: "🎓", tag: "bg-amber-100 text-amber-700", label: "Советы от педагога",
    image: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/blog/96236e00-be16-4f66-b38b-681f1e6f81ca.jpg",
  },
  {
    id: 67, slug: "morkovnye-maffiny-bgbk", title: "Морковные маффины без сахара (БГБК)",
    category: "plate", emoji: "🥗", tag: "bg-green-100 text-green-700", label: "Тарелка для всех",
    image: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/blog/8deb073f-943e-4ca0-88f9-e52979866f97.jpg",
  },
];

export default function HomePopularPosts() {
  const navigate = useNavigate();

  return (
    <section id="popular-posts" className="py-16 md:py-20" style={{ background: "linear-gradient(180deg, #FFF9F3 0%, #FFE9D8 100%)" }}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-center gap-4 mb-10">
          <img
            src="/dolli-mascot.png"
            alt="рыбка Долли"
            className="w-16 h-16 object-contain flex-shrink-0"
          />
          <div className="text-center">
            <div className="text-xs font-bold text-orange-500/80 tracking-widest uppercase mb-1">Читают чаще всего</div>
            <div className="text-3xl md:text-4xl font-black text-[#175064] leading-tight">Статьи в топе</div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {POPULAR_POSTS.map(post => (
            <div
              key={post.id}
              onClick={() => navigate(`/blog/${post.slug || post.id}`)}
              className="bg-white rounded-3xl overflow-hidden border border-orange-100 shadow-sm cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-3 ${post.tag}`}>
                  {post.emoji} {post.label}
                </span>
                <h3 className="font-black text-gray-800 text-base leading-snug line-clamp-3">{post.title}</h3>
                <div className="mt-3 text-orange-500 text-sm font-bold">Читать →</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

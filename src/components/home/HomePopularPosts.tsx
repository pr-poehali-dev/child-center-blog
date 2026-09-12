import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import WaveBackdrop from "./WaveBackdrop";
import BrushUnderline from "./BrushUnderline";

const POPULAR_POSTS = [
  {
    id: 63, slug: "", title: "Лето-2026 в «Рыбке Долли»: больше 100 детей, море и мастер-классы",
    category: "summer", emoji: "☀️", tag: "bg-yellow-100 text-yellow-700", label: "Летний клуб",
    date: "5 сентября", readMin: 4,
    image: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/blog/2db05ee4-9993-4866-ad00-6a5448ca2dd2.jpg",
  },
  {
    id: 64, slug: "", title: "Продленка снова полная — и к нам вернулись пятиклассники",
    category: "afterschool", emoji: "📚", tag: "bg-indigo-100 text-indigo-700", label: "Продлёнка",
    date: "5 сентября", readMin: 3,
    image: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/blog/2a5c87bc-0351-4644-a938-d97b5793c709.jpg",
  },
  {
    id: 65, slug: "adaptaciya", title: "Ни одной лишней слёзки: как устроена адаптация в «Рыбке Долли»",
    category: "tips", emoji: "🎓", tag: "bg-amber-100 text-amber-700", label: "Советы от педагога",
    date: "5 сентября", readMin: 4,
    image: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/blog/86ee6be6-a75c-4eb6-a03e-ba8553e7bd0f.jpg",
  },
  {
    id: 66, slug: "ne-hochu-v-sadik", title: "«Не хочу в садик!» Что отвечать и как помочь ребёнку",
    category: "tips", emoji: "🎓", tag: "bg-amber-100 text-amber-700", label: "Советы от педагога",
    date: "5 сентября", readMin: 3,
    image: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/blog/e4e0c0ba-8e5a-40e2-be58-0cc79a205156.jpg",
  },
  {
    id: 61, slug: "", title: "Мамина забота в каждом дне: открываем набор в ясельную группу!",
    category: "tips", emoji: "🎓", tag: "bg-amber-100 text-amber-700", label: "Советы от педагога",
    date: "22 июля", readMin: 2,
    image: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/blog/96236e00-be16-4f66-b38b-681f1e6f81ca.jpg",
  },
  {
    id: 67, slug: "morkovnye-maffiny-bgbk", title: "Морковные маффины без сахара (БГБК)",
    category: "plate", emoji: "🥗", tag: "bg-green-100 text-green-700", label: "Тарелка для всех",
    date: "5 сентября", readMin: 2,
    image: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/blog/8deb073f-943e-4ca0-88f9-e52979866f97.jpg",
  },
];

export default function HomePopularPosts() {
  const navigate = useNavigate();

  return (
    <section id="popular-posts" className="py-16 md:py-20" style={{ background: "linear-gradient(180deg, #FFF9F3 0%, #FFE9D8 100%)" }}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="relative pt-10 md:pt-6 pb-4 mb-10">
          <WaveBackdrop />
          <div className="relative flex flex-col md:flex-row items-center justify-center">
            <img
              src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/c8351246-5e4f-45ed-9378-057c6fa25623.png"
              alt="рыбка Долли"
              className="relative z-10 h-[110px] md:h-[190px] w-auto object-contain flex-shrink-0 md:mr-[-28px]"
            />
            <div className="relative z-20 text-center md:text-left">
              <div
                className="font-caveat text-2xl mb-1 lowercase inline-block"
                style={{ color: "#D9A441", transform: "rotate(-2deg)" }}
              >
                читают чаще всего
              </div>
              <div className="flex justify-center md:justify-start">
                <h2
                  className="relative inline-block font-playfair font-extrabold leading-tight text-4xl md:text-[54px]"
                  style={{ color: "#17364A" }}
                >
                  Статьи в топе
                  <BrushUnderline />
                </h2>
              </div>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
          {POPULAR_POSTS.map(post => (
            <div
              key={post.id}
              onClick={() => navigate(`/blog/${post.slug || post.id}`)}
              className="bg-white rounded-2xl overflow-hidden border border-orange-100 shadow-sm cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 w-full max-w-[360px]"
            >
              <div className="aspect-[16/9] overflow-hidden">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-2 ${post.tag}`}>
                  {post.emoji} {post.label}
                </span>
                <h3 className="font-black text-gray-800 text-sm leading-snug line-clamp-2 mb-2 min-h-[2.5em]">{post.title}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Icon name="Clock" size={12} />
                    {post.readMin} мин чтения
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/blog")}
            className="inline-flex items-center gap-2 bg-white hover:bg-orange-50 border-2 border-orange-200 text-orange-500 font-bold px-8 py-3 rounded-full text-base transition-all"
          >
            Все статьи
            <Icon name="ArrowRight" size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
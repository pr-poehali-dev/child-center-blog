import Icon from "@/components/ui/icon";
import { CATEGORIES, Post } from "./blog-types";

function getFirstSentence(text: string): string {
  const match = text.trim().match(/^.*?[.!?…](?=\s|$)/);
  const sentence = match ? match[0] : text.trim();
  return sentence.length > 140 ? sentence.slice(0, 140).trim() + "…" : sentence;
}

function getReadMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 150));
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
}

export default function BlogCompactCard({ post }: { post: Post }) {
  const cat = CATEGORIES.find(c => c.id === post.category);
  const image = post.media?.find(m => m.type === "image")?.url;
  const firstSentence = getFirstSentence(post.content || "");
  const readMin = getReadMinutes(post.content || "");

  return (
    <a
      href={`/blog/${post.slug || post.id}`}
      className="block bg-white rounded-2xl overflow-hidden shadow-[0_4px_10px_rgba(23,54,74,0.08),0_10px_28px_rgba(23,54,74,0.08)] hover:shadow-[0_6px_16px_rgba(23,54,74,0.12),0_16px_36px_rgba(23,54,74,0.14)] transition-all hover:-translate-y-1 w-full"
    >
      {image && (
        <div className="aspect-[21/9] overflow-hidden">
          <img src={image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-5">
        <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-2 ${cat?.tag || "bg-gray-100 text-gray-500"}`}>
          {cat?.label}
        </span>
        <h3 className="font-black text-gray-800 text-base leading-snug mb-1.5 line-clamp-2 min-h-[2.6em]">{post.title}</h3>
        {firstSentence && (
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3">{firstSentence}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{formatDate(post.created_at)}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Icon name="Clock" size={12} />
            {readMin} мин чтения
          </span>
        </div>
      </div>
    </a>
  );
}
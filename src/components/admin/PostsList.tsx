import { useState } from "react";
import Icon from "@/components/ui/icon";
import { BLOG_CATEGORIES, Post } from "./constants";

interface PostsListProps {
  posts: Post[];
  loading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  deleting: number | null;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
}

export default function PostsList({
  posts, loading, activeTab, setActiveTab, deleting, onEdit, onDelete,
}: PostsListProps) {
  const [copied, setCopied] = useState<number | null>(null);

  const copyLink = (postId: number) => {
    const url = `${window.location.origin}/blog/${postId}`;
    navigator.clipboard.writeText(url);
    setCopied(postId);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* TABS */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {BLOG_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${
              activeTab === cat.id
                ? "bg-orange-400 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-500"
            }`}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* LIST */}
      {loading ? (
        <div className="text-center py-16 text-gray-300">
          <Icon name="Loader2" size={32} className="animate-spin mx-auto" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-orange-100">
          <div className="text-4xl mb-3">📭</div>
          <div className="font-black text-gray-500 mb-1">Постов пока нет</div>
          <div className="text-gray-400 text-sm">Нажмите «Добавить пост» чтобы создать первый</div>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl border border-orange-100 p-5 hover:shadow-sm transition-all">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-black text-gray-800 text-sm mb-1 leading-snug">{post.title}</div>
                  {post.content && (
                    <div className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-2">{post.content}</div>
                  )}
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs text-gray-400">{formatDate(post.created_at)}</span>
                    {post.media?.length > 0 && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Icon name="Image" size={12} />
                        {post.media.length}
                      </span>
                    )}
                    {(post.teacher_photo || post.teacher_name) && (
                      <span className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
                        {post.teacher_photo ? (
                          <img src={post.teacher_photo} alt="" className="w-4 h-4 rounded-full object-cover" />
                        ) : (
                          <Icon name="UserRound" size={12} />
                        )}
                        {post.teacher_name || "Автор"}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => copyLink(post.id)}
                    className={`transition-colors ${copied === post.id ? "text-green-500" : "text-gray-300 hover:text-blue-400"}`}
                    title="Скопировать ссылку для рекламы"
                  >
                    <Icon name={copied === post.id ? "Check" : "Link"} size={16} />
                  </button>
                  <button
                    onClick={() => onEdit(post)}
                    className="text-gray-300 hover:text-orange-400 transition-colors"
                    title="Редактировать"
                  >
                    <Icon name="Pencil" size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(post.id)}
                    disabled={deleting === post.id}
                    className="text-gray-300 hover:text-red-400 transition-colors disabled:opacity-50"
                    title="Удалить"
                  >
                    <Icon name={deleting === post.id ? "Loader2" : "Trash2"} size={18} className={deleting === post.id ? "animate-spin" : ""} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
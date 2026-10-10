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
  onPublish: (post: Post) => void;
  publishing: number | null;
}

export default function PostsList({
  posts, loading, activeTab, setActiveTab, deleting, onEdit, onDelete, onPublish, publishing,
}: PostsListProps) {
  const [copied, setCopied] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");

  const visiblePosts = posts.filter(p => {
    if (statusFilter === "draft") return p.status === "draft";
    if (statusFilter === "published") return p.status !== "draft";
    return true;
  });

  const copyLink = (postId: number, isDraft: boolean) => {
    const url = isDraft
      ? `${window.location.origin}/admin?post=${postId}`
      : `${window.location.origin}/blog/${postId}`;
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

      {/* STATUS FILTER */}
      <div className="flex gap-2 mb-5">
        {([
          { key: "all", label: "Все" },
          { key: "published", label: "Опубликованные" },
          { key: "draft", label: "Черновики" },
        ] as const).map(f => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              statusFilter === f.key
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {f.label}
            {f.key === "draft" && posts.some(p => p.status === "draft") && (
              <span className="ml-1.5 bg-orange-400 text-white rounded-full px-1.5 py-0.5 text-[10px]">
                {posts.filter(p => p.status === "draft").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* LIST */}
      {loading ? (
        <div className="text-center py-16 text-gray-300">
          <Icon name="Loader2" size={32} className="animate-spin mx-auto" />
        </div>
      ) : visiblePosts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-orange-100">
          <div className="text-4xl mb-3">📭</div>
          <div className="font-black text-gray-500 mb-1">
            {posts.length === 0 ? "Постов пока нет" : "В этом фильтре постов нет"}
          </div>
          <div className="text-gray-400 text-sm">
            {posts.length === 0 ? "Нажмите «Добавить пост» чтобы создать первый" : "Выберите другой фильтр"}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {visiblePosts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl border border-orange-100 p-5 hover:shadow-sm transition-all">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-black text-gray-800 text-sm mb-1 leading-snug">
                    {post.status === "draft" && (
                      <span className="inline-block mr-2 align-middle text-[11px] font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">Черновик</span>
                    )}
                    {post.title}
                  </div>
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
                  {post.status === "draft" && (
                    <button
                      onClick={() => onPublish(post)}
                      disabled={publishing === post.id}
                      className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors"
                    >
                      <Icon name={publishing === post.id ? "Loader2" : "Send"} size={13} className={publishing === post.id ? "animate-spin" : ""} />
                      Опубликовать
                    </button>
                  )}
                  <button
                    onClick={() => copyLink(post.id, post.status === "draft")}
                    className={`transition-colors ${copied === post.id ? "text-green-500" : "text-gray-300 hover:text-blue-400"}`}
                    title={post.status === "draft" ? "Скопировать ссылку на черновик в админке" : "Скопировать ссылку для рекламы"}
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
import { useEffect, useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import { BLOG_API, BLOG_CATEGORIES, TOKEN_KEY, Post, MediaItem } from "./constants";

const EMOJIS = ["😊","🌟","🎉","❤️","👏","🥳","🌈","🎈","🌺","🦋","🌸","✨","🎀","🍀","🌞","🎁","🐥","🦄","🌻","💫","🐾","🎶","🍓","🧡","💛","💚","💙","💜","🌙","⭐"];

export default function BlogManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tips");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: "tips", title: "", content: "" });
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [emojiTarget, setEmojiTarget] = useState<"title" | "content">("content");
  const [teacherPhoto, setTeacherPhoto] = useState<string>("");
  const [teacherName, setTeacherName] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);
  const teacherPhotoRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const insertEmoji = (emoji: string) => {
    const field = emojiTarget;
    const ref = field === "title" ? titleRef : contentRef;
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const newVal = el.value.slice(0, start) + emoji + el.value.slice(end);
    setForm(f => ({ ...f, [field]: newVal }));
    setTimeout(() => { el.focus(); el.setSelectionRange(start + emoji.length, start + emoji.length); }, 0);
  };

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

  useEffect(() => { loadPosts(activeTab); }, [activeTab]);

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        const type = file.type.startsWith("video") ? "video" : "image";
        setMediaItems(prev => [...prev, { type, url }]);
      };
      reader.readAsDataURL(file);
    });
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeMedia = (i: number) => {
    setMediaItems(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      await fetch(BLOG_API, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": localStorage.getItem(TOKEN_KEY) || "" },
        body: JSON.stringify({ ...form, media: mediaItems, teacher_photo: teacherPhoto, teacher_name: teacherName }),
      });
      setShowForm(false);
      setForm({ category: "tips", title: "", content: "" });
      setMediaItems([]);
      setTeacherPhoto("");
      setTeacherName("");
      if (activeTab === form.category) {
        loadPosts(activeTab);
      } else {
        setActiveTab(form.category);
      }
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async (id: number) => {
    if (!confirm("Удалить этот пост?")) return;
    setDeleting(id);
    await fetch(BLOG_API, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "Authorization": localStorage.getItem(TOKEN_KEY) || "" },
      body: JSON.stringify({ id }),
    });
    setPosts(prev => prev.filter(p => p.id !== id));
    setDeleting(null);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-black text-xl text-gray-800">Управление блогом</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-orange-400 hover:bg-orange-500 text-white font-bold px-5 py-2.5 rounded-2xl transition-colors text-sm"
        >
          <Icon name={showForm ? "X" : "Plus"} size={16} />
          {showForm ? "Отмена" : "Добавить пост"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-white rounded-3xl border border-orange-100 p-6 mb-6 shadow-sm">
          <h3 className="font-black text-gray-800 mb-5">Новый пост</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1.5 block">Раздел</label>
              <div className="flex flex-wrap gap-2">
                {BLOG_CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, category: cat.id }))}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                      form.category === cat.id
                        ? "bg-orange-400 text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-500"
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1.5 block">Заголовок</label>
              <div className="relative">
                <input
                  ref={titleRef}
                  required
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 pr-11 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  placeholder="О чём этот пост?"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                />
                <button type="button" onClick={() => { setEmojiTarget("title"); setShowEmoji(v => emojiTarget === "title" ? !v : true); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-xl hover:scale-110 transition-transform">😊</button>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1.5 block">Текст (необязательно)</label>
              <div className="relative">
                <textarea
                  ref={contentRef}
                  rows={5}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 pr-11 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none"
                  placeholder="Напишите подробнее..."
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                />
                <button type="button" onClick={() => { setEmojiTarget("content"); setShowEmoji(v => emojiTarget === "content" ? !v : true); }} className="absolute right-3 top-3 text-xl hover:scale-110 transition-transform">😊</button>
              </div>
            </div>
            {showEmoji && (
              <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-md">
                <div className="flex flex-wrap gap-1.5">
                  {EMOJIS.map(e => (
                    <button key={e} type="button" onClick={() => insertEmoji(e)} className="text-2xl hover:scale-125 transition-transform leading-none">{e}</button>
                  ))}
                </div>
              </div>
            )}

            {/* TEACHER PHOTO — only for tips */}
            {form.category === "tips" && (
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1.5 block">Фото педагога (необязательно)</label>
                <div className="flex items-center gap-4">
                  {teacherPhoto ? (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-orange-300 shrink-0">
                      <img src={teacherPhoto} className="w-full h-full object-cover" alt="Педагог" />
                      <button type="button" onClick={() => setTeacherPhoto("")} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Icon name="X" size={16} className="text-white" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => teacherPhotoRef.current?.click()}
                      className="w-16 h-16 rounded-full border-2 border-dashed border-orange-200 hover:border-orange-400 flex items-center justify-center text-orange-300 hover:text-orange-400 transition-colors shrink-0"
                    >
                      <Icon name="UserRound" size={22} />
                    </button>
                  )}
                  <div className="flex-1">
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    placeholder="Имя педагога (необязательно)"
                    value={teacherName}
                    onChange={e => setTeacherName(e.target.value)}
                  />
                  <p className="text-xs text-gray-400 mt-1">Появится под фото педагога в посте</p>
                </div>
                </div>
                <input
                  ref={teacherPhotoRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = ev => setTeacherPhoto(ev.target?.result as string);
                    reader.readAsDataURL(file);
                    if (teacherPhotoRef.current) teacherPhotoRef.current.value = "";
                  }}
                />
              </div>
            )}

            {/* MEDIA */}
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1.5 block">Фото и видео</label>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 border-2 border-dashed border-orange-200 hover:border-orange-400 text-orange-400 hover:text-orange-500 rounded-2xl px-5 py-3 text-sm font-semibold transition-colors"
              >
                <Icon name="ImagePlus" size={18} />
                Добавить фото или видео
              </button>
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileAdd}
              />
              {mediaItems.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {mediaItems.map((m, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 group">
                      {m.type === "video" ? (
                        <video src={m.url} className="w-full h-full object-cover" muted />
                      ) : (
                        <img src={m.url} alt="" className="w-full h-full object-cover" />
                      )}
                      <button
                        type="button"
                        onClick={() => removeMedia(i)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Icon name="X" size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-orange-400 hover:bg-orange-500 disabled:opacity-60 text-white font-black py-3.5 rounded-2xl transition-colors"
            >
              {saving ? "Сохраняем..." : "Опубликовать пост"}
            </button>
          </form>
        </div>
      )}

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

      {/* POSTS LIST */}
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
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{formatDate(post.created_at)}</span>
                    {post.media?.length > 0 && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Icon name="Image" size={12} />
                        {post.media.length}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => deletePost(post.id)}
                  disabled={deleting === post.id}
                  className="shrink-0 text-gray-300 hover:text-red-400 transition-colors disabled:opacity-50"
                >
                  <Icon name={deleting === post.id ? "Loader2" : "Trash2"} size={18} className={deleting === post.id ? "animate-spin" : ""} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
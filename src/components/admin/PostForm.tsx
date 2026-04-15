import { useRef } from "react";
import Icon from "@/components/ui/icon";
import StickerTag from "@/components/ui/sticker-tag";
import { BLOG_CATEGORIES, MediaItem } from "./constants";

const EMOJIS = ["😊","🌟","🎉","❤️","👏","🥳","🌈","🎈","🌺","🦋","🌸","✨","🎀","🍀","🌞","🎁","🐥","🦄","🌻","💫","🐾","🎶","🍓","🧡","💛","💚","💙","💜","🌙","⭐"];

interface PostFormProps {
  form: { category: string; title: string; content: string };
  setForm: React.Dispatch<React.SetStateAction<{ category: string; title: string; content: string }>>;
  mediaItems: MediaItem[];
  setMediaItems: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  teacherPhoto: string;
  setTeacherPhoto: (v: string) => void;
  teacherName: string;
  setTeacherName: (v: string) => void;
  videoUrl: string;
  setVideoUrl: (v: string) => void;
  postSticker: string;
  setPostSticker: (v: string) => void;
  showEmoji: boolean;
  setShowEmoji: React.Dispatch<React.SetStateAction<boolean>>;
  emojiTarget: "title" | "content";
  setEmojiTarget: (v: "title" | "content") => void;
  uploadingMedia: boolean;
  saving: boolean;
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  compressImage: (dataUrl: string, maxSize?: number) => Promise<string>;
  uploadToS3: (dataUrl: string, fileName?: string) => Promise<string>;
  setUploadingMedia: (v: boolean) => void;
}

export default function PostForm({
  form, setForm,
  mediaItems, setMediaItems,
  teacherPhoto, setTeacherPhoto,
  teacherName, setTeacherName,
  videoUrl, setVideoUrl,
  postSticker, setPostSticker,
  showEmoji, setShowEmoji,
  emojiTarget, setEmojiTarget,
  uploadingMedia, saving,
  isEditing,
  onSubmit,
  compressImage, uploadToS3, setUploadingMedia,
}: PostFormProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const docRef = useRef<HTMLInputElement>(null);
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

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (fileRef.current) fileRef.current.value = "";
    if (!files.length) return;
    files.forEach(file => {
      setUploadingMedia(true);
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const dataUrl = ev.target?.result as string;
          const prepared = await compressImage(dataUrl);
          const cdnUrl = await uploadToS3(prepared);
          setMediaItems(prev => [...prev, { type: "image", url: cdnUrl }]);
        } finally {
          setUploadingMedia(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDocAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (docRef.current) docRef.current.value = "";
    if (!files.length) return;
    files.forEach(file => {
      setUploadingMedia(true);
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const dataUrl = ev.target?.result as string;
          const cdnUrl = await uploadToS3(dataUrl, file.name);
          setMediaItems(prev => [...prev, { type: "document", url: cdnUrl, name: file.name }]);
        } finally {
          setUploadingMedia(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (i: number) => {
    setMediaItems(prev => prev.filter((_, idx) => idx !== i));
  };

  return (
    <div className="bg-white rounded-3xl border border-orange-100 p-6 mb-6 shadow-sm">
      <h3 className="font-black text-gray-800 mb-5">{isEditing ? "Редактировать пост" : "Новый пост"}</h3>
      <form onSubmit={onSubmit} className="space-y-4">
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

        {/* AUTHOR */}
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1.5 block">Автор (необязательно)</label>
          <div className="flex items-center gap-4">
            {teacherPhoto ? (
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-orange-300 shrink-0">
                <img src={teacherPhoto} className="w-full h-full object-cover" alt="Автор" />
                <button type="button" onClick={() => setTeacherPhoto("")} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Icon name="X" size={20} className="text-white" />
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
                placeholder="Имя автора (необязательно)"
                value={teacherName}
                onChange={e => setTeacherName(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">Фото и имя появятся рядом с текстом поста</p>
            </div>
          </div>
          <input
            ref={teacherPhotoRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async e => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = async ev => {
                const compressed = await compressImage(ev.target?.result as string, 400);
                const cdnUrl = await uploadToS3(compressed);
                setTeacherPhoto(cdnUrl);
              };
              reader.readAsDataURL(file);
              if (teacherPhotoRef.current) teacherPhotoRef.current.value = "";
            }}
          />
        </div>

        {/* MEDIA */}
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1.5 block">Фото</label>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploadingMedia}
            className="flex items-center gap-2 border-2 border-dashed border-orange-200 hover:border-orange-400 text-orange-400 hover:text-orange-500 rounded-2xl px-5 py-3 text-sm font-semibold transition-colors disabled:opacity-60"
          >
            <Icon name={uploadingMedia ? "Loader2" : "ImagePlus"} size={18} className={uploadingMedia ? "animate-spin" : ""} />
            {uploadingMedia ? "Загружаем..." : "Добавить фото"}
          </button>
          <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileAdd} />
          {mediaItems.filter(m => m.type === "image").length > 0 && (
            <div className="flex flex-col gap-3 mt-3">
              {mediaItems.map((m, i) => m.type === "image" && (
                <div key={i} className="flex gap-3 items-start bg-orange-50 border border-orange-100 rounded-2xl p-3">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 group shrink-0">
                    <img src={m.url} alt={m.alt || ""} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeMedia(i)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <input
                      type="text"
                      placeholder="Alt-текст: что изображено + для кого + ключ (для SEO)"
                      value={m.alt || ""}
                      onChange={e => setMediaItems(prev => prev.map((item, idx) => idx === i ? { ...item, alt: e.target.value } : item))}
                      className="w-full border border-orange-200 bg-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-400"
                    />
                    <input
                      type="text"
                      placeholder="Подпись под фото (необязательно)"
                      value={m.caption || ""}
                      onChange={e => setMediaItems(prev => prev.map((item, idx) => idx === i ? { ...item, caption: e.target.value } : item))}
                      className="w-full border border-orange-200 bg-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DOCUMENTS */}
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1.5 block">Документы (PDF, Word)</label>
          <button
            type="button"
            onClick={() => docRef.current?.click()}
            disabled={uploadingMedia}
            className="flex items-center gap-2 border-2 border-dashed border-blue-200 hover:border-blue-400 text-blue-400 hover:text-blue-500 rounded-2xl px-5 py-3 text-sm font-semibold transition-colors disabled:opacity-60"
          >
            <Icon name={uploadingMedia ? "Loader2" : "Paperclip"} size={18} className={uploadingMedia ? "animate-spin" : ""} />
            {uploadingMedia ? "Загружаем..." : "Прикрепить документ"}
          </button>
          <input
            ref={docRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={handleDocAdd}
          />
          {mediaItems.filter(m => m.type === "document").length > 0 && (
            <div className="flex flex-col gap-2 mt-3">
              {mediaItems.map((m, i) => m.type === "document" && (
                <div key={i} className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-2.5">
                  <Icon name="FileText" size={18} className="text-blue-400 shrink-0" />
                  <span className="text-sm text-blue-700 font-semibold truncate flex-1">{m.name || "Документ"}</span>
                  <button type="button" onClick={() => removeMedia(i)} className="text-gray-400 hover:text-red-500 transition-colors shrink-0">
                    <Icon name="X" size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* VIDEO URL */}
        <div>
          <label className="text-xs font-bold text-gray-500 mb-1.5 block">Видео (необязательно)</label>
          <div className="relative">
            <input
              type="url"
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 pl-11 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              placeholder="Вставьте ссылку на видео из хранилища..."
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
            />
            <Icon name="Video" size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            {videoUrl && (
              <button type="button" onClick={() => setVideoUrl("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <Icon name="X" size={16} />
              </button>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1.5">Загрузите видео в Ядро → Хранилище, скопируйте ссылку и вставьте сюда</p>
          {videoUrl && (
            <video src={videoUrl} controls className="mt-3 w-full rounded-2xl max-h-48 bg-black" />
          )}
        </div>

        {/* STICKER */}
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
          <label className="text-xs font-bold text-gray-500 mb-1.5 block flex items-center gap-1.5">
            <span>🏷️</span> Стикер к посту (необязательно)
          </label>
          <input
            type="text"
            maxLength={60}
            value={postSticker}
            onChange={e => setPostSticker(e.target.value)}
            placeholder="Например: «Внутри приятный бонус!»"
            className="w-full border border-orange-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
          <p className="text-xs text-gray-400 mt-1.5">Стикер виден на карточке поста в блоге — бросается в глаза</p>
          {postSticker.trim() && (
            <div className="mt-3">
              <p className="text-xs text-gray-400 mb-2">Предпросмотр:</p>
              <StickerTag text={postSticker.trim()} />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={saving || uploadingMedia}
          className="w-full bg-orange-400 hover:bg-orange-500 disabled:opacity-60 text-white font-black py-3.5 rounded-2xl transition-colors"
        >
          {saving ? "Сохраняем..." : isEditing ? "Сохранить изменения" : "Опубликовать пост"}
        </button>
      </form>
    </div>
  );
}
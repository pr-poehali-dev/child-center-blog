import { useRef } from "react";
import { MediaItem } from "./constants";
import CategoryPicker from "./CategoryPicker";
import RecipeFields from "./RecipeFields";
import PostMediaFields from "./PostMediaFields";
import PostExtrasFields from "./PostExtrasFields";

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
  checklistUrl: string;
  setChecklistUrl: (v: string) => void;
  ctaText: string;
  setCtaText: (v: string) => void;
  ctaUrl: string;
  setCtaUrl: (v: string) => void;
  recipeTime: string;
  setRecipeTime: (v: string) => void;
  recipeServings: string;
  setRecipeServings: (v: string) => void;
  recipeCalories: string;
  setRecipeCalories: (v: string) => void;
  recipeProteins: string;
  setRecipeProteins: (v: string) => void;
  recipeFats: string;
  setRecipeFats: (v: string) => void;
  recipeCarbs: string;
  setRecipeCarbs: (v: string) => void;
  recipeIngredients: string;
  setRecipeIngredients: (v: string) => void;
  recipeSteps: string;
  setRecipeSteps: (v: string) => void;
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
  checklistUrl, setChecklistUrl,
  ctaText, setCtaText,
  ctaUrl, setCtaUrl,
  recipeTime, setRecipeTime,
  recipeServings, setRecipeServings,
  recipeCalories, setRecipeCalories,
  recipeProteins, setRecipeProteins,
  recipeFats, setRecipeFats,
  recipeCarbs, setRecipeCarbs,
  recipeIngredients, setRecipeIngredients,
  recipeSteps, setRecipeSteps,
  showEmoji, setShowEmoji,
  emojiTarget, setEmojiTarget,
  uploadingMedia, saving,
  isEditing,
  onSubmit,
  compressImage, uploadToS3, setUploadingMedia,
}: PostFormProps) {
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

  return (
    <div className="bg-white rounded-3xl border border-orange-100 p-6 mb-6 shadow-sm">
      <h3 className="font-black text-gray-800 mb-5">{isEditing ? "Редактировать пост" : "Новый пост"}</h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <CategoryPicker value={form.category} onChange={cat => setForm(f => ({ ...f, category: cat }))} />

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

        {/* RECIPE FIELDS — только для категории "Тарелка для всех" */}
        {form.category === "plate" && (
          <RecipeFields
            recipeTime={recipeTime} setRecipeTime={setRecipeTime}
            recipeServings={recipeServings} setRecipeServings={setRecipeServings}
            recipeCalories={recipeCalories} setRecipeCalories={setRecipeCalories}
            recipeProteins={recipeProteins} setRecipeProteins={setRecipeProteins}
            recipeFats={recipeFats} setRecipeFats={setRecipeFats}
            recipeCarbs={recipeCarbs} setRecipeCarbs={setRecipeCarbs}
            recipeIngredients={recipeIngredients} setRecipeIngredients={setRecipeIngredients}
            recipeSteps={recipeSteps} setRecipeSteps={setRecipeSteps}
          />
        )}

        <PostMediaFields
          teacherPhoto={teacherPhoto} setTeacherPhoto={setTeacherPhoto}
          teacherName={teacherName} setTeacherName={setTeacherName}
          mediaItems={mediaItems} setMediaItems={setMediaItems}
          videoUrl={videoUrl} setVideoUrl={setVideoUrl}
          uploadingMedia={uploadingMedia} setUploadingMedia={setUploadingMedia}
          compressImage={compressImage} uploadToS3={uploadToS3}
        />

        <PostExtrasFields
          postSticker={postSticker} setPostSticker={setPostSticker}
          checklistUrl={checklistUrl} setChecklistUrl={setChecklistUrl}
          ctaText={ctaText} setCtaText={setCtaText}
          ctaUrl={ctaUrl} setCtaUrl={setCtaUrl}
        />

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

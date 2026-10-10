import { useEffect, useRef, useState } from "react";
import { UPLOAD_API, TOKEN_KEY, Post, MediaItem } from "./constants";

const DRAFT_KEY = "blog_post_draft";

interface Draft {
  form: { category: string; title: string; content: string };
  mediaItems: MediaItem[];
  teacherPhoto: string; teacherName: string; videoUrl: string; postSticker: string;
  checklistUrl: string; ctaText: string; ctaUrl: string;
  recipeTime: string; recipeServings: string; recipeCalories: string; recipeProteins: string;
  recipeFats: string; recipeCarbs: string; recipeIngredients: string; recipeSteps: string;
  slug: string; seoTitle: string; seoDescription: string;
}

export default function useBlogPostForm() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: "tips", title: "", content: "" });
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [emojiTarget, setEmojiTarget] = useState<"title" | "content">("content");
  const [teacherPhoto, setTeacherPhoto] = useState<string>("");
  const [teacherName, setTeacherName] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [postSticker, setPostSticker] = useState<string>("");
  const [checklistUrl, setChecklistUrl] = useState<string>("");
  const [ctaText, setCtaText] = useState<string>("");
  const [ctaUrl, setCtaUrl] = useState<string>("");
  const [recipeTime, setRecipeTime] = useState<string>("");
  const [recipeServings, setRecipeServings] = useState<string>("");
  const [recipeCalories, setRecipeCalories] = useState<string>("");
  const [recipeProteins, setRecipeProteins] = useState<string>("");
  const [recipeFats, setRecipeFats] = useState<string>("");
  const [recipeCarbs, setRecipeCarbs] = useState<string>("");
  const [recipeIngredients, setRecipeIngredients] = useState<string>("");
  const [recipeSteps, setRecipeSteps] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [seoTitle, setSeoTitle] = useState<string>("");
  const [seoDescription, setSeoDescription] = useState<string>("");
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);
  const draftLoadedRef = useRef(false);

  // Восстановление черновика поста при открытии (например, после случайной перезагрузки страницы)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d: Draft = JSON.parse(raw);
        if (d.form && (d.form.title || d.form.content)) {
          setForm(d.form);
          setMediaItems(d.mediaItems || []);
          setTeacherPhoto(d.teacherPhoto || "");
          setTeacherName(d.teacherName || "");
          setVideoUrl(d.videoUrl || "");
          setPostSticker(d.postSticker || "");
          setChecklistUrl(d.checklistUrl || "");
          setCtaText(d.ctaText || "");
          setCtaUrl(d.ctaUrl || "");
          setRecipeTime(d.recipeTime || "");
          setRecipeServings(d.recipeServings || "");
          setRecipeCalories(d.recipeCalories || "");
          setRecipeProteins(d.recipeProteins || "");
          setRecipeFats(d.recipeFats || "");
          setRecipeCarbs(d.recipeCarbs || "");
          setRecipeIngredients(d.recipeIngredients || "");
          setRecipeSteps(d.recipeSteps || "");
          setSlug(d.slug || "");
          setSeoTitle(d.seoTitle || "");
          setSeoDescription(d.seoDescription || "");
          setShowForm(true);
          setDraftRestored(true);
        }
      }
    } catch {
      /* ignore corrupted draft */
    } finally {
      draftLoadedRef.current = true;
    }
  }, []);

  // Автосохранение черновика поста, чтобы текст не терялся при случайной перезагрузке страницы
  useEffect(() => {
    if (!draftLoadedRef.current) return;
    if (!showForm) return;
    const draft: Draft = {
      form, mediaItems, teacherPhoto, teacherName, videoUrl, postSticker,
      checklistUrl, ctaText, ctaUrl, recipeTime, recipeServings,
      recipeCalories, recipeProteins, recipeFats, recipeCarbs,
      recipeIngredients, recipeSteps, slug, seoTitle, seoDescription,
    };
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* localStorage может быть недоступен (приватный режим) — черновик просто не сохранится */
    }
  }, [showForm, form, mediaItems, teacherPhoto, teacherName, videoUrl, postSticker, checklistUrl, ctaText, ctaUrl, recipeTime, recipeServings, recipeCalories, recipeProteins, recipeFats, recipeCarbs, recipeIngredients, recipeSteps, slug, seoTitle, seoDescription]);

  // Предупреждение при попытке закрыть/обновить вкладку, пока есть незаконченный черновик статьи.
  // Черновик всё равно не потеряется (он уже в localStorage), но предупреждение подстрахует
  // от случайного закрытия, если пользователь ждёт публикации.
  useEffect(() => {
    const hasDraft = showForm && (form.title.trim() || form.content.trim());
    if (!hasDraft) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [showForm, form.title, form.content]);

  const clearDraft = () => {
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
    setDraftRestored(false);
  };

  const compressImage = (dataUrl: string, maxSize = 900): Promise<string> => {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          if (width > height) { height = Math.round(height * maxSize / width); width = maxSize; }
          else { width = Math.round(width * maxSize / height); height = maxSize; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.src = dataUrl;
    });
  };

  const uploadToS3 = async (dataUrl: string, fileName?: string): Promise<string> => {
    const res = await fetch(UPLOAD_API, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Authorization": localStorage.getItem(TOKEN_KEY) || "" },
      body: JSON.stringify({ data_url: dataUrl, file_name: fileName }),
    });
    const data = await res.json();
    return data.url;
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingPost(null);
    setForm({ category: "tips", title: "", content: "" });
    setMediaItems([]);
    setTeacherPhoto("");
    setTeacherName("");
    setVideoUrl("");
    setPostSticker("");
    setChecklistUrl("");
    setCtaText("");
    setCtaUrl("");
    setRecipeTime("");
    setRecipeServings("");
    setRecipeCalories("");
    setRecipeProteins("");
    setRecipeFats("");
    setRecipeCarbs("");
    setRecipeIngredients("");
    setRecipeSteps("");
    setSlug("");
    setSeoTitle("");
    setSeoDescription("");
    setShowEmoji(false);
    clearDraft();
  };

  const startEdit = (post: Post) => {
    const videoItem = post.media?.find(m => m.type === "video");
    const imageItems = (post.media || []).filter(m => m.type === "image" || m.type === "document");
    clearDraft();
    setEditingPost(post);
    setForm({ category: post.category, title: post.title, content: post.content });
    setMediaItems(imageItems);
    setTeacherPhoto(post.teacher_photo || "");
    setTeacherName(post.teacher_name || "");
    setVideoUrl(videoItem?.url || "");
    setPostSticker(post.sticker || "");
    setChecklistUrl(post.checklist_url || "");
    setCtaText(post.cta_text || "");
    setCtaUrl(post.cta_url || "");
    setRecipeTime(post.recipe_time || "");
    setRecipeServings(post.recipe_servings || "");
    setRecipeCalories(post.recipe_calories || "");
    setRecipeProteins(post.recipe_proteins || "");
    setRecipeFats(post.recipe_fats || "");
    setRecipeCarbs(post.recipe_carbs || "");
    setRecipeIngredients(post.recipe_ingredients || "");
    setRecipeSteps(post.recipe_steps || "");
    setSlug(post.slug || "");
    setSeoTitle(post.seo_title || "");
    setSeoDescription(post.seo_description || "");
    setShowForm(true);
    setShowEmoji(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    showForm, setShowForm,
    form, setForm,
    mediaItems, setMediaItems,
    uploadingMedia, setUploadingMedia,
    saving, setSaving,
    showEmoji, setShowEmoji,
    emojiTarget, setEmojiTarget,
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
    slug, setSlug,
    seoTitle, setSeoTitle,
    seoDescription, setSeoDescription,
    editingPost,
    draftRestored, setDraftRestored,
    resetForm, startEdit,
    compressImage, uploadToS3,
  };
}

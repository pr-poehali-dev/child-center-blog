import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";
import { BLOG_API, UPLOAD_API, TOKEN_KEY, STICKERS_API, Post, MediaItem } from "./constants";
import PostForm from "./PostForm";
import PostsList from "./PostsList";
import StickersPanel from "./StickersPanel";

const DRAFT_KEY = "blog_post_draft";

interface Draft {
  form: { category: string; title: string; content: string };
  mediaItems: MediaItem[];
  teacherPhoto: string; teacherName: string; videoUrl: string; postSticker: string;
  checklistUrl: string; ctaText: string; ctaUrl: string;
  recipeTime: string; recipeServings: string; recipeCalories: string; recipeProteins: string;
  recipeFats: string; recipeCarbs: string; recipeIngredients: string; recipeSteps: string;
}

export default function BlogManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tips");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: "tips", title: "", content: "" });
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
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
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [managerTab, setManagerTab] = useState<"posts" | "stickers">("posts");
  const [stickers, setStickers] = useState<Record<string, string>>({});
  const [stickerEdits, setStickerEdits] = useState<Record<string, string>>({});
  const [savingSticker, setSavingSticker] = useState<string | null>(null);
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
      recipeIngredients, recipeSteps,
    };
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* localStorage может быть недоступен (приватный режим) — черновик просто не сохранится */
    }
  }, [showForm, form, mediaItems, teacherPhoto, teacherName, videoUrl, postSticker, checklistUrl, ctaText, ctaUrl, recipeTime, recipeServings, recipeCalories, recipeProteins, recipeFats, recipeCarbs, recipeIngredients, recipeSteps]);

  const clearDraft = () => {
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
    setDraftRestored(false);
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

  const loadStickers = async () => {
    const res = await fetch(STICKERS_API);
    const data = await res.json();
    const s = data.stickers || {};
    setStickers(s);
    setStickerEdits(s);
  };

  useEffect(() => { loadStickers(); }, []);

  const saveSticker = async (categoryId: string) => {
    setSavingSticker(categoryId);
    const text = (stickerEdits[categoryId] || "").trim();
    if (text) {
      await fetch(STICKERS_API, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "X-Authorization": localStorage.getItem(TOKEN_KEY) || "" },
        body: JSON.stringify({ category_id: categoryId, sticker_text: text }),
      });
    } else {
      await fetch(STICKERS_API, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "X-Authorization": localStorage.getItem(TOKEN_KEY) || "" },
        body: JSON.stringify({ category_id: categoryId }),
      });
    }
    await loadStickers();
    setSavingSticker(null);
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
    setShowForm(true);
    setShowEmoji(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const allMedia: MediaItem[] = [
        ...mediaItems,
        ...(videoUrl.trim() ? [{ type: "video" as const, url: videoUrl.trim() }] : []),
      ];
      const isEdit = !!editingPost;
      const res = await fetch(BLOG_API, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", "X-Authorization": localStorage.getItem(TOKEN_KEY) || "" },
        body: JSON.stringify({
          ...(isEdit ? { id: editingPost!.id } : {}), ...form, media: allMedia,
          teacher_photo: teacherPhoto, teacher_name: teacherName, sticker: postSticker,
          checklist_url: checklistUrl, cta_text: ctaText, cta_url: ctaUrl,
          recipe_time: recipeTime, recipe_servings: recipeServings,
          recipe_calories: recipeCalories, recipe_proteins: recipeProteins,
          recipe_fats: recipeFats, recipe_carbs: recipeCarbs,
          recipe_ingredients: recipeIngredients, recipe_steps: recipeSteps,
        }),
      });
      if (!res.ok) {
        alert("Ошибка при сохранении. Попробуйте ещё раз.");
        return;
      }
      resetForm();
      if (activeTab === form.category) {
        loadPosts(activeTab);
      } else {
        setActiveTab(form.category);
      }
    } catch {
      alert("Не удалось подключиться к серверу. Проверьте интернет и попробуйте ещё раз.");
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async (id: number) => {
    if (!confirm("Удалить этот пост?")) return;
    setDeleting(id);
    await fetch(BLOG_API, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "X-Authorization": localStorage.getItem(TOKEN_KEY) || "" },
      body: JSON.stringify({ id }),
    });
    setPosts(prev => prev.filter(p => p.id !== id));
    setDeleting(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-black text-xl text-gray-800">Управление блогом</h2>
        {managerTab === "posts" && (
          <button
            onClick={() => showForm ? resetForm() : setShowForm(true)}
            className="flex items-center gap-2 bg-orange-400 hover:bg-orange-500 text-white font-bold px-5 py-2.5 rounded-2xl transition-colors text-sm"
          >
            <Icon name={showForm ? "X" : "Plus"} size={16} />
            {showForm ? "Отмена" : "Добавить пост"}
          </button>
        )}
      </div>

      {/* MANAGER TABS */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setManagerTab("posts")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold transition-all ${managerTab === "posts" ? "bg-orange-400 text-white" : "bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-500"}`}
        >
          <Icon name="BookOpen" size={16} />
          Посты
        </button>
        <button
          onClick={() => setManagerTab("stickers")}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold transition-all ${managerTab === "stickers" ? "bg-orange-400 text-white" : "bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-500"}`}
        >
          <Icon name="Tag" size={16} />
          Стикеры
        </button>
      </div>

      {managerTab === "stickers" && (
        <StickersPanel
          stickers={stickers}
          stickerEdits={stickerEdits}
          setStickerEdits={setStickerEdits}
          savingSticker={savingSticker}
          onSave={saveSticker}
        />
      )}

      {managerTab === "posts" && (
        <>
          {showForm && draftRestored && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-4 flex items-center justify-between gap-3">
              <p className="text-sm text-amber-700 flex items-center gap-2">
                <Icon name="RotateCcw" size={16} />
                Мы восстановили черновик — ничего не потерялось
              </p>
              <button
                type="button"
                onClick={() => setDraftRestored(false)}
                className="text-amber-500 hover:text-amber-700"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
          )}
          {showForm && (
            <PostForm
              form={form}
              setForm={setForm}
              mediaItems={mediaItems}
              setMediaItems={setMediaItems}
              teacherPhoto={teacherPhoto}
              setTeacherPhoto={setTeacherPhoto}
              teacherName={teacherName}
              setTeacherName={setTeacherName}
              videoUrl={videoUrl}
              setVideoUrl={setVideoUrl}
              postSticker={postSticker}
              setPostSticker={setPostSticker}
              checklistUrl={checklistUrl}
              setChecklistUrl={setChecklistUrl}
              ctaText={ctaText}
              setCtaText={setCtaText}
              ctaUrl={ctaUrl}
              setCtaUrl={setCtaUrl}
              recipeTime={recipeTime}
              setRecipeTime={setRecipeTime}
              recipeServings={recipeServings}
              setRecipeServings={setRecipeServings}
              recipeCalories={recipeCalories}
              setRecipeCalories={setRecipeCalories}
              recipeProteins={recipeProteins}
              setRecipeProteins={setRecipeProteins}
              recipeFats={recipeFats}
              setRecipeFats={setRecipeFats}
              recipeCarbs={recipeCarbs}
              setRecipeCarbs={setRecipeCarbs}
              recipeIngredients={recipeIngredients}
              setRecipeIngredients={setRecipeIngredients}
              recipeSteps={recipeSteps}
              setRecipeSteps={setRecipeSteps}
              showEmoji={showEmoji}
              setShowEmoji={setShowEmoji}
              emojiTarget={emojiTarget}
              setEmojiTarget={setEmojiTarget}
              uploadingMedia={uploadingMedia}
              saving={saving}
              isEditing={!!editingPost}
              onSubmit={handleSubmit}
              onCancel={resetForm}
              compressImage={compressImage}
              uploadToS3={uploadToS3}
              setUploadingMedia={setUploadingMedia}
            />
          )}
          <PostsList
            posts={posts}
            loading={loading}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            deleting={deleting}
            onEdit={startEdit}
            onDelete={deletePost}
          />
        </>
      )}
    </div>
  );
}
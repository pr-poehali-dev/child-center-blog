import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { BLOG_API, TOKEN_KEY, MediaItem } from "./constants";
import PostForm from "./PostForm";
import PostsList from "./PostsList";
import StickersPanel from "./StickersPanel";
import useBlogPostForm from "./useBlogPostForm";
import useBlogPosts from "./useBlogPosts";
import useBlogStickers from "./useBlogStickers";

export default function BlogManager() {
  const [managerTab, setManagerTab] = useState<"posts" | "stickers">("posts");

  const {
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
  } = useBlogPostForm();

  const {
    posts, loading, activeTab, setActiveTab,
    deleting, publishing,
    loadPosts, publishPost, deletePost,
  } = useBlogPosts();

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("post");
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`${BLOG_API}?id=${encodeURIComponent(id)}`, {
          headers: { "X-Authorization": localStorage.getItem(TOKEN_KEY) || "" },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data.post) {
          startEdit(data.post);
          setActiveTab(data.post.category);
        }
      } catch { /* ignore */ }
    })();
  }, []);

  const {
    stickers, stickerEdits, setStickerEdits, savingSticker,
    descriptions, descriptionEdits, setDescriptionEdits, savingDescription,
    saveSticker, saveDescription,
  } = useBlogStickers();

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
          slug, seo_title: seoTitle, seo_description: seoDescription,
        }),
      });
      if (!res.ok) {
        if (res.status === 409) {
          alert("Такой адрес статьи (slug) уже занят другой статьёй. Измените slug и попробуйте снова.");
        } else if (res.status === 400) {
          const data = await res.json().catch(() => null);
          alert(data?.error || "Проверьте заполненные поля и попробуйте ещё раз.");
        } else {
          alert("Ошибка при сохранении. Попробуйте ещё раз.");
        }
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
          descriptions={descriptions}
          descriptionEdits={descriptionEdits}
          setDescriptionEdits={setDescriptionEdits}
          savingDescription={savingDescription}
          onSaveDescription={saveDescription}
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
              slug={slug}
              setSlug={setSlug}
              seoTitle={seoTitle}
              setSeoTitle={setSeoTitle}
              seoDescription={seoDescription}
              setSeoDescription={setSeoDescription}
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
            onPublish={publishPost}
            publishing={publishing}
          />
        </>
      )}
    </div>
  );
}

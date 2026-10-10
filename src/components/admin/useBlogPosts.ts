import { useEffect, useState } from "react";
import { BLOG_API, TOKEN_KEY, Post } from "./constants";

export default function useBlogPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tips");
  const [deleting, setDeleting] = useState<number | null>(null);
  const [publishing, setPublishing] = useState<number | null>(null);

  const loadPosts = async (cat: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${BLOG_API}?category=${cat}`, {
        headers: { "X-Authorization": localStorage.getItem(TOKEN_KEY) || "" },
      });
      const data = await res.json();
      setPosts(data.posts || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPosts(activeTab); }, [activeTab]);

  const publishPost = async (post: Post) => {
    setPublishing(post.id);
    try {
      const res = await fetch(BLOG_API, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "X-Authorization": localStorage.getItem(TOKEN_KEY) || "" },
        body: JSON.stringify({
          id: post.id, category: post.category, title: post.title, content: post.content,
          media: post.media || [], teacher_photo: post.teacher_photo || "", teacher_name: post.teacher_name || "",
          sticker: post.sticker || "", checklist_url: post.checklist_url || "",
          cta_text: post.cta_text || "", cta_url: post.cta_url || "",
          recipe_time: post.recipe_time || "", recipe_servings: post.recipe_servings || "",
          recipe_calories: post.recipe_calories || "", recipe_proteins: post.recipe_proteins || "",
          recipe_fats: post.recipe_fats || "", recipe_carbs: post.recipe_carbs || "",
          recipe_ingredients: post.recipe_ingredients || "", recipe_steps: post.recipe_steps || "",
          slug: post.slug || "", seo_title: post.seo_title || "", seo_description: post.seo_description || "",
          status: "published",
        }),
      });
      if (!res.ok) {
        alert("Не удалось опубликовать. Попробуйте ещё раз.");
        return;
      }
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: "published" } : p));
    } catch {
      alert("Не удалось подключиться к серверу. Проверьте интернет и попробуйте ещё раз.");
    } finally {
      setPublishing(null);
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

  return {
    posts, loading, activeTab, setActiveTab,
    deleting, publishing,
    loadPosts, publishPost, deletePost,
  };
}

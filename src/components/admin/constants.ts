export const API_URL = "https://functions.poehali.dev/1a73d1e8-5437-405c-895e-6835413def1c";
export const AUTH_URL = "https://functions.poehali.dev/a8c159bd-d63c-431b-a970-462abd7cd949";
export const BLOG_API = "https://functions.poehali.dev/d84b54ca-2906-4a84-be8b-264f6d13e325";
export const UPLOAD_API = "https://functions.poehali.dev/a7038ca8-4f9f-4936-abb3-9236e5cf235a";
export const GET_UPLOAD_URL_API = "https://functions.poehali.dev/ce28a0c2-d56b-44b0-9a1e-da4b4865dbd3";
export const UPLOAD_CHUNK_API = "https://functions.poehali.dev/d5693159-8c64-4d4f-b55f-2db20fa0b98d";
export const UPLOAD_VIDEO_API = "https://functions.poehali.dev/2b11cad0-8e9c-4451-94c5-34d426eb44a7";
export const QA_API = "https://functions.poehali.dev/dbf8090e-245f-45dd-9b83-298fcdf8b666";
export const STICKERS_API = "https://functions.poehali.dev/abb60737-528d-41b4-95b0-c6cafb4e4e0f";
export const SUBSCRIBERS_API = "https://functions.poehali.dev/ad0992ef-212b-47b2-9265-aedfd9a33c3f";
export const PLATE_CHECKLISTS_API = "https://functions.poehali.dev/654937a6-cde9-49df-ba82-e36b291807c7";
export const TOKEN_KEY = "admin_token";

export const STATUS_CONFIG: Record<string, { label: string; color: string; next: string; nextLabel: string }> = {
  new:       { label: "Новая",        color: "bg-orange-100 text-orange-700", next: "confirmed", nextLabel: "Подтвердить" },
  confirmed: { label: "Подтверждена", color: "bg-green-100 text-green-700",   next: "done",      nextLabel: "Завершить"   },
  done:      { label: "Завершена",    color: "bg-gray-100 text-gray-500",      next: "new",       nextLabel: "Обновить"    },
};

export const BLOG_CATEGORIES = [
  { id: "tips",   label: "Советы от педагога",              emoji: "🎓" },
  { id: "life",   label: "Наша жизнь на ладони",            emoji: "🌈" },
  { id: "detail", label: "Подробно о важном",               emoji: "📖" },
  { id: "summer",      label: "Лето с нами. Новости летнего клуба", emoji: "☀️" },
  { id: "afterschool", label: "Группа продлённого дня",      emoji: "📚" },
  { id: "english",     label: "Группа английского языка",   emoji: "🇬🇧" },
  { id: "experiments", label: "Экспериментаторы",            emoji: "🔬" },
  { id: "chefs",       label: "Шеф-повара",                  emoji: "👨‍🍳" },
  { id: "masters",     label: "Мастера вдохновения",         emoji: "🎨" },
  { id: "plate",       label: "Тарелка для всех",            emoji: "🥗" },
];

export interface Booking {
  id: number;
  name: string;
  phone: string;
  child: string;
  cls: string;
  status: string;
  created_at: string;
  source?: string;
}

export interface MediaItem {
  type: "image" | "video" | "document";
  url: string;
  name?: string;
  alt?: string;
  caption?: string;
}

export interface Post {
  id: number;
  category: string;
  title: string;
  content: string;
  media: MediaItem[];
  created_at: string;
  teacher_photo?: string;
  teacher_name?: string;
  sticker?: string;
  checklist_url?: string;
  cta_text?: string;
  cta_url?: string;
}
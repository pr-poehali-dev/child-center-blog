export const SUBSCRIBERS_API = "https://functions.poehali.dev/ad0992ef-212b-47b2-9265-aedfd9a33c3f";
export const BLOG_API = "https://functions.poehali.dev/d84b54ca-2906-4a84-be8b-264f6d13e325";
export const STICKERS_API = "https://functions.poehali.dev/abb60737-528d-41b4-95b0-c6cafb4e4e0f";

export const MAX_LINK = "https://max.ru/u/f9LHodD0cOIKcG0itfDWIZMQp22OCCCC7iCwIUARylW6FIn7W2H3IZ-imyY";
export const TG_LINK = "https://t.me/irinadolli";

export const CATEGORIES = [
  { id: "tips", label: "Советы от педагога", emoji: "🎓", color: "bg-amber-50", border: "border-amber-200", tag: "bg-amber-100 text-amber-700" },
  { id: "life", label: "Наша жизнь на ладони", emoji: "🌈", color: "bg-rose-50", border: "border-rose-200", tag: "bg-rose-100 text-rose-700" },
  { id: "detail", label: "Подробно о важном", emoji: "📖", color: "bg-teal-50", border: "border-teal-200", tag: "bg-teal-100 text-teal-700" },
  { id: "summer",      label: "Лето с нами. Новости летнего клуба", emoji: "☀️", color: "bg-yellow-50",  border: "border-yellow-200",  tag: "bg-yellow-100 text-yellow-700"  },
  { id: "afterschool", label: "Группа продлённого дня",    emoji: "📚", color: "bg-indigo-50",  border: "border-indigo-200",  tag: "bg-indigo-100 text-indigo-700"  },
  { id: "english",     label: "Группа английского языка", emoji: "🇬🇧", color: "bg-sky-50",    border: "border-sky-200",    tag: "bg-sky-100 text-sky-700"        },
  { id: "experiments", label: "Экспериментаторы",         emoji: "🔬", color: "bg-purple-50",  border: "border-purple-200",  tag: "bg-purple-100 text-purple-700"  },
  { id: "chefs",       label: "Шеф-повара",               emoji: "👨‍🍳", color: "bg-orange-50",  border: "border-orange-200",  tag: "bg-orange-100 text-orange-700"  },
  { id: "masters",     label: "Мастера вдохновения",      emoji: "🎨", color: "bg-pink-50",    border: "border-pink-200",    tag: "bg-pink-100 text-pink-700"      },
];

export const SEO_BY_CATEGORY: Record<string, { title: string; description: string }> = {
  tips: {
    title: "Советы педагогов по воспитанию детей | Блог «Рыбка Долли» — Керчь",
    description: "Практические советы педагогов детского центра «Рыбка Долли» в Керчи: как помочь ребёнку адаптироваться, развить речь, справиться с тревогой и вырасти уверенным. Читайте бесплатно.",
  },
  life: {
    title: "Жизнь детского центра «Рыбка Долли» — фото и истории | Керчь",
    description: "Праздники, занятия, смешные моменты и тёплые истории из жизни детского центра «Рыбка Долли» в Керчи. Смотрите как растут наши дети — вместе с радостью!",
  },
  detail: {
    title: "Статьи о развитии и воспитании детей | Блог «Рыбка Долли» — Керчь",
    description: "Подробные статьи от педагогов и психолога центра «Рыбка Долли»: детская психология, готовность к школе, развитие речи, здоровье дошкольников. Для родителей Керчи и Крыма.",
  },
  summer: {
    title: "Летний клуб для детей в Керчи — «Рыбка Долли» | Запись онлайн",
    description: "Летний клуб детского центра «Рыбка Долли» в Керчи — насыщенные смены, творчество, игры и новые друзья. Новости лагеря, расписание, стоимость. Запись через сайт.",
  },
  afterschool: {
    title: "Группа продлённого дня в Керчи — «Рыбка Долли» | Приём заявок",
    description: "Группа продлённого дня для детей в Керчи в центре «Рыбка Долли»: помощь с домашними заданиями, творческие занятия, полдник, опытные педагоги. Работаем с 8:00 до 18:00.",
  },
  english: {
    title: "Английский язык для детей в Керчи — «Рыбка Долли» | С 4 лет",
    description: "Занятия английским языком для детей в Керчи в игровой форме. Опытный педагог, малые группы, быстрый результат. Детский центр «Рыбка Долли» — запись на пробный урок.",
  },
  experiments: {
    title: "Экспериментаторы — Творим с детьми | «Рыбка Долли» Керчь",
    description: "Увлекательные опыты и эксперименты для детей в центре «Рыбка Долли» в Керчи. Маленькие учёные открывают мир через творчество и науку.",
  },
  chefs: {
    title: "Шеф-повара — Творим с детьми | «Рыбка Долли» Керчь",
    description: "Кулинарные мастер-классы для детей в центре «Рыбка Долли» в Керчи. Дети готовят вкусные блюда, развивают самостоятельность и любовь к творчеству.",
  },
  masters: {
    title: "Мастера вдохновения — Творим с детьми | «Рыбка Долли» Керчь",
    description: "Творческие мастер-классы и арт-занятия для детей в центре «Рыбка Долли» в Керчи. Рисуем, лепим, создаём шедевры и вдохновляем друг друга.",
  },
};

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
}

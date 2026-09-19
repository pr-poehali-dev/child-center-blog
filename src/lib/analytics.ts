const METRIKA_ID = 108285412;

/**
 * Отправляет цель в Яндекс.Метрику, если счётчик успел загрузиться.
 * @param params — дополнительные параметры визита (передаются в reachGoal третьим аргументом).
 */
export function trackGoal(goal: string, params?: Record<string, string>): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof (window as any).ym === "function") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).ym(METRIKA_ID, "reachGoal", goal, params);
  }
}

/** Домены-мосты блога: каждому сайту центра соответствует своя UTM-кампания (запасной вариант,
 * если конкретное направление не передано явно через withDirectionUtm). */
const UTM_CAMPAIGN_BY_HOST: Record<string, string> = {
  "ribkadollilend.ru": "blog_to_site",
  "www.ribkadollilend.ru": "blog_to_site",
  "schooldolli.ru": "blog_to_prodlenka",
  "www.schooldolli.ru": "blog_to_prodlenka",
  "dolliklub.ru": "blog_to_camp",
  "www.dolliklub.ru": "blog_to_camp",
};

/**
 * Добавляет к ссылке UTM-метки блога, если ссылка ведёт на один из сайтов центра
 * (основной сайт, продлёнка, летний клуб). Ссылки на прочие домены (VK, MAX, CDN и т.д.)
 * возвращаются без изменений.
 * @param medium "internal" — для обычных ссылок в тексте/карточках, "cta" — для явных кнопок-призывов.
 */
export function withBlogUtm(url: string, medium: "internal" | "cta" = "internal"): string {
  try {
    const parsed = new URL(url, window.location.origin);
    const campaign = UTM_CAMPAIGN_BY_HOST[parsed.hostname];
    if (!campaign) return url;
    parsed.searchParams.set("utm_source", "blog");
    parsed.searchParams.set("utm_medium", medium);
    parsed.searchParams.set("utm_campaign", campaign);
    return parsed.toString();
  } catch {
    return url;
  }
}

/**
 * Единая UTM-разметка для мостов блога на страницы услуг центра.
 * utm_source=blog и utm_medium=cta неизменны для всех мостов, meняется только utm_campaign
 * (по направлению — blog_to_<направление>). Путь страницы услуги обязателен: мостов
 * на главную без пути больше нет.
 * @param url — полный URL страницы услуги, включая путь (например https://ribkadollilend.ru/yasli/)
 * @param direction — код направления для utm_campaign=blog_to_<direction> (напр. "yasli", "school", "prodlenka", "english", "logoped", "camp")
 */
export function withDirectionUtm(url: string, direction: string): string {
  try {
    const parsed = new URL(url, window.location.origin);
    parsed.searchParams.set("utm_source", "blog");
    parsed.searchParams.set("utm_medium", "cta");
    parsed.searchParams.set("utm_campaign", `blog_to_${direction}`);
    return parsed.toString();
  } catch {
    return url;
  }
}
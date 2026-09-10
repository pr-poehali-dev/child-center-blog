const METRIKA_ID = 108285412;

/**
 * Отправляет цель в Яндекс.Метрику, если счётчик успел загрузиться.
 */
export function trackGoal(goal: string): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (typeof (window as any).ym === "function") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).ym(METRIKA_ID, "reachGoal", goal);
  }
}

/** Домены, на которые ведут внутренние переходы блога и которым нужна UTM-метка. */
const UTM_TARGET_HOSTS = ["ribkadollli.ru", "www.ribkadollli.ru"];

/**
 * Добавляет к ссылке UTM-метки блога, если ссылка ведёт на основной сайт центра.
 * Ссылки на прочие домены (VK, Telegram, MAX, CDN и т.д.) возвращаются без изменений.
 */
export function withBlogUtm(url: string): string {
  try {
    const parsed = new URL(url, window.location.origin);
    if (!UTM_TARGET_HOSTS.includes(parsed.hostname)) return url;
    parsed.searchParams.set("utm_source", "blog");
    parsed.searchParams.set("utm_medium", "internal");
    parsed.searchParams.set("utm_campaign", "blog_to_site");
    return parsed.toString();
  } catch {
    return url;
  }
}

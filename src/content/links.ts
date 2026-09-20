/**
 * Единый источник ссылок и UTM-разметки для сети сайтов «Рыбка Долли».
 * Правки вносить ТОЛЬКО здесь — BlogDirectionPicker и вставки ссылок в статьях
 * берут URL из этого файла, а не пишут их напрямую в JSX.
 *
 * Полное описание и история уточнений — в docs/LINKS.md.
 *
 * ПРАВИЛА UTM:
 * - Мостики пикера (BlogDirectionPicker): utm_source=blog&utm_medium=bridge&utm_content=<direction>,
 *   якорь страницы — В САМОМ КОНЦЕ ссылки (после utm-параметров).
 * - Ссылки внутри статей блога: utm_source=blog&utm_medium=article&utm_content=blog<id статьи>,
 *   якорь — тоже в конце.
 * - Реклама (Яндекс.Директ): utm_source=yandex&utm_medium=cpc + свои utm_campaign/utm_content —
 *   эти параметры задаёт Ирина в интерфейсе Директа, здесь не хранятся.
 */

// Константы — базовые адреса разделов сети сайтов (без UTM, для сборки ссылок вручную при необходимости).
export const SITE_LINKS = {
  main: "https://ribkadollilend.ru/",
  tour: "https://ribkadollilend.ru/#tour",
  yasli: "https://ribkadollilend.ru/yasli/",
  foundation4to5: "https://ribkadollilend.ru/podgotovka-k-shkole/#4-5",
  preschool5to7: "https://ribkadollilend.ru/podgotovka-k-shkole/#5-7",
  englishGrade2: "https://schooldolli.ru/#anglyaz",
  afterschool: "https://schooldolli.ru/",
  summerClub: "https://dolliklub.ru/",
} as const;

// Живой раздел — блог. Обновлять в день публикации новой статьи.
export const BLOG_LINKS = {
  postDiagnostics: "https://blogribkadolli.ru/blog/diagnostika-gotovnosti-k-shkole",
  postAttention: "https://blogribkadolli.ru/blog/rebenok-ne-mozhet-usidet",
  postEnglish: "https://blogribkadolli.ru/blog/angliyskiy-vo-vtorom-klasse",
  categoryTips: "https://blogribkadolli.ru/blog?category=tips",
  categoryLife: "https://blogribkadolli.ru/blog?category=life",
  categoryEnglish: "https://blogribkadolli.ru/blog?category=english",
  categoryPlate: "https://blogribkadolli.ru/blog?category=plate",
} as const;

export interface BridgeDirection {
  label: string;
  href: string;
  direction: string;
}

// Пункты мостика BlogDirectionPicker. href — готовая ссылка с UTM (utm_medium=bridge) и якорем в конце.
// direction — значение параметра "direction" в цели Метрики direction_click (совпадает с utm_content,
// кроме случаев где два пункта ведут в один и тот же раздел статистики — см. "4-5" и "5-7").
export const DIRECTION_PICKER_LINKS: BridgeDirection[] = [
  { label: "Пробное занятие и экскурсия", href: "https://ribkadollilend.ru/?utm_source=blog&utm_medium=bridge&utm_content=tour#tour", direction: "tour" },
  { label: "Ясли", href: "https://ribkadollilend.ru/yasli/?utm_source=blog&utm_medium=bridge&utm_content=yasli", direction: "yasli" },
  { label: "4-5 лет: Фундамент", href: "https://ribkadollilend.ru/podgotovka-k-shkole/?utm_source=blog&utm_medium=bridge&utm_content=foundation#4-5", direction: "school" },
  { label: "5-7 лет: Предшкольная", href: "https://ribkadollilend.ru/podgotovka-k-shkole/?utm_source=blog&utm_medium=bridge&utm_content=school#5-7", direction: "school" },
  { label: "Английский: группа 2 класса", href: "https://schooldolli.ru/?utm_source=blog&utm_medium=bridge&utm_content=english#anglyaz", direction: "english" },
  // Якорь #glavnaya на schooldolli.ru не существует (проверено), поэтому ссылка ведёт на корень сайта
  // без якоря — весь сайт schooldolli.ru посвящён продлёнке. См. docs/LINKS.md, раздел «Уточнения».
  { label: "Продлёнка", href: "https://schooldolli.ru/?utm_source=blog&utm_medium=bridge&utm_content=prodlenka", direction: "prodlenka" },
  { label: "Летний клуб", href: "https://dolliklub.ru/?utm_source=blog&utm_medium=bridge&utm_content=letniy", direction: "letniy" },
];

/**
 * Собирает ссылку на мост из статьи блога на страницу услуги, с UTM для конкретной статьи.
 * @param baseUrl — адрес страницы услуги БЕЗ якоря (например SITE_LINKS.yasli)
 * @param postId — числовой id статьи (для utm_content=blog<id>)
 * @param anchor — якорь без "#", если нужен (добавляется в конце, после UTM)
 */
export function withArticleUtm(baseUrl: string, postId: number, anchor?: string): string {
  try {
    const parsed = new URL(baseUrl);
    parsed.hash = "";
    parsed.searchParams.set("utm_source", "blog");
    parsed.searchParams.set("utm_medium", "article");
    parsed.searchParams.set("utm_content", `blog${postId}`);
    return anchor ? `${parsed.toString()}#${anchor}` : parsed.toString();
  } catch {
    return baseUrl;
  }
}

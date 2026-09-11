import Icon from "@/components/ui/icon";
import { withBlogUtm } from "@/lib/analytics";

/**
 * Явные кнопки-мосты с внутренних страниц блога на сайты продлёнки и летнего клуба.
 * Каждая ссылка помечена своей UTM-кампанией (см. src/lib/analytics.ts), чтобы переходы
 * были измеримы в Метрике соответствующего сайта.
 */
export default function BlogSiteBridges() {
  return (
    <div className="grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto px-4 py-6">
      <a
        href={withBlogUtm("https://schooldolli.ru", "cta")}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-black px-6 py-4 rounded-2xl text-sm transition-colors shadow-sm"
      >
        <span className="text-lg">📚</span>
        Записаться в продлёнку
        <Icon name="ArrowRight" size={16} />
      </a>
      <a
        href={withBlogUtm("https://dolliklub.ru", "cta")}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-black px-6 py-4 rounded-2xl text-sm transition-colors shadow-sm"
      >
        <span className="text-lg">☀️</span>
        Записаться в летний клуб
        <Icon name="ArrowRight" size={16} />
      </a>
    </div>
  );
}

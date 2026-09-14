import { withBlogUtm } from "@/lib/analytics";
import BrandBridgeCard from "@/components/BrandBridgeCard";

/**
 * Явные кнопки-мосты с внутренних страниц блога на сайты продлёнки и летнего клуба.
 * Каждая ссылка помечена своей UTM-кампанией (см. src/lib/analytics.ts), чтобы переходы
 * были измеримы в Метрике соответствующего сайта.
 */
export default function BlogSiteBridges() {
  return (
    <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto px-4 py-6">
      <BrandBridgeCard
        href={withBlogUtm("https://schooldolli.ru", "cta")}
        title="Записаться в продлёнку"
        subtitle="Присмотр, уроки и полдник каждый будний день"
      />
      <BrandBridgeCard
        href={withBlogUtm("https://dolliklub.ru", "cta")}
        title="Записаться в летний клуб"
        subtitle="Смены, программа и яркие каникулы для детей"
      />
    </div>
  );
}

import { withBlogUtm } from "@/lib/analytics";
import BrandBridgeCard from "@/components/BrandBridgeCard";

interface BridgeConfig {
  href: string;
  title: string;
  subtitle: string;
}

const BRIDGES: Record<string, BridgeConfig> = {
  afterschool: {
    href: "https://schooldolli.ru",
    title: "Записаться в продлёнку",
    subtitle: "Присмотр, уроки и полдник каждый будний день",
  },
  summer: {
    href: "https://dolliklub.ru",
    title: "Записаться в летний клуб",
    subtitle: "Смены, программа и яркие каникулы для детей",
  },
  yasli: {
    href: "https://ribkadollilend.ru",
    title: "Записаться в ясельную группу",
    subtitle: "Мягкая адаптация малышей от 1,5 до 3 лет",
  },
  school: {
    href: "https://ribkadollilend.ru",
    title: "Записаться на подготовку к школе",
    subtitle: "Чтение, счёт и письмо для будущих первоклассников",
  },
  english: {
    href: "https://ribkadollilend.ru",
    title: "Записаться на английский",
    subtitle: "Игровые занятия для детей с 4 лет",
  },
};

export default function BlogCategoryBridge({ categoryId }: { categoryId: string }) {
  const bridge = BRIDGES[categoryId];
  if (!bridge) return null;

  return (
    <div className="mt-8">
      <BrandBridgeCard href={withBlogUtm(bridge.href, "cta")} title={bridge.title} subtitle={bridge.subtitle} />
    </div>
  );
}

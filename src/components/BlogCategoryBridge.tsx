import Icon from "@/components/ui/icon";
import { withBlogUtm } from "@/lib/analytics";

interface BridgeConfig {
  href: string;
  emoji: string;
  title: string;
  subtitle: string;
  colorClass: string;
}

const BRIDGES: Record<string, BridgeConfig> = {
  afterschool: {
    href: "https://schooldolli.ru",
    emoji: "📚",
    title: "Записаться в продлёнку",
    subtitle: "Присмотр, уроки и полдник каждый будний день",
    colorClass: "bg-indigo-500 hover:bg-indigo-600",
  },
  summer: {
    href: "https://dolliklub.ru",
    emoji: "☀️",
    title: "Записаться в летний клуб",
    subtitle: "Смены, программа и яркие каникулы для детей",
    colorClass: "bg-yellow-500 hover:bg-yellow-600",
  },
  yasli: {
    href: "https://ribkadollilend.ru",
    emoji: "🍼",
    title: "Записаться в ясельную группу",
    subtitle: "Мягкая адаптация малышей от 1,5 до 3 лет",
    colorClass: "bg-orange-500 hover:bg-orange-600",
  },
  school: {
    href: "https://ribkadollilend.ru",
    emoji: "🎒",
    title: "Записаться на подготовку к школе",
    subtitle: "Чтение, счёт и письмо для будущих первоклассников",
    colorClass: "bg-orange-500 hover:bg-orange-600",
  },
  english: {
    href: "https://ribkadollilend.ru",
    emoji: "🇬🇧",
    title: "Записаться на английский",
    subtitle: "Игровые занятия для детей с 4 лет",
    colorClass: "bg-sky-500 hover:bg-sky-600",
  },
};

export default function BlogCategoryBridge({ categoryId }: { categoryId: string }) {
  const bridge = BRIDGES[categoryId];
  if (!bridge) return null;

  return (
    <a
      href={withBlogUtm(bridge.href, "cta")}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-between gap-4 ${bridge.colorClass} text-white rounded-2xl px-6 py-5 mt-8 transition-colors shadow-sm`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{bridge.emoji}</span>
        <div>
          <div className="font-black text-base leading-tight">{bridge.title}</div>
          <div className="text-white/80 text-xs mt-0.5">{bridge.subtitle}</div>
        </div>
      </div>
      <Icon name="ArrowRight" size={20} className="flex-shrink-0" />
    </a>
  );
}

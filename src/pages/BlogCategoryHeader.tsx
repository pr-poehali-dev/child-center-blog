import ThinUnderline from "@/components/home/ThinUnderline";
import { TILES } from "@/components/home/HomeBlogSection";

export function getCategoryImage(id: string): string | undefined {
  const tile = TILES.find(t => t.id === id);
  if (tile) return tile.image;
  if (id === "experiments" || id === "chefs") return TILES.find(t => t.id === "masters")?.image;
  return undefined;
}

interface BlogCategoryHeaderProps {
  emoji: string;
  label: string;
  image?: string;
  description?: string;
}

export default function BlogCategoryHeader({ emoji, label, image, description }: BlogCategoryHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-4 md:gap-5 mb-3">
        {image ? (
          <img
            src={image}
            alt={label}
            className="w-[84px] h-[84px] md:w-[120px] md:h-[120px] rounded-full object-cover shadow-[0_4px_14px_rgba(23,54,74,0.18)] flex-shrink-0"
            style={{ boxShadow: "inset 0 0 0 3px rgba(217,164,65,0.35), 0 4px 14px rgba(23,54,74,0.18)" }}
          />
        ) : (
          <div className="w-[84px] h-[84px] md:w-[120px] md:h-[120px] rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-4xl md:text-5xl flex-shrink-0">
            {emoji}
          </div>
        )}
        <h2
          className="relative inline-block font-playfair font-bold leading-tight text-2xl md:text-[32px]"
          style={{ color: "#17364A" }}
        >
          {label}
          <ThinUnderline />
        </h2>
      </div>
      {description && (
        <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
      )}
    </div>
  );
}

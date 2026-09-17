import { CATEGORIES } from "./blog-types";
import { getCategoryImage } from "./BlogCategoryHeader";

interface BlogCategoryMedallionsProps {
  activeTab: string;
  onSelect: (id: string) => void;
  onQaClick: () => void;
}

const QA_IMAGE = "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/ea37ac57-0151-42c4-96c8-09560aa13604.png";

const BASE_SHADOW = "0 2px 6px rgba(23,54,74,0.10), 0 8px 20px rgba(23,54,74,0.12)";

function Medallion({ image, label, active }: { image?: string; label: string; active: boolean }) {
  const ringWidth = active ? 3 : 2;
  return (
    <span
      className="relative rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-200 group-hover:-translate-y-0.5"
      style={{
        width: 80,
        height: 80,
        boxShadow: active
          ? `0 0 0 ${ringWidth}px #D9A441, 0 0 10px 2px rgba(217,164,65,0.45), ${BASE_SHADOW}`
          : `0 0 0 ${ringWidth}px #D9A441, ${BASE_SHADOW}`,
      }}
    >
      <span
        className="relative block rounded-full bg-white overflow-hidden"
        style={{ width: 74, height: 74, padding: 7 }}
      >
        <span className="relative block w-full h-full rounded-full overflow-hidden">
          {image ? (
            <img src={image} alt={label} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#FBF6EE]" />
          )}
          <span
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 35%)" }}
          />
        </span>
      </span>
    </span>
  );
}

export default function BlogCategoryMedallions({ activeTab, onSelect, onQaClick }: BlogCategoryMedallionsProps) {
  const items = CATEGORIES.map(c => ({ id: c.id, label: c.shortLabel || c.label, image: getCategoryImage(c.id) }));

  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-10"
        style={{ background: "linear-gradient(90deg, white, transparent)" }}
      />
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10"
        style={{ background: "linear-gradient(270deg, white, transparent)" }}
      />
      <div className="max-w-4xl mx-auto px-4 pb-3 flex gap-5 overflow-x-auto no-scrollbar">
        {items.map(item => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className="flex flex-col items-center gap-1.5 shrink-0 group"
              style={{ width: 80 }}
            >
              <Medallion image={item.image} label={item.label} active={active} />
              <span
                className="font-playfair font-bold text-center leading-tight flex items-center justify-center"
                style={{ fontSize: 11.5, color: "#17364A", height: 28, borderBottom: active ? "2px solid #D9A441" : "2px solid transparent" }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
        <button onClick={onQaClick} className="flex flex-col items-center gap-1.5 shrink-0 group" style={{ width: 80 }}>
          <Medallion image={QA_IMAGE} label="Вопрос-ответ" active={false} />
          <span className="font-playfair font-bold text-center leading-tight flex items-center justify-center" style={{ fontSize: 11.5, color: "#17364A", height: 28 }}>
            Вопрос-ответ
          </span>
        </button>
      </div>
    </div>
  );
}
import { CATEGORIES } from "./blog-types";
import { getCategoryImage } from "./BlogCategoryHeader";

interface BlogCategoryMedallionsProps {
  activeTab: string;
  onSelect: (id: string) => void;
  onQaClick: () => void;
}

const QA_IMAGE = "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/ea37ac57-0151-42c4-96c8-09560aa13604.png";

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
              className="flex flex-col items-center gap-1.5 shrink-0"
              style={{ width: 78 }}
            >
              <span
                className="rounded-full overflow-hidden flex-shrink-0 transition-shadow"
                style={{
                  width: 76,
                  height: 76,
                  boxShadow: active
                    ? "inset 0 0 0 3px #D9A441, 0 4px 12px rgba(217,164,65,0.35)"
                    : "inset 0 0 0 2px rgba(217,164,65,0.35)",
                }}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.label}
                    className="w-full h-full object-cover"
                    style={{ filter: "saturate(1.35) contrast(1.08)" }}
                  />
                ) : (
                  <div className="w-full h-full bg-[#FBF6EE]" />
                )}
              </span>
              <span
                className="font-playfair font-bold text-center leading-tight flex items-center justify-center"
                style={{ fontSize: 11.5, color: "#17364A", height: 28, borderBottom: active ? "2px solid #D9A441" : "2px solid transparent" }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
        <button onClick={onQaClick} className="flex flex-col items-center gap-1.5 shrink-0" style={{ width: 78 }}>
          <span
            className="rounded-full overflow-hidden flex-shrink-0"
            style={{ width: 76, height: 76, boxShadow: "inset 0 0 0 2px rgba(217,164,65,0.35)" }}
          >
            <img src={QA_IMAGE} alt="Вопрос-ответ" className="w-full h-full object-cover" style={{ filter: "saturate(1.35) contrast(1.08)" }} />
          </span>
          <span className="font-playfair font-bold text-center leading-tight flex items-center justify-center" style={{ fontSize: 11.5, color: "#17364A", height: 28 }}>
            Вопрос-ответ
          </span>
        </button>
      </div>
    </div>
  );
}

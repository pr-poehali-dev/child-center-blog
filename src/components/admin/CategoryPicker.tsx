import { BLOG_CATEGORIES } from "./constants";

interface CategoryPickerProps {
  value: string;
  onChange: (id: string) => void;
}

export default function CategoryPicker({ value, onChange }: CategoryPickerProps) {
  return (
    <div>
      <label className="text-xs font-bold text-gray-500 mb-1.5 block">Раздел</label>
      <div className="flex flex-wrap gap-2">
        {BLOG_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all ${
              value === cat.id
                ? "bg-orange-400 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-500"
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

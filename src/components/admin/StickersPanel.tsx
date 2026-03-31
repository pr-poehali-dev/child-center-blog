import Icon from "@/components/ui/icon";
import StickerTag from "@/components/ui/sticker-tag";
import { BLOG_CATEGORIES } from "./constants";

interface StickersPanelProps {
  stickers: Record<string, string>;
  stickerEdits: Record<string, string>;
  setStickerEdits: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  savingSticker: string | null;
  onSave: (categoryId: string) => void;
}

export default function StickersPanel({
  stickers, stickerEdits, setStickerEdits, savingSticker, onSave,
}: StickersPanelProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 mb-2">Добавь стикер к любому разделу — он будет отображаться на карточках раздела как яркая наклейка. Оставь поле пустым, чтобы убрать стикер.</p>
      {BLOG_CATEGORIES.map(cat => {
        const current = stickers[cat.id] || "";
        const edited = stickerEdits[cat.id] ?? current;
        const hasActive = !!current;
        return (
          <div key={cat.id} className={`rounded-2xl border p-4 ${hasActive ? "bg-orange-50 border-orange-200" : "bg-white border-gray-100"}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{cat.emoji}</span>
              <span className="font-bold text-sm text-gray-700">{cat.label}</span>
              {hasActive && (
                <span className="ml-auto text-xs bg-orange-400 text-white font-bold px-2 py-0.5 rounded-full">Активен</span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={edited}
                maxLength={60}
                onChange={e => setStickerEdits(prev => ({ ...prev, [cat.id]: e.target.value }))}
                placeholder="Текст стикера, например: «Внутри приятный бонус!»"
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
              <button
                onClick={() => onSave(cat.id)}
                disabled={savingSticker === cat.id}
                className="flex items-center gap-1.5 bg-orange-400 hover:bg-orange-500 disabled:opacity-60 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
              >
                <Icon name={savingSticker === cat.id ? "Loader2" : "Check"} size={15} className={savingSticker === cat.id ? "animate-spin" : ""} />
                Сохранить
              </button>
            </div>
            {hasActive && (
              <div className="mt-3">
                <p className="text-xs text-gray-400 mb-1.5">Предпросмотр стикера:</p>
                <StickerTag text={current} size="sm" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

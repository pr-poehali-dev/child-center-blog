import Icon from "@/components/ui/icon";
import StickerTag from "@/components/ui/sticker-tag";
import { BLOG_CATEGORIES } from "./constants";

interface StickersPanelProps {
  stickers: Record<string, string>;
  stickerEdits: Record<string, string>;
  setStickerEdits: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  savingSticker: string | null;
  onSave: (categoryId: string) => void;
  descriptions: Record<string, string>;
  descriptionEdits: Record<string, string>;
  setDescriptionEdits: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  savingDescription: string | null;
  onSaveDescription: (categoryId: string) => void;
}

export default function StickersPanel({
  stickers, stickerEdits, setStickerEdits, savingSticker, onSave,
  descriptions, descriptionEdits, setDescriptionEdits, savingDescription, onSaveDescription,
}: StickersPanelProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 mb-2">Добавь стикер к любому разделу — он будет отображаться на карточках раздела как яркая наклейка. Добавь описание — оно покажется над списком статей на странице раздела. Оставь поле пустым, чтобы убрать.</p>
      {BLOG_CATEGORIES.map(cat => {
        const current = stickers[cat.id] || "";
        const edited = stickerEdits[cat.id] ?? current;
        const hasActive = !!current;
        const currentDesc = descriptions[cat.id] || "";
        const editedDesc = descriptionEdits[cat.id] ?? currentDesc;
        const hasDesc = !!currentDesc;
        return (
          <div key={cat.id} className={`rounded-2xl border p-4 ${hasActive ? "bg-orange-50 border-orange-200" : "bg-white border-gray-100"}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{cat.emoji}</span>
              <span className="font-bold text-sm text-gray-700">{cat.label}</span>
              {hasActive && (
                <span className="ml-auto text-xs bg-orange-400 text-white font-bold px-2 py-0.5 rounded-full">Стикер активен</span>
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

            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="text-xs font-bold text-gray-500 mb-1.5 block flex items-center gap-1.5">
                <Icon name="AlignLeft" size={13} /> Описание рубрики (SEO, 3-4 предложения)
                {hasDesc && <span className="ml-auto text-xs bg-blue-400 text-white font-bold px-2 py-0.5 rounded-full">Заполнено</span>}
              </label>
              <div className="flex flex-col gap-2">
                <textarea
                  rows={3}
                  maxLength={600}
                  value={editedDesc}
                  onChange={e => setDescriptionEdits(prev => ({ ...prev, [cat.id]: e.target.value }))}
                  placeholder="Короткое описание рубрики — покажется над списком статей на странице раздела"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
                />
                <button
                  onClick={() => onSaveDescription(cat.id)}
                  disabled={savingDescription === cat.id}
                  className="self-start flex items-center gap-1.5 bg-blue-400 hover:bg-blue-500 disabled:opacity-60 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
                >
                  <Icon name={savingDescription === cat.id ? "Loader2" : "Check"} size={15} className={savingDescription === cat.id ? "animate-spin" : ""} />
                  Сохранить описание
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
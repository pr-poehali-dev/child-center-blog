import Icon from "@/components/ui/icon";
import StickerTag from "@/components/ui/sticker-tag";

interface PostExtrasFieldsProps {
  postSticker: string;
  setPostSticker: (v: string) => void;
  checklistUrl: string;
  setChecklistUrl: (v: string) => void;
  ctaText: string;
  setCtaText: (v: string) => void;
  ctaUrl: string;
  setCtaUrl: (v: string) => void;
}

export default function PostExtrasFields({
  postSticker, setPostSticker,
  checklistUrl, setChecklistUrl,
  ctaText, setCtaText,
  ctaUrl, setCtaUrl,
}: PostExtrasFieldsProps) {
  return (
    <>
      {/* STICKER */}
      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
        <label className="text-xs font-bold text-gray-500 mb-1.5 block flex items-center gap-1.5">
          <span>🏷️</span> Стикер к посту (необязательно)
        </label>
        <input
          type="text"
          maxLength={60}
          value={postSticker}
          onChange={e => setPostSticker(e.target.value)}
          placeholder="Например: «Внутри приятный бонус!»"
          className="w-full border border-orange-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        />
        <p className="text-xs text-gray-400 mt-1.5">Стикер виден на карточке поста в блоге — бросается в глаза</p>
        {postSticker.trim() && (
          <div className="mt-3">
            <p className="text-xs text-gray-400 mb-2">Предпросмотр:</p>
            <StickerTag text={postSticker.trim()} />
          </div>
        )}
      </div>

      {/* CHECKLIST */}
      <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4">
        <label className="text-xs font-bold text-gray-500 mb-1.5 block flex items-center gap-1.5">
          <span>📋</span> Чек-лист после заявки (необязательно)
        </label>
        <div className="relative">
          <input
            type="url"
            value={checklistUrl}
            onChange={e => setChecklistUrl(e.target.value)}
            placeholder="https://disk.yandex.ru/..."
            className="w-full border border-teal-200 bg-white rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
          />
          {checklistUrl && (
            <button type="button" onClick={() => setChecklistUrl("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <Icon name="X" size={16} />
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1.5">Ссылка на чек-лист появится читателю после отправки заявки на занятие</p>
      </div>

      {/* CTA BUTTON */}
      <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
        <label className="text-xs font-bold text-gray-500 mb-1.5 block flex items-center gap-1.5">
          <span>🔗</span> Кнопка-призыв под статьёй (необязательно)
        </label>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            maxLength={40}
            value={ctaText}
            onChange={e => setCtaText(e.target.value)}
            placeholder="Текст на кнопке, например: Перейти на сайт"
            className="w-full border border-purple-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
          />
          <div className="relative">
            <input
              type="url"
              value={ctaUrl}
              onChange={e => setCtaUrl(e.target.value)}
              placeholder="https://..."
              className="w-full border border-purple-200 bg-white rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            />
            {ctaUrl && (
              <button type="button" onClick={() => setCtaUrl("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <Icon name="X" size={16} />
              </button>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1.5">Кнопка появится под статьёй и поведёт по указанной ссылке — можно вести на любой сайт</p>
      </div>
    </>
  );
}

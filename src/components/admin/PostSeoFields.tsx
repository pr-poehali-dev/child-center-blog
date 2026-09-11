import Icon from "@/components/ui/icon";

interface PostSeoFieldsProps {
  slug: string;
  setSlug: (v: string) => void;
  seoTitle: string;
  setSeoTitle: (v: string) => void;
  seoDescription: string;
  setSeoDescription: (v: string) => void;
}

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яё\s-]/gi, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default function PostSeoFields({
  slug, setSlug,
  seoTitle, setSeoTitle,
  seoDescription, setSeoDescription,
}: PostSeoFieldsProps) {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-3">
      <label className="text-xs font-bold text-gray-500 block flex items-center gap-1.5">
        <Icon name="Search" size={14} /> SEO-настройки (необязательно)
      </label>

      <div>
        <label className="text-xs text-gray-400 mb-1 block">Адрес статьи (slug)</label>
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-400 shrink-0">/blog/</span>
          <input
            type="text"
            value={slug}
            onChange={e => setSlug(slugify(e.target.value))}
            placeholder="adaptaciya"
            className="w-full border border-blue-200 bg-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">Латиницей, без пробелов. Если пусто — статья будет доступна по числовому id.</p>
      </div>

      <div>
        <label className="text-xs text-gray-400 mb-1 block">SEO-заголовок (title)</label>
        <input
          type="text"
          maxLength={255}
          value={seoTitle}
          onChange={e => setSeoTitle(e.target.value)}
          placeholder="Если пусто — используется обычный заголовок статьи"
          className="w-full border border-blue-200 bg-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
        />
      </div>

      <div>
        <label className="text-xs text-gray-400 mb-1 block">SEO-описание (description)</label>
        <textarea
          rows={2}
          maxLength={500}
          value={seoDescription}
          onChange={e => setSeoDescription(e.target.value)}
          placeholder="Если пусто — описание сформируется автоматически из текста статьи"
          className="w-full border border-blue-200 bg-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none"
        />
      </div>
    </div>
  );
}

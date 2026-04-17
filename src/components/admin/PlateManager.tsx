import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { PLATE_CHECKLISTS_API, TOKEN_KEY } from "./constants";

interface Checklist {
  id: number;
  title: string;
  description: string;
  pdf_url: string;
  cover_emoji: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

const EMPTY: Omit<Checklist, "id" | "created_at"> = {
  title: "",
  description: "",
  pdf_url: "",
  cover_emoji: "🥗",
  sort_order: 0,
  is_active: true,
};

export default function PlateManager() {
  const [items, setItems] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ...EMPTY });
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const token = localStorage.getItem(TOKEN_KEY) || "";

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(PLATE_CHECKLISTS_API, {
        headers: { "X-Admin-Password": token },
      });
      const data = await res.json();
      setItems(data.checklists || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleEdit = (item: Checklist) => {
    setEditId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      pdf_url: item.pdf_url,
      cover_emoji: item.cover_emoji,
      sort_order: item.sort_order,
      is_active: item.is_active,
    });
    setShowForm(true);
  };

  const handleNew = () => {
    setEditId(null);
    setForm({ ...EMPTY });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = editId ? { ...form, id: editId } : form;
      await fetch(PLATE_CHECKLISTS_API, {
        method: editId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Password": token },
        body: JSON.stringify(body),
      });
      setShowForm(false);
      setEditId(null);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Удалить рецепт?")) return;
    await fetch(PLATE_CHECKLISTS_API, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "X-Admin-Password": token },
      body: JSON.stringify({ id }),
    });
    await load();
  };

  const handleToggle = async (item: Checklist) => {
    await fetch(PLATE_CHECKLISTS_API, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "X-Admin-Password": token },
      body: JSON.stringify({ ...item, is_active: !item.is_active }),
    });
    await load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-gray-800">Тарелка для всех — рецепты</h2>
          <p className="text-sm text-gray-400 mt-0.5">Рецепты доступны подписчикам блога</p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          <Icon name="Plus" size={16} />
          Добавить рецепт
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-6">
          <h3 className="font-black text-gray-800 mb-4">{editId ? "Редактировать рецепт" : "Новый рецепт"}</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-[80px_1fr] gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Эмодзи</label>
                <input
                  type="text"
                  value={form.cover_emoji}
                  onChange={e => setForm(f => ({ ...f, cover_emoji: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xl text-center focus:outline-none focus:border-green-400"
                  maxLength={4}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Название *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Безглютеновые блины"
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Короткое описание</label>
              <input
                type="text"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Нежные блинчики из рисовой муки..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Ссылка на PDF *</label>
              <input
                type="url"
                value={form.pdf_url}
                onChange={e => setForm(f => ({ ...f, pdf_url: e.target.value }))}
                placeholder="https://drive.google.com/file/..."
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-400"
              />
              <p className="text-xs text-gray-400 mt-1">Вставьте прямую ссылку из Google Drive, Яндекс.Диска или другого облака</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Порядок (число)</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-400"
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                    className="w-4 h-4 accent-green-500"
                  />
                  <span className="text-sm font-bold text-gray-700">Опубликован</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
              >
                {saving ? <Icon name="Loader2" size={15} className="animate-spin" /> : <Icon name="Check" size={15} />}
                {saving ? "Сохраняю..." : "Сохранить"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-green-200 border-t-green-500 rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">🥗</div>
          <p className="font-medium">Рецептов пока нет</p>
          <p className="text-sm mt-1">Нажмите «Добавить рецепт» чтобы начать</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div
              key={item.id}
              className={`flex items-start gap-4 bg-white border rounded-2xl p-4 transition-all ${item.is_active ? "border-green-100" : "border-gray-100 opacity-60"}`}
            >
              <div className="text-3xl shrink-0">{item.cover_emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-black text-gray-800 text-sm">{item.title}</span>
                  {!item.is_active && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">Скрыт</span>
                  )}
                </div>
                {item.description && <p className="text-xs text-gray-500 mb-1">{item.description}</p>}
                <a href={item.pdf_url} target="_blank" rel="noreferrer" className="text-xs text-green-600 underline truncate block max-w-xs">
                  {item.pdf_url}
                </a>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleToggle(item)}
                  title={item.is_active ? "Скрыть" : "Показать"}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Icon name={item.is_active ? "Eye" : "EyeOff"} size={16} />
                </button>
                <button
                  onClick={() => handleEdit(item)}
                  className="p-2 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors"
                >
                  <Icon name="Pencil" size={16} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

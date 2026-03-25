import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";
import { QA_API, TOKEN_KEY } from "./constants";

const TEACHERS: Record<string, { name: string; role: string }> = {
  irina_p_teacher: { name: "Ирина Павловна", role: "Учитель начальных классов" },
  irina_p_manager: { name: "Ирина Павловна", role: "Управляющая центром" },
  irina_v:         { name: "Ирина Васильевна", role: "Педагог-психолог, воспитатель ясельной группы" },
  svetlana:        { name: "Светлана Владимировна", role: "Воспитатель старшей группы, креатив-педагог" },
  victoria:        { name: "Виктория Анатольевна", role: "Логопед" },
  natalia:         { name: "Наталья Петровна", role: "Учитель продлёнки, учитель английского, педагог-вожатый" },
};

interface Question {
  id: number;
  teacher_id: string;
  teacher: { name: string; role: string };
  question: string;
  author_name: string | null;
  is_anonymous: boolean;
  answer: string | null;
  answered_at: string | null;
  rating: number | null;
  rating_hidden: boolean;
  created_at: string;
}

function StarDisplay({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={s <= value ? "text-yellow-400" : "text-gray-200"}>★</span>
      ))}
    </span>
  );
}

export default function QAManager() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTeacher, setFilterTeacher] = useState("");
  const [filterAnswered, setFilterAnswered] = useState<"all" | "new" | "answered">("all");
  const [answerText, setAnswerText] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState<number | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  const token = localStorage.getItem(TOKEN_KEY) || "";
  const headers = { "Content-Type": "application/json", "X-Authorization": token };

  const load = async () => {
    setLoading(true);
    try {
      const url = filterTeacher ? `${QA_API}?teacher_id=${filterTeacher}` : QA_API;
      const res = await fetch(url, { headers: { "X-Authorization": token } });
      const data = await res.json();
      setQuestions(data.questions || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filterTeacher]);

  const sendAnswer = async (id: number) => {
    const answer = answerText[id]?.trim();
    if (!answer) return;
    setSaving(id);
    await fetch(QA_API, { method: "PUT", headers, body: JSON.stringify({ id, answer }) });
    setAnswerText(prev => { const n = { ...prev }; delete n[id]; return n; });
    await load();
    setSaving(null);
  };

  const deleteQuestion = async (id: number) => {
    if (!confirm("Удалить этот вопрос?")) return;
    setDeleting(id);
    await fetch(QA_API, { method: "DELETE", headers, body: JSON.stringify({ id }) });
    setQuestions(prev => prev.filter(q => q.id !== id));
    setDeleting(null);
  };

  const toggleRating = async (id: number, hidden: boolean) => {
    await fetch(QA_API, { method: "PUT", headers, body: JSON.stringify({ action: "toggle_rating", id, hidden }) });
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, rating_hidden: hidden } : q));
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  const filtered = questions.filter(q => {
    if (filterAnswered === "new") return !q.answer;
    if (filterAnswered === "answered") return !!q.answer;
    return true;
  });

  const newCount = questions.filter(q => !q.answer).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-black text-xl text-gray-800">Спрашивали — Отвечаем</h2>
          {newCount > 0 && (
            <span className="text-sm text-orange-500 font-semibold">{newCount} без ответа</span>
          )}
        </div>
        <button onClick={load} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-orange-500 transition-colors">
          <Icon name="RefreshCw" size={15} />
          Обновить
        </button>
      </div>

      {/* Фильтры */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { key: "all", label: "Все" },
          { key: "new", label: `Новые (${newCount})` },
          { key: "answered", label: "Отвеченные" },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilterAnswered(f.key as "all" | "new" | "answered")}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              filterAnswered === f.key ? "bg-orange-400 text-white" : "bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-500"
            }`}
          >
            {f.label}
          </button>
        ))}
        <select
          value={filterTeacher}
          onChange={e => setFilterTeacher(e.target.value)}
          className="px-4 py-2 rounded-full text-sm font-bold bg-gray-100 text-gray-600 border-0 outline-none"
        >
          <option value="">Все педагоги</option>
          {Object.entries(TEACHERS).map(([id, t]) => (
            <option key={id} value={id}>{t.name} — {t.role.split(",")[0]}</option>
          ))}
        </select>
      </div>

      {/* Список */}
      {loading ? (
        <div className="text-center py-16 text-gray-300">
          <Icon name="Loader2" size={32} className="animate-spin mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-orange-100">
          <div className="text-4xl mb-3">💬</div>
          <div className="font-black text-gray-500">Вопросов пока нет</div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(q => (
            <div key={q.id} className={`bg-white rounded-2xl border p-5 ${!q.answer ? "border-orange-200" : "border-gray-100"}`}>
              {/* Шапка */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  {!q.answer && (
                    <span className="shrink-0 w-2 h-2 rounded-full bg-orange-400" />
                  )}
                  <div className="min-w-0">
                    <span className="font-bold text-sm text-gray-700">{q.teacher?.name}</span>
                    <span className="text-xs text-gray-400 ml-2">{q.teacher?.role}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-gray-400">{formatDate(q.created_at)}</span>
                  <button
                    onClick={() => deleteQuestion(q.id)}
                    disabled={deleting === q.id}
                    className="text-gray-300 hover:text-red-400 transition-colors"
                  >
                    <Icon name={deleting === q.id ? "Loader2" : "Trash2"} size={16} className={deleting === q.id ? "animate-spin" : ""} />
                  </button>
                </div>
              </div>

              {/* Вопрос */}
              <div className="bg-orange-50 rounded-xl px-4 py-3 mb-3">
                <p className="text-sm text-gray-700 leading-relaxed">{q.question}</p>
                <p className="text-xs text-gray-400 mt-1.5">
                  {q.is_anonymous ? "Анонимный вопрос" : q.author_name ? `Автор: ${q.author_name}` : "Автор не указан"}
                </p>
              </div>

              {/* Ответ или форма */}
              {q.answer ? (
                <div className="bg-green-50 rounded-xl px-4 py-3">
                  <div className="text-xs font-bold text-green-600 mb-1">Ответ опубликован</div>
                  <p className="text-sm text-gray-700 leading-relaxed">{q.answer}</p>
                  {q.answered_at && (
                    <p className="text-xs text-gray-400 mt-1">{formatDate(q.answered_at)}</p>
                  )}
                  {/* Оценка */}
                  {q.rating !== null && (
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-green-100">
                      <StarDisplay value={q.rating} />
                      <span className="text-xs text-gray-500">{q.rating}/5</span>
                      {!q.rating_hidden ? (
                        <button
                          onClick={() => toggleRating(q.id, true)}
                          className="ml-auto text-xs text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1"
                        >
                          <Icon name="EyeOff" size={13} /> Скрыть оценку
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleRating(q.id, false)}
                          className="ml-auto text-xs text-gray-400 hover:text-green-500 transition-colors flex items-center gap-1"
                        >
                          <Icon name="Eye" size={13} /> Показать оценку
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none"
                    placeholder="Напишите ответ на вопрос..."
                    value={answerText[q.id] || ""}
                    onChange={e => setAnswerText(prev => ({ ...prev, [q.id]: e.target.value }))}
                  />
                  <button
                    onClick={() => sendAnswer(q.id)}
                    disabled={saving === q.id || !answerText[q.id]?.trim()}
                    className="flex items-center gap-2 bg-orange-400 hover:bg-orange-500 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"
                  >
                    <Icon name={saving === q.id ? "Loader2" : "Send"} size={15} className={saving === q.id ? "animate-spin" : ""} />
                    {saving === q.id ? "Публикуем..." : "Опубликовать ответ"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const QA_API = "https://functions.poehali.dev/dbf8090e-245f-45dd-9b83-298fcdf8b666";

interface Teacher {
  name: string;
  role: string;
}

interface Question {
  id: number;
  teacher_id: string;
  teacher: Teacher;
  question: string;
  author_name: string | null;
  is_anonymous: boolean;
  answer: string | null;
  answered_at: string | null;
  rating: number | null;
  created_at: string;
}

const TEACHERS: Record<string, Teacher & { photo?: string }> = {
  irina_p_teacher: { name: "Ирина Павловна", role: "Учитель начальных классов", photo: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/cf6fdc8d-d414-4883-8e42-51fe0c980bff.jpg" },
  irina_p_manager: { name: "Ирина Павловна", role: "Управляющая центром", photo: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/cf6fdc8d-d414-4883-8e42-51fe0c980bff.jpg" },
  irina_v:         { name: "Ирина Васильевна", role: "Педагог-психолог, воспитатель ясельной группы", photo: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/6d70e757-b181-403b-9f62-94cb81221ac7.jpg" },
  svetlana:        { name: "Светлана Владимировна", role: "Воспитатель старшей группы, креатив-педагог", photo: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/a82e6d86-7c74-47c4-abcc-d6a296719e5b.jpg" },
  victoria:        { name: "Виктория Анатольевна", role: "Логопед", photo: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/6a8eabb8-750e-4cba-87b1-bf25857b0b40.jpg" },
  natalia:         { name: "Наталья Петровна", role: "Учитель продлёнки, учитель английского, педагог-вожатый", photo: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/ba79529f-fc27-49bf-9fc8-093e58408c0d.jpg" },
};

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={`text-2xl transition-transform ${onChange ? "hover:scale-110 cursor-pointer" : "cursor-default"}`}
        >
          <span className={(hovered || value) >= star ? "text-yellow-400" : "text-gray-200"}>★</span>
        </button>
      ))}
    </div>
  );
}

function TeacherAvatar({ id }: { id: string }) {
  const t = TEACHERS[id];
  const initials = t?.name.split(" ").map(w => w[0]).slice(0, 2).join("") || "?";
  if (t?.photo) {
    return (
      <div className="w-12 h-16 rounded-xl overflow-hidden shrink-0 border border-orange-100 shadow-sm">
        <img src={t.photo} alt={t.name} className="w-full h-full object-cover object-top" />
      </div>
    );
  }
  return (
    <div className="w-12 h-16 rounded-xl bg-gradient-to-br from-orange-300 to-rose-400 flex items-center justify-center text-white font-black shrink-0 text-lg">
      {initials}
    </div>
  );
}

function QuestionCard({ q, onRate }: { q: Question; onRate: (id: number, rating: number) => void }) {
  const [rated, setRated] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

  const handleRate = async (rating: number) => {
    setSelectedRating(rating);
    setRated(true);
    onRate(q.id, rating);
  };

  return (
    <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
      {/* Вопрос */}
      <div className="p-5 pb-4">
        <div className="flex items-start gap-3 mb-3">
          <TeacherAvatar id={q.teacher_id} />
          <div className="flex-1 min-w-0">
            <div className="font-black text-gray-800 text-sm leading-tight">{q.teacher?.name}</div>
            <div className="text-xs text-gray-400 leading-tight">{q.teacher?.role}</div>
          </div>
          <span className="text-xs text-gray-300 shrink-0">{formatDate(q.created_at)}</span>
        </div>
        <div className="bg-orange-50 rounded-2xl px-4 py-3">
          <div className="flex items-start gap-2">
            <span className="text-orange-400 font-black text-sm shrink-0">?</span>
            <p className="text-gray-700 text-sm leading-relaxed">{q.question}</p>
          </div>
          <div className="text-xs text-gray-400 mt-2">
            {q.is_anonymous ? "Анонимный вопрос" : q.author_name ? `Спрашивает: ${q.author_name}` : ""}
          </div>
        </div>
      </div>

      {/* Ответ */}
      {q.answer && (
        <div className="border-t border-orange-50 bg-gradient-to-br from-amber-50 to-orange-50 px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-orange-400 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-white text-xs font-black">!</span>
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-orange-500 mb-1">Ответ педагога</div>
              <p className="text-gray-700 text-sm leading-relaxed">{q.answer}</p>
              {q.answered_at && (
                <div className="text-xs text-gray-400 mt-2">{formatDate(q.answered_at)}</div>
              )}
            </div>
          </div>

          {/* Оценка */}
          <div className="mt-4 pt-3 border-t border-orange-100">
            {q.rating !== null ? (
              <div className="flex items-center gap-2">
                <StarRating value={q.rating} />
                <span className="text-xs text-gray-400">Оценка ответа</span>
              </div>
            ) : rated ? (
              <div className="flex items-center gap-2">
                <StarRating value={selectedRating} />
                <span className="text-xs text-green-500 font-semibold">Спасибо за оценку!</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs text-gray-500">Оцените ответ:</span>
                <StarRating value={0} onChange={handleRate} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function QA() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTeacher, setFilterTeacher] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ teacher_id: "", question: "", author_name: "", is_anonymous: false });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const url = filterTeacher ? `${QA_API}?teacher_id=${filterTeacher}` : QA_API;
      const res = await fetch(url);
      const data = await res.json();
      setQuestions(data.questions || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filterTeacher]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.teacher_id || !form.question.trim()) return;
    setSending(true);
    try {
      await fetch(QA_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSent(true);
      setShowForm(false);
      setForm({ teacher_id: "", question: "", author_name: "", is_anonymous: false });
      load();
    } finally {
      setSending(false);
    }
  };

  const handleRate = async (id: number, rating: number) => {
    await fetch(QA_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "rate", id, rating }),
    });
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, rating } : q));
  };

  return (
    <div className="min-h-screen bg-[#fffdf8] font-nunito text-gray-700">
      {/* HEADER */}
      <div className="bg-white border-b border-orange-100 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => navigate("/blog")} className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition-colors font-semibold">
            <Icon name="ArrowLeft" size={20} />
            <span className="hidden sm:inline">В блог</span>
          </button>
          <div className="flex-1 text-center">
            <div className="font-black text-gray-800 text-lg leading-tight">Спрашивали — Отвечаем</div>
            <div className="font-caveat text-orange-400 text-sm">Задайте вопрос педагогу</div>
          </div>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Кнопка задать вопрос */}
        {!showForm && (
          <button
            onClick={() => { setShowForm(true); setSent(false); }}
            className="w-full flex items-center justify-center gap-2 bg-orange-400 hover:bg-orange-500 text-white font-black py-4 rounded-2xl mb-6 transition-colors text-base shadow-sm"
          >
            <Icon name="MessageCirclePlus" size={20} />
            Задать вопрос педагогу
          </button>
        )}

        {sent && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <Icon name="CheckCircle" size={20} className="text-green-500 shrink-0" />
            <p className="text-green-700 text-sm font-semibold">Вопрос отправлен! Педагог ответит в ближайшее время.</p>
          </div>
        )}

        {/* Форма вопроса */}
        {showForm && (
          <div className="bg-white rounded-3xl border border-orange-100 p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-gray-800">Ваш вопрос</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <Icon name="X" size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Выбор педагога */}
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block">Выберите педагога</label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(TEACHERS).map(([id, t]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, teacher_id: id }))}
                      className={`flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all relative ${
                        form.teacher_id === id
                          ? "border-orange-400 bg-orange-50"
                          : "border-gray-100 hover:border-orange-200 hover:bg-orange-50/50"
                      }`}
                    >
                      {t.photo ? (
                        <div className="w-14 h-20 rounded-xl overflow-hidden shrink-0 shadow-sm">
                          <img src={t.photo} alt={t.name} className="w-full h-full object-cover object-top" />
                        </div>
                      ) : (
                        <div className="w-14 h-20 rounded-xl bg-gradient-to-br from-orange-300 to-rose-400 flex items-center justify-center text-white font-black text-xl shrink-0">
                          {t.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-black text-gray-800 text-sm leading-tight">{t.name}</div>
                        <div className="text-xs text-gray-400 leading-snug mt-1">{t.role}</div>
                      </div>
                      {form.teacher_id === id && (
                        <Icon name="CheckCircle" size={18} className="text-orange-400 shrink-0 absolute top-2 right-2" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Вопрос */}
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1.5 block">Ваш вопрос</label>
                <textarea
                  required
                  rows={4}
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none"
                  placeholder="Напишите ваш вопрос..."
                  value={form.question}
                  onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
                />
              </div>

              {/* Анонимность */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setForm(f => ({ ...f, is_anonymous: !f.is_anonymous }))}
                    className={`w-11 h-6 rounded-full transition-colors relative ${form.is_anonymous ? "bg-orange-400" : "bg-gray-200"}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.is_anonymous ? "translate-x-6" : "translate-x-1"}`} />
                  </div>
                  <span className="text-sm text-gray-600">Задать анонимно</span>
                </label>
              </div>

              {/* Имя (если не анонимно) */}
              {!form.is_anonymous && (
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1.5 block">Ваше имя (необязательно)</label>
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    placeholder="Как вас зовут?"
                    value={form.author_name}
                    onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={sending || !form.teacher_id}
                className="w-full bg-orange-400 hover:bg-orange-500 disabled:opacity-60 text-white font-black py-3.5 rounded-2xl transition-colors"
              >
                {sending ? "Отправляем..." : "Отправить вопрос"}
              </button>
            </form>
          </div>
        )}

        {/* Фильтр по педагогу */}
        <div className="mb-5">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setFilterTeacher("")}
              className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${
                filterTeacher === "" ? "bg-orange-400 text-white" : "bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-500"
              }`}
            >
              Все педагоги
            </button>
            {Object.entries(TEACHERS).map(([id, t]) => (
              <button
                key={id}
                onClick={() => setFilterTeacher(id)}
                className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  filterTeacher === id ? "bg-orange-400 text-white" : "bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-500"
                }`}
              >
                {t.photo ? (
                  <img src={t.photo} alt={t.name} className="w-5 h-5 rounded object-cover object-top shrink-0" />
                ) : null}
                {t.name.split(" ")[0]} {t.name.split(" ")[1]?.[0]}.
              </button>
            ))}
          </div>
        </div>

        {/* Список вопросов */}
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-300">
            <Icon name="Loader2" size={36} className="animate-spin" />
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">💬</div>
            <div className="font-black text-xl text-gray-400 mb-2">Вопросов пока нет</div>
            <div className="text-gray-400 text-sm">Будьте первым — задайте вопрос педагогу!</div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {questions.map(q => (
              <QuestionCard key={q.id} q={q} onRate={handleRate} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { SUBSCRIBERS_API, TOKEN_KEY } from "./constants";

interface Subscriber {
  id: number;
  name: string;
  email: string;
  created_at: string;
  is_active: boolean;
}

export default function SubscribersManager() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ sent: number; errors: number } | null>(null);
  const [tab, setTab] = useState<"list" | "send">("list");


  const token = localStorage.getItem(TOKEN_KEY) || "";

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(SUBSCRIBERS_API, {
        headers: { "X-Admin-Password": token },
      });
      const data = await res.json();
      setSubscribers(data.subscribers || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) return;
    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch(SUBSCRIBERS_API + "/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Password": token,
        },
        body: JSON.stringify({ subject, message }),
      });
      const data = await res.json();
      setSendResult({ sent: data.sent, errors: data.errors });
      setSubject("");
      setMessage("");
    } finally {
      setSending(false);
    }
  };

  const active = subscribers.filter(s => s.is_active);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black text-gray-800">Подписчики блога</h2>
          <p className="text-sm text-gray-400 mt-0.5">Всего подписчиков: {active.length}</p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-orange-500 transition-colors">
          <Icon name="RefreshCw" size={15} />
          Обновить
        </button>
      </div>

      {/* Вкладки */}
      <div className="flex gap-1 mb-6 border-b border-orange-100">
        {[
          { key: "list", label: "Список подписчиков", icon: "Users" },
          { key: "send", label: "Отправить письмо", icon: "Send" },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as "list" | "send")}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold border-b-2 transition-colors -mb-px ${
              tab === t.key
                ? "border-orange-400 text-orange-500"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            <Icon name={t.icon} size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "list" && (
        <div>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            </div>
          ) : subscribers.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Icon name="Users" size={40} />
              <p className="mt-3 font-medium">Подписчиков пока нет</p>
              <p className="text-sm mt-1">Форма подписки размещена на странице блога</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-orange-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-orange-50 border-b border-orange-100">
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Имя</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">Дата подписки</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((s, i) => (
                    <tr key={s.id} className={`border-b border-orange-50 ${i % 2 === 0 ? "bg-white" : "bg-orange-50/30"}`}>
                      <td className="px-4 py-3 font-semibold text-gray-800 text-sm">{s.name}</td>
                      <td className="px-4 py-3 text-gray-600 text-sm">{s.email}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">
                        {new Date(s.created_at).toLocaleDateString("ru-RU")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === "send" && (
        <div className="max-w-2xl">
          {sendResult && (
            <div className="mb-5 bg-green-50 border border-green-200 rounded-xl px-5 py-4 flex items-start gap-3">
              <Icon name="CheckCircle" size={20} className="text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-green-700">Рассылка отправлена!</p>
                <p className="text-sm text-green-600 mt-0.5">
                  Доставлено: {sendResult.sent} писем
                  {sendResult.errors > 0 && `, ошибок: ${sendResult.errors}`}
                </p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-orange-100 p-6 space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Кому</label>
              <div className="bg-orange-50 rounded-xl px-4 py-2.5 text-sm text-orange-700 font-medium">
                Всем активным подписчикам ({active.length} чел.)
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Тема письма</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Например: Новая статья в блоге"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Текст письма</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Напишите сообщение подписчикам..."
                rows={6}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 transition-colors resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">В письме будет личное обращение по имени каждого подписчика</p>
            </div>
            <button
              onClick={handleSend}
              disabled={sending || !subject.trim() || !message.trim() || active.length === 0}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              {sending ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <Icon name="Send" size={16} />
              )}
              {sending ? "Отправляю..." : `Отправить ${active.length} подписчикам`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import Icon from "@/components/ui/icon";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}

export default function BookingModal({ open, onClose }: BookingModalProps) {
  const [form, setForm] = useState({ name: "", phone: "", child: "", cls: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSendError("");
    try {
      const res = await fetch("https://functions.poehali.dev/a38028da-1fda-42f8-8c38-6c5bc5522662", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof (window as any).ym === "function") (window as any).ym(108285412, "reachGoal", "booking_submit");
    } catch {
      setSendError("Не удалось отправить заявку. Попробуйте ещё раз.");
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    onClose();
    setSubmitted(false);
    setSendError("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={handleClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <button onClick={handleClose} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600">
          <Icon name="X" size={22} />
        </button>
        {!submitted ? (
          <>
            <div className="text-3xl mb-2">📋</div>
            <h3 className="font-black text-2xl text-gray-800 mb-1">Запись на занятие</h3>
            <p className="text-gray-400 text-sm mb-6">Заполните форму и мы свяжемся с вами в ближайшее время.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Ваше имя</label>
                <input required className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" placeholder="Мама / папа" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Телефон</label>
                <input required className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" placeholder="+7 (___) ___-__-__" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Имя и возраст ребёнка</label>
                <input required className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" placeholder="Маша, 5 лет" value={form.child} onChange={(e) => setForm({ ...form, child: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Что интересует (необязательно)</label>
                <input className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" placeholder="Рисование, логика..." value={form.cls} onChange={(e) => setForm({ ...form, cls: e.target.value })} />
              </div>
              {sendError && <p className="text-red-500 text-sm text-center">{sendError}</p>}
              <button type="submit" disabled={sending} className="w-full bg-orange-400 hover:bg-orange-500 disabled:opacity-60 text-white font-black py-4 rounded-2xl transition-colors text-base mt-2">
                {sending ? "Отправляем..." : "Отправить заявку"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="font-black text-2xl text-gray-800 mb-3">Заявка принята!</h3>
            <p className="text-gray-500 leading-relaxed mb-5">Мы свяжемся с вами в ближайшее время!</p>
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-5 text-left">
              <p className="text-xs font-bold text-orange-500 mb-1 uppercase tracking-wide">🎁 Подарок для вас</p>
              <p className="text-sm text-gray-700 font-semibold mb-3 leading-snug">Чек-лист: как помочь ребёнку понять прочитанное</p>
              <a
                href="https://disk.yandex.ru/i/IAc_t1vpQQ61qA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-orange-400 hover:bg-orange-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors w-full justify-center"
              >
                <Icon name="Download" size={16} />
                Скачать чек-лист
              </a>
            </div>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-sm font-semibold transition-colors">
              Закрыть
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Icon from "@/components/ui/icon";

const SUBSCRIBERS_API = "https://functions.poehali.dev/ad0992ef-212b-47b2-9265-aedfd9a33c3f";

export default function FloatingSubscribe() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "exists">("idle");

  const isAdmin = location.pathname.startsWith("/admin");

  // Появляется после прокрутки 300px
  useEffect(() => {
    if (isAdmin) return;
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isAdmin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch(SUBSCRIBERS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });
      if (res.status === 409) { setStatus("exists"); return; }
      if (!res.ok) { setStatus("error"); return; }
      setStatus("success");
      setName("");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setStatus("idle");
    setName("");
    setEmail("");
  };

  if (isAdmin) return null;

  return (
    <>
      {/* Затемнение фона */}
      {open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40 transition-opacity"
          onClick={handleClose}
        />
      )}

      {/* Всплывающая форма */}
      <div className={`fixed bottom-24 right-5 z-50 w-72 transition-all duration-300 ${open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}`}>
        <div className="bg-white rounded-3xl shadow-2xl border border-orange-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-400 to-rose-400 px-5 py-4 flex items-center justify-between">
            <div>
              <div className="text-white font-black text-base leading-tight">Подписаться на блог</div>
              <div className="text-white/80 text-xs mt-0.5">Новые статьи — на вашу почту</div>
            </div>
            <button onClick={handleClose} className="text-white/70 hover:text-white transition-colors">
              <Icon name="X" size={18} />
            </button>
          </div>

          <div className="px-5 py-4">
            {status === "success" ? (
              <div className="text-center py-3">
                <div className="text-4xl mb-2">☀️</div>
                <p className="font-black text-gray-800 text-sm">Вы подписаны!</p>
                <p className="text-gray-400 text-xs mt-1">Будем присылать новые статьи</p>
                <button
                  onClick={handleClose}
                  className="mt-4 w-full bg-orange-100 text-orange-600 font-bold py-2 rounded-xl text-sm hover:bg-orange-200 transition-colors"
                >
                  Отлично!
                </button>
              </div>
            ) : status === "exists" ? (
              <div className="text-center py-3">
                <div className="text-3xl mb-2">👋</div>
                <p className="font-bold text-gray-700 text-sm">Вы уже подписаны!</p>
                <p className="text-gray-400 text-xs mt-1">Этот email уже в нашем списке</p>
                <button
                  onClick={handleClose}
                  className="mt-4 w-full bg-orange-100 text-orange-600 font-bold py-2 rounded-xl text-sm hover:bg-orange-200 transition-colors"
                >
                  Понятно
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                <input
                  type="text"
                  placeholder="Ваше имя"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 transition-colors"
                />
                {status === "error" && (
                  <p className="text-red-500 text-xs">Ошибка. Попробуйте ещё раз.</p>
                )}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-400 to-rose-400 hover:from-orange-500 hover:to-rose-500 disabled:opacity-60 text-white font-black py-2.5 rounded-xl text-sm transition-all"
                >
                  {status === "loading" ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Icon name="Bell" size={15} />
                  )}
                  Подписаться
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Круглая плавающая кнопка */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-500
          bg-gradient-to-br from-orange-400 to-rose-400 hover:from-orange-500 hover:to-rose-500
          flex items-center justify-center
          hover:scale-110 active:scale-95
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}
          ${open ? "rotate-45" : "rotate-0"}
        `}
        style={{ boxShadow: "0 4px 20px rgba(251,146,60,0.5)" }}
        title="Подписаться на блог"
      >
        {open ? (
          <Icon name="X" size={22} className="text-white" />
        ) : (
          <Icon name="Bell" size={22} className="text-white" />
        )}
      </button>
    </>
  );
}
import { useState } from "react";
import Icon from "@/components/ui/icon";
import { AUTH_URL, TOKEN_KEY } from "./constants";

export default function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError("Неверный пароль. Попробуйте ещё раз.");
      } else {
        localStorage.setItem(TOKEN_KEY, data.token);
        onLogin(data.token);
      }
    } catch {
      setError("Ошибка соединения. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffdf8] font-nunito flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌟</div>
          <h1 className="font-black text-2xl text-gray-800">Панель администратора</h1>
          <p className="text-gray-400 text-sm mt-1">Детский центр «Рыбка Долли»</p>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-orange-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1.5 block">Пароль</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  required
                  autoFocus
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 pr-11 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Icon name={show ? "EyeOff" : "Eye"} size={17} />
                </button>
              </div>
            </div>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-2xl font-semibold">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-400 hover:bg-orange-500 disabled:opacity-60 text-white font-black py-3.5 rounded-2xl transition-colors"
            >
              {loading ? "Проверяем..." : "Войти"}
            </button>
          </form>
        </div>
        <div className="text-center mt-6">
          <a href="/" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">← Вернуться на сайт</a>
        </div>
      </div>
    </div>
  );
}

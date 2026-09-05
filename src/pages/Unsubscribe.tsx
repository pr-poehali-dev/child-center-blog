import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const SUBSCRIBERS_API = "https://functions.poehali.dev/ad0992ef-212b-47b2-9265-aedfd9a33c3f";

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [name, setName] = useState("");

  useEffect(() => {
    if (!token) { setStatus("error"); return; }
    fetch(`${SUBSCRIBERS_API}?unsubscribe=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.ok) { setName(data.name || ""); setStatus("success"); }
        else setStatus("error");
      })
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <div className="min-h-screen bg-[#FFF9F3] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            <p className="text-gray-400">Обрабатываем запрос...</p>
          </div>
        )}

        {status === "success" && (
          <div className="bg-white rounded-3xl border border-orange-100 p-10 shadow-sm">
            <div className="text-6xl mb-5">👋</div>
            <h1 className="text-2xl font-black text-gray-800 mb-3">
              {name ? `До свидания, ${name}!` : "Вы отписались"}
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Вы успешно отписались от рассылки блога «Рыбка Долли». Мы не будем присылать вам письма.
            </p>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-rose-400 text-white font-bold px-6 py-3 rounded-xl hover:from-orange-500 hover:to-rose-500 transition-all"
            >
              <Icon name="BookOpen" size={16} />
              Вернуться в блог
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="bg-white rounded-3xl border border-orange-100 p-10 shadow-sm">
            <div className="text-6xl mb-5">😕</div>
            <h1 className="text-2xl font-black text-gray-800 mb-3">Что-то пошло не так</h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Ссылка недействительна или уже была использована.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 font-bold px-6 py-3 rounded-xl hover:bg-orange-200 transition-all"
            >
              <Icon name="Home" size={16} />
              На главную
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

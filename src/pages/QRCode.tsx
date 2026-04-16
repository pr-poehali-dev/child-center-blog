import { useState } from "react";

const SITE_URL = "https://blogribkadolli.ru/";
const QR_URL = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(SITE_URL)}&choe=UTF-8&chld=M|2`;

export default function QRCodePage() {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center gap-6 max-w-sm w-full">
        <div className="text-center">
          <div className="font-caveat text-orange-400 text-2xl mb-1">Детский центр</div>
          <h1 className="font-black text-2xl text-gray-800">«Рыбка Долли»</h1>
        </div>

        <div className="rounded-2xl overflow-hidden border-4 border-orange-100 shadow-md bg-white p-2">
          {imgError ? (
            <div className="w-[260px] h-[260px] flex flex-col items-center justify-center text-gray-400 text-center text-sm gap-2">
              <span className="text-4xl">⚠️</span>
              <span>Не удалось загрузить QR-код.<br />Проверьте интернет и обновите страницу.</span>
            </div>
          ) : (
            <img
              src={QR_URL}
              alt="QR-код сайта Рыбка Долли"
              width={260}
              height={260}
              className="block"
              onError={() => setImgError(true)}
            />
          )}
        </div>

        <p className="text-gray-400 text-sm text-center">
          Наведи камеру телефона — и ты на сайте!
        </p>

        <a
          href={SITE_URL}
          className="text-orange-400 font-bold text-sm hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {SITE_URL}
        </a>

        <a
          href={QR_URL}
          download="qr-ribkadolli.png"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-orange-400 hover:bg-orange-500 text-white font-black py-3 rounded-2xl text-base transition-all hover:shadow-lg text-center block"
        >
          Скачать PNG
        </a>
      </div>
    </div>
  );
}
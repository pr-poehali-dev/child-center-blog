const SITE_URL = "https://blogribkadolli.ru/";
const QR_API = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(SITE_URL)}&bgcolor=ffffff&color=1a1a1a&margin=20&qzone=2`;

export default function QRCode() {
  const handleDownload = async () => {
    const res = await fetch(QR_API);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-ribkadolli.png";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-10 flex flex-col items-center gap-6 max-w-sm w-full">
        <div className="text-center">
          <div className="font-caveat text-orange-400 text-2xl mb-1">Детский центр</div>
          <h1 className="font-black text-2xl text-gray-800">«Рыбка Долли»</h1>
        </div>

        <div className="rounded-2xl overflow-hidden border-4 border-orange-100 shadow-md">
          <img
            src={QR_API}
            alt="QR-код сайта Рыбка Долли"
            width={280}
            height={280}
            className="block"
          />
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

        <button
          onClick={handleDownload}
          className="w-full bg-orange-400 hover:bg-orange-500 text-white font-black py-3 rounded-2xl text-base transition-all hover:shadow-lg"
        >
          Скачать PNG
        </button>
      </div>
    </div>
  );
}

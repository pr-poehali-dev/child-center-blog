import { useState } from "react";
import Icon from "@/components/ui/icon";

interface PolaroidPhoto {
  url: string;
  caption: string;
  rotate: number;
}

const ROW_PHOTOS: PolaroidPhoto[] = [
  { url: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/886d25b8-fb6a-49da-884e-b62ebb14ebd8.jpg", caption: "утро начинается с игры", rotate: -2 },
  { url: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/43e91a93-d4c3-43ee-960f-a1a72f443355.jpg", caption: "осень акварелью", rotate: 1.5 },
  { url: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/468fe139-9a79-4ff7-9dc0-7416d0179edd.jpg", caption: "обед по расписанию", rotate: -1.5 },
  { url: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/66ff53cc-a574-4fa5-ba0a-cc50bd4b7baa.jpg", caption: "собираемся на занятия", rotate: 2 },
];

const SECOND_ROW_PHOTOS: PolaroidPhoto[] = [
  { url: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/0642eab1-46f3-4016-86f5-2358ac7185ef.jpg", caption: "тихий час бережёт сны", rotate: -1 },
  { url: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/blog/2db05ee4-9993-4866-ad00-6a5448ca2dd2.jpg", caption: "прогулка под парусом", rotate: 1.8 },
  { url: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/blog/86ee6be6-a75c-4eb6-a03e-ba8553e7bd0f.jpg", caption: "вечер: игры с друзьями", rotate: -2 },
];

function Polaroid({ photo, onClick }: { photo: PolaroidPhoto; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-white p-3 pb-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:z-10 transition-all duration-200 relative"
      style={{
        transform: `rotate(${photo.rotate}deg)`,
        width: "180px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.12), 0 12px 22px rgba(0,0,0,0.14)",
      }}
    >
      <div className="w-full overflow-hidden bg-gray-100" style={{ aspectRatio: "3 / 4" }}>
        <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
      </div>
      <div
        className="font-caveat text-center mt-2 leading-none"
        style={{ color: "#D9A441", fontSize: 19 }}
      >
        {photo.caption}
      </div>
    </button>
  );
}

export default function HomePolaroidCollage() {
  const [lightbox, setLightbox] = useState<PolaroidPhoto | null>(null);

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="grid grid-cols-2 md:flex md:flex-wrap items-start justify-center gap-4 md:gap-6">
        {ROW_PHOTOS.map((photo, i) => (
          <div key={i} className="flex justify-center">
            <Polaroid photo={photo} onClick={() => setLightbox(photo)} />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 md:flex md:flex-wrap items-start justify-center gap-4 md:gap-6 mt-4 md:mt-6">
        {SECOND_ROW_PHOTOS.map((photo, i) => (
          <div key={i} className={`flex justify-center ${i === 2 ? "col-span-2" : ""}`}>
            <Polaroid photo={photo} onClick={() => setLightbox(photo)} />
          </div>
        ))}
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors" onClick={() => setLightbox(null)}>
            <Icon name="X" size={32} />
          </button>
          <div className="bg-white p-4 pb-10 shadow-2xl max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <img src={lightbox.url} alt={lightbox.caption} className="w-full h-auto object-cover" />
            <div className="font-caveat text-2xl text-gray-700 text-center mt-3">{lightbox.caption}</div>
          </div>
        </div>
      )}
    </div>
  );
}
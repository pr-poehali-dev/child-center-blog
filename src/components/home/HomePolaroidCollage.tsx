import { useState } from "react";
import Icon from "@/components/ui/icon";

interface PolaroidPhoto {
  url: string;
  caption: string;
  rotate: number;
}

const PHOTOS: PolaroidPhoto[] = [
  { url: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/files/70a2a26d-bffd-47c7-8466-d29f71f92424.jpg", caption: "Творческие занятия", rotate: -3 },
  { url: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/files/addf9831-3918-418d-8071-96e54aa59a9e.jpg", caption: "Готовимся рисовать", rotate: 2 },
  { url: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/files/6d3f772d-660e-4191-88af-fcb3a2257ad3.jpg", caption: "Полдник с пользой", rotate: -2 },
  { url: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/files/302ac75a-effe-4be7-b6b3-9e4d635da9fd.jpg", caption: "Собираемся на занятия", rotate: 3 },
  { url: "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/files/ff78c37d-3c1d-430c-86be-7890fe9f13d6.jpg", caption: "Любимые игрушки", rotate: -2 },
];

export default function HomePolaroidCollage() {
  const [lightbox, setLightbox] = useState<PolaroidPhoto | null>(null);

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="flex flex-wrap items-start justify-center gap-4 md:gap-6">
        {PHOTOS.map((photo, i) => (
          <button
            key={i}
            onClick={() => setLightbox(photo)}
            className="bg-white p-3 pb-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:z-10 transition-all duration-200 relative"
            style={{ transform: `rotate(${photo.rotate}deg)`, width: "180px" }}
          >
            <div className="w-full aspect-square overflow-hidden bg-gray-100">
              <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
            </div>
            <div className="font-caveat text-lg text-gray-700 text-center mt-2 leading-none">{photo.caption}</div>
          </button>
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

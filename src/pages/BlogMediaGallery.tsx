import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import { MediaItem } from "./blog-types";

export function VideoThumb({ url, onClick }: { url: string; onClick: () => void }) {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaying(true);
    ref.current?.play();
  };

  return (
    <div className="w-full h-full relative bg-gray-900" onClick={onClick}>
      <video
        ref={ref}
        src={url}
        className="w-full h-full object-cover"
        playsInline
        preload="metadata"
        controls={playing}
        onEnded={() => setPlaying(false)}
      />
      {!playing && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={handlePlay}
        >
          <div className="bg-black/50 rounded-full p-3">
            <Icon name="Play" size={32} className="text-white" />
          </div>
        </div>
      )}
    </div>
  );
}

export function MediaGallery({ media }: { media: MediaItem[] }) {
  const [active, setActive] = useState<MediaItem | null>(null);
  const visibleMedia = media?.filter(m => m.type !== "document") || [];
  if (visibleMedia.length === 0) return null;
  return (
    <>
      <div className={`grid gap-2 mt-4 ${visibleMedia.length === 1 ? "grid-cols-1" : visibleMedia.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
        {visibleMedia.map((m, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div
              className={`rounded-2xl overflow-hidden bg-gray-100 group ${m.type === "video" ? "aspect-video" : visibleMedia.length === 1 ? "cursor-pointer" : "aspect-square cursor-pointer"}`}
              onClick={m.type === "image" ? () => setActive(m) : undefined}
            >
              {m.type === "video" ? (
                <VideoThumb url={m.url} onClick={() => setActive(m)} />
              ) : (
                <img src={m.url} alt={m.alt || ""} className={`w-full transition-transform duration-500 group-hover:scale-105 ${visibleMedia.length === 1 ? "h-auto object-contain" : "h-full object-cover"}`} />
              )}
            </div>
            {m.caption && (
              <p className="text-xs text-gray-500 text-center px-1 leading-snug">{m.caption}</p>
            )}
          </div>
        ))}
      </div>
      {active && active.type === "image" && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setActive(null)}>
          <button className="absolute top-4 right-4 text-white" onClick={() => setActive(null)}>
            <Icon name="X" size={28} />
          </button>
          <div className="flex flex-col items-center gap-3" onClick={e => e.stopPropagation()}>
            <img src={active.url} alt={active.alt || ""} className="max-w-full max-h-[85vh] rounded-2xl object-contain" />
            {active.caption && <p className="text-white/80 text-sm text-center">{active.caption}</p>}
          </div>
        </div>
      )}
    </>
  );
}

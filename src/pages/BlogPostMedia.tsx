import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import { Post } from "./useBlogPostData";

function VideoThumb({ url }: { url: string }) {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  return (
    <div className="w-full rounded-2xl overflow-hidden bg-gray-900 relative">
      <video ref={ref} src={url} className="w-full" playsInline preload="metadata" controls={playing} onEnded={() => setPlaying(false)} />
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={() => { setPlaying(true); ref.current?.play(); }}>
          <div className="bg-black/50 rounded-full p-4"><Icon name="Play" size={36} className="text-white" /></div>
        </div>
      )}
    </div>
  );
}

interface BlogPostMediaProps {
  post: Post;
  onOpenLightbox: (url: string) => void;
}

export default function BlogPostMedia({ post, onOpenLightbox }: BlogPostMediaProps) {
  return (
    <>
      {/* Медиа (фото и видео) */}
      {post.media?.filter(m => m.type !== "document").length > 0 && (() => {
        const visMedia = post.media.filter(m => m.type !== "document");
        const cols = visMedia.length === 1 ? "grid-cols-1" : visMedia.length === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3";
        return (
          <div className={`grid gap-3 mb-6 ${cols}`}>
            {visMedia.map((m, i) =>
              m.type === "video" ? (
                <div key={i} className={visMedia.length === 1 ? "" : "aspect-square overflow-hidden rounded-2xl"}>
                  <VideoThumb url={m.url} />
                </div>
              ) : (
                <div key={i} className="flex flex-col gap-1">
                  <div className={`rounded-2xl overflow-hidden cursor-pointer ${visMedia.length === 1 ? "" : "aspect-square"}`} onClick={() => onOpenLightbox(m.url)}>
                    <img src={m.url} alt={m.alt || post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                  {m.caption && (
                    <p className="text-xs text-gray-500 text-center px-1 leading-snug">{m.caption}</p>
                  )}
                </div>
              )
            )}
          </div>
        );
      })()}

      {/* Документы */}
      {post.media?.filter(m => m.type === "document").length > 0 && (
        <div className="flex flex-col gap-2 mb-6">
          <p className="text-xs font-bold text-gray-500 mb-1">Прикреплённые документы</p>
          {post.media.filter(m => m.type === "document").map((m, i) => {
            const ext = m.url.split('.').pop()?.toLowerCase() || '';
            const isPdf = ext === 'pdf';
            return (
              <a
                key={i}
                href={m.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-2xl px-4 py-3 transition-colors group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-xs ${isPdf ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
                  {isPdf ? "PDF" : "DOC"}
                </div>
                <span className="text-sm font-semibold text-blue-700 group-hover:text-blue-800 truncate flex-1">
                  {m.name || `Документ.${ext}`}
                </span>
                <Icon name="Download" size={16} className="text-blue-400 shrink-0" />
              </a>
            );
          })}
        </div>
      )}
    </>
  );
}

interface BlogPostLightboxProps {
  url: string;
  post: Post | null;
  onClose: () => void;
}

export function BlogPostLightbox({ url, post, onClose }: BlogPostLightboxProps) {
  const lbItem = post?.media?.find(m => m.url === url);
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <button className="absolute top-4 right-4 text-white" onClick={onClose}>
        <Icon name="X" size={32} />
      </button>
      <div className="flex flex-col items-center gap-3" onClick={e => e.stopPropagation()}>
        <img src={url} alt={lbItem?.alt || ""} className="max-w-full max-h-[85vh] object-contain rounded-xl" />
        {lbItem?.caption && <p className="text-white/80 text-sm text-center">{lbItem.caption}</p>}
      </div>
    </div>
  );
}

import { useRef } from "react";
import Icon from "@/components/ui/icon";
import { MediaItem } from "./constants";

interface PostMediaFieldsProps {
  teacherPhoto: string;
  setTeacherPhoto: (v: string) => void;
  teacherName: string;
  setTeacherName: (v: string) => void;
  mediaItems: MediaItem[];
  setMediaItems: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  videoUrl: string;
  setVideoUrl: (v: string) => void;
  uploadingMedia: boolean;
  setUploadingMedia: (v: boolean) => void;
  compressImage: (dataUrl: string, maxSize?: number) => Promise<string>;
  uploadToS3: (dataUrl: string, fileName?: string) => Promise<string>;
}

export default function PostMediaFields({
  teacherPhoto, setTeacherPhoto,
  teacherName, setTeacherName,
  mediaItems, setMediaItems,
  videoUrl, setVideoUrl,
  uploadingMedia, setUploadingMedia,
  compressImage, uploadToS3,
}: PostMediaFieldsProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const docRef = useRef<HTMLInputElement>(null);
  const teacherPhotoRef = useRef<HTMLInputElement>(null);

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (fileRef.current) fileRef.current.value = "";
    if (!files.length) return;
    files.forEach(file => {
      setUploadingMedia(true);
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const dataUrl = ev.target?.result as string;
          const prepared = await compressImage(dataUrl);
          const cdnUrl = await uploadToS3(prepared);
          setMediaItems(prev => [...prev, { type: "image", url: cdnUrl }]);
        } finally {
          setUploadingMedia(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDocAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (docRef.current) docRef.current.value = "";
    if (!files.length) return;
    files.forEach(file => {
      setUploadingMedia(true);
      const reader = new FileReader();
      reader.onload = async (ev) => {
        try {
          const dataUrl = ev.target?.result as string;
          const cdnUrl = await uploadToS3(dataUrl, file.name);
          setMediaItems(prev => [...prev, { type: "document", url: cdnUrl, name: file.name }]);
        } finally {
          setUploadingMedia(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (i: number) => {
    setMediaItems(prev => prev.filter((_, idx) => idx !== i));
  };

  return (
    <>
      {/* AUTHOR */}
      <div>
        <label className="text-xs font-bold text-gray-500 mb-1.5 block">Автор (необязательно)</label>
        <div className="flex items-center gap-4">
          {teacherPhoto ? (
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-orange-300 shrink-0">
              <img src={teacherPhoto} className="w-full h-full object-cover" alt="Автор" />
              <button type="button" onClick={() => setTeacherPhoto("")} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Icon name="X" size={20} className="text-white" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => teacherPhotoRef.current?.click()}
              className="w-16 h-16 rounded-full border-2 border-dashed border-orange-200 hover:border-orange-400 flex items-center justify-center text-orange-300 hover:text-orange-400 transition-colors shrink-0"
            >
              <Icon name="UserRound" size={22} />
            </button>
          )}
          <div className="flex-1">
            <input
              type="text"
              className="w-full border border-gray-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              placeholder="Имя автора (необязательно)"
              value={teacherName}
              onChange={e => setTeacherName(e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">Фото и имя появятся рядом с текстом поста</p>
          </div>
        </div>
        <input
          ref={teacherPhotoRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={async e => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async ev => {
              const compressed = await compressImage(ev.target?.result as string, 400);
              const cdnUrl = await uploadToS3(compressed);
              setTeacherPhoto(cdnUrl);
            };
            reader.readAsDataURL(file);
            if (teacherPhotoRef.current) teacherPhotoRef.current.value = "";
          }}
        />
      </div>

      {/* MEDIA */}
      <div>
        <label className="text-xs font-bold text-gray-500 mb-1.5 block">Фото</label>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploadingMedia}
          className="flex items-center gap-2 border-2 border-dashed border-orange-200 hover:border-orange-400 text-orange-400 hover:text-orange-500 rounded-2xl px-5 py-3 text-sm font-semibold transition-colors disabled:opacity-60"
        >
          <Icon name={uploadingMedia ? "Loader2" : "ImagePlus"} size={18} className={uploadingMedia ? "animate-spin" : ""} />
          {uploadingMedia ? "Загружаем..." : "Добавить фото"}
        </button>
        <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileAdd} />
        {mediaItems.filter(m => m.type === "image").length > 0 && (
          <div className="flex flex-col gap-3 mt-3">
            {mediaItems.map((m, i) => m.type === "image" && (
              <div key={i} className="flex gap-3 items-start bg-orange-50 border border-orange-100 rounded-2xl p-3">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 group shrink-0">
                  <img src={m.url} alt={m.alt || ""} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeMedia(i)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Alt-текст: что изображено + для кого + ключ (для SEO)"
                    value={m.alt || ""}
                    onChange={e => setMediaItems(prev => prev.map((item, idx) => idx === i ? { ...item, alt: e.target.value } : item))}
                    className="w-full border border-orange-200 bg-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-400"
                  />
                  <input
                    type="text"
                    placeholder="Подпись под фото (необязательно)"
                    value={m.caption || ""}
                    onChange={e => setMediaItems(prev => prev.map((item, idx) => idx === i ? { ...item, caption: e.target.value } : item))}
                    className="w-full border border-orange-200 bg-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-orange-400"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DOCUMENTS */}
      <div>
        <label className="text-xs font-bold text-gray-500 mb-1.5 block">Документы (PDF, Word)</label>
        <button
          type="button"
          onClick={() => docRef.current?.click()}
          disabled={uploadingMedia}
          className="flex items-center gap-2 border-2 border-dashed border-blue-200 hover:border-blue-400 text-blue-400 hover:text-blue-500 rounded-2xl px-5 py-3 text-sm font-semibold transition-colors disabled:opacity-60"
        >
          <Icon name={uploadingMedia ? "Loader2" : "Paperclip"} size={18} className={uploadingMedia ? "animate-spin" : ""} />
          {uploadingMedia ? "Загружаем..." : "Прикрепить документ"}
        </button>
        <input
          ref={docRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={handleDocAdd}
        />
        {mediaItems.filter(m => m.type === "document").length > 0 && (
          <div className="flex flex-col gap-2 mt-3">
            {mediaItems.map((m, i) => m.type === "document" && (
              <div key={i} className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-2.5">
                <Icon name="FileText" size={18} className="text-blue-400 shrink-0" />
                <span className="text-sm text-blue-700 font-semibold truncate flex-1">{m.name || "Документ"}</span>
                <button type="button" onClick={() => removeMedia(i)} className="text-gray-400 hover:text-red-500 transition-colors shrink-0">
                  <Icon name="X" size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* VIDEO URL */}
      <div>
        <label className="text-xs font-bold text-gray-500 mb-1.5 block">Видео (необязательно)</label>
        <div className="relative">
          <input
            type="url"
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 pl-11 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            placeholder="Вставьте ссылку на видео из хранилища..."
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
          />
          <Icon name="Video" size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          {videoUrl && (
            <button type="button" onClick={() => setVideoUrl("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <Icon name="X" size={16} />
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1.5">Загрузите видео в Ядро → Хранилище, скопируйте ссылку и вставьте сюда</p>
        {videoUrl && (
          <video src={videoUrl} controls className="mt-3 w-full rounded-2xl max-h-48 bg-black" />
        )}
      </div>
    </>
  );
}

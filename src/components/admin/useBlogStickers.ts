import { useEffect, useState } from "react";
import { TOKEN_KEY, STICKERS_API } from "./constants";

export default function useBlogStickers() {
  const [stickers, setStickers] = useState<Record<string, string>>({});
  const [stickerEdits, setStickerEdits] = useState<Record<string, string>>({});
  const [savingSticker, setSavingSticker] = useState<string | null>(null);
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [descriptionEdits, setDescriptionEdits] = useState<Record<string, string>>({});
  const [savingDescription, setSavingDescription] = useState<string | null>(null);

  const loadStickers = async () => {
    const res = await fetch(STICKERS_API);
    const data = await res.json();
    const s = data.stickers || {};
    const d = data.descriptions || {};
    setStickers(s);
    setStickerEdits(s);
    setDescriptions(d);
    setDescriptionEdits(d);
  };

  useEffect(() => { loadStickers(); }, []);

  const saveSticker = async (categoryId: string) => {
    setSavingSticker(categoryId);
    const text = (stickerEdits[categoryId] || "").trim();
    if (text) {
      await fetch(STICKERS_API, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "X-Authorization": localStorage.getItem(TOKEN_KEY) || "" },
        body: JSON.stringify({ category_id: categoryId, sticker_text: text }),
      });
    } else {
      await fetch(STICKERS_API, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "X-Authorization": localStorage.getItem(TOKEN_KEY) || "" },
        body: JSON.stringify({ category_id: categoryId }),
      });
    }
    await loadStickers();
    setSavingSticker(null);
  };

  const saveDescription = async (categoryId: string) => {
    setSavingDescription(categoryId);
    const text = (descriptionEdits[categoryId] || "").trim();
    await fetch(STICKERS_API, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "X-Authorization": localStorage.getItem(TOKEN_KEY) || "" },
      body: JSON.stringify({ category_id: categoryId, description: text }),
    });
    await loadStickers();
    setSavingDescription(null);
  };

  return {
    stickers, stickerEdits, setStickerEdits, savingSticker,
    descriptions, descriptionEdits, setDescriptionEdits, savingDescription,
    saveSticker, saveDescription,
  };
}

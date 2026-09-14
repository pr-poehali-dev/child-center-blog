import { useRef, useState } from "react";

/**
 * Антиспам-защита для публичных форм (подписка, отзывы):
 * - honeypot: скрытое поле "company", боты его заполняют, люди — нет
 * - тайминг: с момента загрузки формы до отправки должно пройти не менее 5 секунд
 *
 * Использование:
 *   const { honeypot, setHoneypot, isSpam, formLoadedAt } = useAntiSpam();
 *   ...
 *   if (isSpam()) return; // тихо прерываем отправку, ничего не шлём
 *   fetch(API, { body: JSON.stringify({ ...data, company: honeypot, form_loaded_at: formLoadedAt }) })
 */
export function useAntiSpam() {
  const [honeypot, setHoneypot] = useState("");
  const formLoadedAt = useRef(Date.now());

  const isSpam = () => {
    if (honeypot.trim()) return true;
    if (Date.now() - formLoadedAt.current < 5000) return true;
    return false;
  };

  return { honeypot, setHoneypot, isSpam, formLoadedAt: formLoadedAt.current };
}

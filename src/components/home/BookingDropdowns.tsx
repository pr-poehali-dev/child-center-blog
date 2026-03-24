import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";
import { MAX_LINK, TG_LINK } from "./constants";

function DropdownMenu({ onClose, onFormClick }: { onClose: () => void; onFormClick?: () => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 min-w-max">
      {onFormClick && (
        <>
          <button
            onClick={() => { onFormClick(); onClose(); }}
            className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors font-bold text-gray-700 w-full text-left whitespace-nowrap"
          >
            <span className="text-xl">📋</span>
            Заполнить форму
          </button>
          <div className="border-t border-gray-100" />
        </>
      )}
      <a
        href={MAX_LINK}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose}
        className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors font-bold text-gray-700 whitespace-nowrap"
      >
        <span className="text-xl">💬</span>
        Написать в MAX
      </a>
      <div className="border-t border-gray-100" />
      <a
        href={TG_LINK}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClose}
        className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors font-bold text-gray-700 whitespace-nowrap"
      >
        <span className="text-xl">✈️</span>
        Написать в Telegram
      </a>
    </div>
  );
}

export function ContactDropdown({ label, className, wrapperClassName }: { label: string; className: string; wrapperClassName?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className={`relative ${wrapperClassName || ""}`}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-center gap-2 w-full font-bold px-8 py-4 rounded-full text-lg transition-all hover:shadow-lg hover:-translate-y-0.5 ${className}`}
      >
        {label}
        <Icon name={open ? "ChevronUp" : "ChevronDown"} size={20} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2">
          <DropdownMenu onClose={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}

export function NavBookingDropdown({ onFormClick }: { onFormClick: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 bg-orange-400 hover:bg-orange-500 text-white text-sm font-bold px-5 py-2 rounded-full transition-all hover:shadow-md"
      >
        Записаться на экскурсию
        <Icon name={open ? "ChevronUp" : "ChevronDown"} size={16} />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-2">
          <DropdownMenu onClose={() => setOpen(false)} onFormClick={onFormClick} />
        </div>
      )}
    </div>
  );
}

export function BookingDropdown({ onFormClick, className }: { onFormClick: () => void; className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className={`relative ${className || ""}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center gap-2 w-full bg-orange-400 hover:bg-orange-500 text-white font-bold px-8 py-4 rounded-full text-lg transition-all hover:shadow-lg hover:-translate-y-0.5"
      >
        Записаться на экскурсию
        <Icon name={open ? "ChevronUp" : "ChevronDown"} size={20} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2">
          <DropdownMenu onClose={() => setOpen(false)} onFormClick={onFormClick} />
        </div>
      )}
    </div>
  );
}
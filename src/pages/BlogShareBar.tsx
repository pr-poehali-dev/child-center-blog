import { toast } from "sonner";
import Icon from "@/components/ui/icon";

interface BlogShareBarProps {
  url: string;
  title: string;
}

const MAX_LINK = "https://max.ru/u/f9LHodD0cOIKcG0itfDWIZMQp22OCCCC7iCwIUARylW6FIn7W2H3IZ-imyY";

const btnClass =
  "group flex items-center justify-center flex-shrink-0 w-11 h-11 md:w-10 md:h-10 rounded-full border-2 border-[#D9A441] hover:bg-[#D9A441] transition-colors";
const iconClass = "text-[#D9A441] group-hover:text-white transition-colors";

function VkIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-7 h-7 md:w-5 md:h-5 text-[#D9A441] group-hover:text-white transition-colors"
    >
      <polyline points="4,6 8,16 12,6" />
      <line x1="14" y1="6" x2="14" y2="16" />
      <polyline points="20,6 14,11 20,16" />
    </svg>
  );
}

export default function BlogShareBar({ url, title }: BlogShareBarProps) {
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    toast.success("Ссылка скопирована", { duration: 2000 });
  };

  return (
    <div className="flex items-center gap-4">
      <a
        href={`https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Поделиться ВКонтакте"
        className={btnClass}
      >
        <VkIcon />
      </a>

      <a
        href={MAX_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Написать в MAX"
        className={btnClass}
      >
        <Icon name="MessageCircle" className={`w-7 h-7 md:w-5 md:h-5 ${iconClass}`} />
      </a>

      <button
        type="button"
        onClick={copyLink}
        aria-label="Скопировать ссылку"
        className={btnClass}
      >
        <Icon name="Link" className={`w-7 h-7 md:w-5 md:h-5 ${iconClass}`} />
      </button>
    </div>
  );
}
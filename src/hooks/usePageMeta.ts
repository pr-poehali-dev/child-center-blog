import { useEffect } from "react";

const LOGO = "https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/badbdcbb-25d9-4f41-a4b9-b704f68d9351.png";

interface PageMetaOptions {
  title: string;
  description: string;
  url?: string;
  image?: string;
  type?: "website" | "article";
}

export function usePageMeta({ title, description, url, image, type = "website" }: PageMetaOptions) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute("name", name); document.head.appendChild(el); }
      el.content = content;
    };
    const setOg = (prop: string, content: string) => {
      let el = document.querySelector(`meta[property="${prop}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.setAttribute("property", prop); document.head.appendChild(el); }
      el.content = content;
    };

    setMeta("description", description);
    setOg("og:title", title);
    setOg("og:description", description);
    setOg("og:type", type);
    if (url) setOg("og:url", url);
    setOg("og:image", image || LOGO);

    return () => { document.title = prevTitle; };
  }, [title, description, url, image, type]);
}

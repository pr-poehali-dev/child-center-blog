import { useState, useEffect } from "react";
import HomeBlogSection, { STICKERS_API } from "./HomeBlogSection";
import HomeTeamSection from "./HomeTeamSection";
import HomeReviewsSection from "./HomeReviewsSection";
import HomeContactsSection from "./HomeContactsSection";

interface HomeSectionsProps {
  onFormClick: () => void;
}

export default function HomeSections({ onFormClick }: HomeSectionsProps) {
  const [stickers, setStickers] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch(STICKERS_API).then(r => r.json()).then(d => setStickers(d.stickers || {})).catch(() => {});
  }, []);

  return (
    <>
      <HomeBlogSection stickers={stickers} />
      <HomeTeamSection />
      <HomeReviewsSection />
      <HomeContactsSection onFormClick={onFormClick} />
    </>
  );
}

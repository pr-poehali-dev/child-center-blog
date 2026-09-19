import { useState } from "react";
import Icon from "@/components/ui/icon";
import WatercolorWave from "@/components/home/WatercolorWave";
import honeyStar from "@/assets/honey-star.png";
import { trackGoal } from "@/lib/analytics";
import { MAX_LINK } from "@/pages/blog-types";

interface Direction {
  label: string;
  href: string;
  direction: string;
}

// Ссылки-мосты на разделы основного сайта ribkadollilend.ru. UTM-метки (utm_source=blog,
// utm_medium=bridge, utm_content=<direction>) уже зашиты в href — не пересобирать через
// withBlogUtm, чтобы не разъехались с тем, что размечено на стороне сайта.
// direction — значение параметра "direction" в цели Метрики direction_click (совпадает с utm_content).
const DIRECTIONS: Direction[] = [
  { label: "Пробное занятие и экскурсия", href: "https://ribkadollilend.ru/?utm_source=blog&utm_medium=bridge&utm_content=tour#tour", direction: "tour" },
  { label: "Ясли", href: "https://ribkadollilend.ru/yasli/?utm_source=blog&utm_medium=bridge&utm_content=yasli", direction: "yasli" },
  { label: "4-5 лет: Фундамент", href: "https://ribkadollilend.ru/podgotovka-k-shkole/?utm_source=blog&utm_medium=bridge&utm_content=foundation#4-5", direction: "school" },
  { label: "5-7 лет: Предшкольная", href: "https://ribkadollilend.ru/podgotovka-k-shkole/?utm_source=blog&utm_medium=bridge&utm_content=school#5-7", direction: "school" },
  { label: "Продлёнка", href: "https://ribkadollilend.ru/prodlenka/?utm_source=blog&utm_medium=bridge&utm_content=prodlenka", direction: "prodlenka" },
  { label: "Летний клуб", href: "https://ribkadollilend.ru/letniy-klub/?utm_source=blog&utm_medium=bridge&utm_content=letniy", direction: "letniy" },
];

export default function BlogDirectionPicker() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative overflow-hidden" style={{ background: "#FBF6EE", borderRadius: 20, boxShadow: "0 2px 5px rgba(0,0,0,0.05), 0 14px 28px rgba(0,0,0,0.08)" }}>
      <div className="relative p-7">
        <div className="flex items-start gap-4">
          <img src={honeyStar} alt="" className="w-10 h-10 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-playfair font-bold leading-tight" style={{ color: "#17364A", fontSize: 21 }}>Выберите направление</h3>
            <p className="font-golos mt-1 mb-4" style={{ color: "#4B4B4B", fontSize: 14.5 }}>
              Блог читается — центр помогает: выберите то, что сейчас важно вашей семье
            </p>

            <button
              onClick={() => setOpen(!open)}
              className="flex items-center justify-between gap-2 w-full text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors"
              style={{ background: "#E8985F" }}
            >
              Показать направления
              <Icon name={open ? "ChevronUp" : "ChevronDown"} size={18} />
            </button>

            {open && (
              <div className="mt-3 bg-white rounded-xl border overflow-hidden" style={{ borderColor: "#EADFC8" }}>
                {DIRECTIONS.map((d, i) => (
                  <a
                    key={d.label}
                    href={d.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackGoal("direction_click", { direction: d.direction, target: d.href })}
                    className="flex items-center justify-between gap-2 px-5 py-3.5 font-golos font-semibold text-sm transition-colors hover:bg-[#FBF6EE]"
                    style={{
                      color: "#17364A",
                      borderTop: i === 0 ? "none" : "1px solid #F1E9D8",
                    }}
                  >
                    {d.label}
                    <Icon name="ArrowRight" size={16} style={{ color: "#D9A441" }} />
                  </a>
                ))}
              </div>
            )}

            <p className="font-golos mt-4" style={{ color: "#4B4B4B", fontSize: 13.5 }}>
              Трудно выбрать — напишите нам, подскажем:{" "}
              <a href="tel:+79881521698" className="font-bold hover:underline" style={{ color: "#17364A" }}>+7 (988) 152-16-98</a>
              {" "}или{" "}
              <a href={MAX_LINK} target="_blank" rel="noopener noreferrer" className="font-bold hover:underline" style={{ color: "#17364A" }}>в MAX</a>
            </p>
          </div>
        </div>
      </div>
      <WatercolorWave />
    </div>
  );
}
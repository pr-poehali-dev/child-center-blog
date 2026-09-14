import Icon from "@/components/ui/icon";
import WatercolorWave from "@/components/home/WatercolorWave";
import honeyStar from "@/assets/honey-star.png";

interface BrandBridgeCardProps {
  href: string;
  title: string;
  subtitle: string;
  buttonLabel?: string;
  className?: string;
}

export default function BrandBridgeCard({ href, title, subtitle, buttonLabel = "Записаться", className = "" }: BrandBridgeCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative overflow-hidden flex flex-col justify-between gap-4 transition-transform hover:-translate-y-0.5 ${className}`}
      style={{
        background: "#FBF6EE",
        borderRadius: 18,
        padding: "22px 22px 26px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.05), 0 12px 24px rgba(0,0,0,0.07)",
      }}
    >
      <img src={honeyStar} alt="" className="absolute" style={{ width: 22, height: 22, top: 14, left: 14 }} />
      <div className="pl-8">
        <div className="font-playfair font-bold leading-snug" style={{ color: "#17364A", fontSize: 21 }}>
          {title}
        </div>
        <p className="font-golos mt-1.5" style={{ color: "#4B4B4B", fontSize: 14.5, lineHeight: 1.5 }}>
          {subtitle}
        </p>
      </div>
      <div className="pl-8">
        <span
          className="inline-flex items-center gap-2 font-golos font-bold text-white rounded-full px-5 py-2.5 text-sm transition-colors"
          style={{ background: "#E8985F" }}
        >
          {buttonLabel}
          <Icon name="ArrowRight" size={16} />
        </span>
      </div>
      <WatercolorWave />
    </a>
  );
}

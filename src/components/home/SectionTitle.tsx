import BrushUnderline from "./BrushUnderline";

interface SectionTitleProps {
  overline: string;
  title: string;
  description?: string;
  className?: string;
}

export default function SectionTitle({ overline, title, description, className = "" }: SectionTitleProps) {
  return (
    <div className={`text-center mb-14 ${className}`}>
      <div
        className="font-caveat text-2xl mb-2 lowercase inline-block"
        style={{ color: "#D9A441", transform: "rotate(-2deg)" }}
      >
        {overline}
      </div>
      <div className="flex justify-center">
        <h2
          className="relative inline-block font-nunito font-extrabold leading-tight text-4xl md:text-[54px]"
          style={{ color: "#17364A" }}
        >
          {title}
          <BrushUnderline />
        </h2>
      </div>
      {description && (
        <p className="text-gray-500 mt-4 text-lg">{description}</p>
      )}
    </div>
  );
}

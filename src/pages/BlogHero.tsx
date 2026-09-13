import ThinUnderline from "@/components/home/ThinUnderline";

export default function BlogHero() {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-10 pb-8 md:pt-14 md:pb-10">
      <div className="flex flex-col md:flex-row items-center md:items-end gap-3 md:gap-7 justify-center md:justify-start">
        <img
          src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/a61ef601-cf1f-486b-8244-2de109b4afc1.png"
          alt="рыбка Долли машет"
          className="h-[100px] md:h-[150px] w-auto object-contain flex-shrink-0"
        />
        <div className="text-center md:text-left">
          <div
            className="font-caveat text-2xl md:text-[26px] mb-1 lowercase inline-block"
            style={{ color: "#D9A441" }}
          >
            здесь живут наши истории
          </div>
          <div className="flex justify-center md:justify-start">
            <h1
              className="relative inline-block font-playfair font-bold leading-tight text-4xl md:text-[42px] whitespace-nowrap"
              style={{ color: "#17364A" }}
            >
              Все статьи блога
              <ThinUnderline />
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

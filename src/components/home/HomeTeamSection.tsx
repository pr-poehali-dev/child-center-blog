import Icon from "@/components/ui/icon";
import { TEAM } from "./constants";

export default function HomeTeamSection() {
  return (
    <section id="team" className="py-24" style={{ background: "#E1F0FA" }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="font-caveat text-orange-400 text-2xl mb-2">Команда</div>
          <h2 className="font-black text-4xl text-[#175064]">Наши педагоги</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <video
            src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/8393d0ab-cc73-4e76-b85c-c3a4cf0b36dc.mp4"
            className="rounded-3xl shadow-2xl w-full object-contain"
            autoPlay
            muted
            loop
            playsInline
          />
          <div>
            <p className="text-gray-600 text-lg leading-relaxed">
              В нашем центре работают люди, любящие детей и своё дело. Они получают только положительные отзывы от родителей и умеют найти подход к любому ребёнку.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mt-4">
              Такое возможно только тогда, когда люди искренне любят свою работу, когда им комфортно на своём рабочем месте, когда это их профессия. Мы гордимся своими кадрами, помогаем им развиваться и легко идти по дороге своей профессии.
            </p>
            <div className="mt-6">
              <Icon name="Heart" size={36} className="text-red-400" strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
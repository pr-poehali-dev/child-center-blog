import { TEAM, TeamCard } from "./constants";
import SectionTitle from "./SectionTitle";

function TeamCardView({ card }: { card: TeamCard }) {
  return (
    <div
      className="bg-white overflow-hidden flex flex-col"
      style={{
        borderRadius: 18,
        boxShadow: "0 2px 6px rgba(0,0,0,0.06), 0 14px 28px rgba(0,0,0,0.08)",
      }}
    >
      <div className="w-full overflow-hidden bg-gray-100" style={{ aspectRatio: "4 / 5" }}>
        <img src={card.photo} alt={card.people.map(p => p.name).join(", ")} className="w-full h-full object-cover" />
      </div>
      <div className="px-5 py-5 text-center flex-1 flex flex-col justify-center gap-1">
        {card.people.map((p, i) => (
          <div key={i}>
            <div className="font-playfair font-bold" style={{ color: "#17364A", fontSize: 21 }}>
              {p.name}
            </div>
            <div className="font-caveat" style={{ color: "#D9A441", fontSize: 19 }}>
              {p.role}
            </div>
          </div>
        ))}
        <p className="text-gray-600 mt-2" style={{ fontSize: 14.5 }}>
          {card.desc}
        </p>
      </div>
    </div>
  );
}

export default function HomeTeamSection() {
  const topRow = TEAM.slice(0, 3);
  const bottomRow = TEAM.slice(3, 5);

  return (
    <section id="team" className="py-14" style={{ background: "#E1F0FA" }}>
      <div className="max-w-6xl mx-auto px-4">
        <SectionTitle overline="сердце дома" title="Наша команда" />

        <div className="hidden md:block">
          <div className="grid grid-cols-3 gap-6">
            {topRow.map((card, i) => (
              <TeamCardView key={i} card={card} />
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-6">
            {bottomRow.map((card, i) => (
              <div key={i} className="w-full" style={{ maxWidth: "calc((100% - 3rem) / 3)" }}>
                <TeamCardView card={card} />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:hidden">
          {TEAM.map((card, i) => (
            <TeamCardView key={i} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
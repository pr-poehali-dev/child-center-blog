import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { NAV_LINKS } from "./constants";
import { NavBookingDropdown } from "./BookingDropdowns";

interface HomeNavbarProps {
  activeSection: string;
  onFormClick: () => void;
}

export default function HomeNavbar({ activeSection, onFormClick }: HomeNavbarProps) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    if (id === "blog-link") {
      setMenuOpen(false);
      navigate("/blog");
      return;
    }
    if (id === "contacts-link") {
      setMenuOpen(false);
      navigate("/contacts");
      return;
    }
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm border-b border-orange-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <button onClick={() => scrollTo("home")} className="flex items-center gap-2">
          <img src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/badbdcbb-25d9-4f41-a4b9-b704f68d9351.png" alt="Рыбка Долли" className="h-10 w-auto" />
        </button>
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((l) => (
            <button
              key={l.label}
              onClick={() => scrollTo(l.id)}
              className="font-golos font-medium text-[15px] transition-colors relative pb-0.5"
              style={{
                letterSpacing: "0.2px",
                color: activeSection === l.id ? "#D9A441" : "#17364A",
                borderBottom: activeSection === l.id ? "1.5px solid #D9A441" : "1.5px solid transparent",
              }}
            >
              {l.label}
            </button>
          ))}
          <a
            href="tel:+79881521698"
            className="font-golos font-bold whitespace-nowrap transition-colors"
            style={{ fontSize: 16.5, color: "#17364A" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#D9A441"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "#17364A"; }}
          >
            <span className="inline-flex items-center gap-1.5">
              <Icon name="Phone" size={16} />
              +7 (988) 152-16-98
            </span>
          </a>
          <NavBookingDropdown onFormClick={onFormClick} />
        </div>
        <button className="md:hidden text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
          <Icon name={menuOpen ? "X" : "Menu"} size={24} />
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-orange-100 px-4 py-3 flex flex-col gap-3">
          {NAV_LINKS.map((l) => (
            <button
              key={l.label}
              onClick={() => scrollTo(l.id)}
              className="text-left font-golos font-medium py-1 w-fit"
              style={{
                fontSize: 15,
                letterSpacing: "0.2px",
                color: activeSection === l.id ? "#D9A441" : "#17364A",
                borderBottom: activeSection === l.id ? "1.5px solid #D9A441" : "1.5px solid transparent",
              }}
            >
              {l.label}
            </button>
          ))}
          <a href="tel:+79881521698" className="flex items-center gap-1.5 font-golos font-bold py-1 whitespace-nowrap" style={{ fontSize: 16.5, color: "#17364A" }}>
            <Icon name="Phone" size={16} />
            +7 (988) 152-16-98
          </a>
          <NavBookingDropdown onFormClick={onFormClick} />
          <button
            onClick={() => { setMenuOpen(false); document.getElementById("popular-posts")?.scrollIntoView({ behavior: "smooth" }); }}
            className="flex items-center gap-2 font-black px-4 py-2 rounded-full text-sm w-fit text-[#175064]"
            style={{ background: "linear-gradient(135deg, #ffe9d8, #dff3ea, #e1f0fa)", boxShadow: "0 4px 0 #17506433" }}
          >
            <img
              src="/dolli-mascot.png"
              alt="рыбка Долли"
              className="w-6 h-6 object-contain"
            />
            Статьи в топе
          </button>
        </div>
      )}
    </nav>
  );
}
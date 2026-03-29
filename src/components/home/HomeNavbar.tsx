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
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className={`text-sm font-semibold transition-colors hover:text-orange-500 ${activeSection === l.id ? "text-orange-500" : "text-gray-600"}`}
            >
              {l.label}
            </button>
          ))}
          <NavBookingDropdown onFormClick={onFormClick} />
        </div>
        <button className="md:hidden text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
          <Icon name={menuOpen ? "X" : "Menu"} size={24} />
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-orange-100 px-4 py-3 flex flex-col gap-3">
          {NAV_LINKS.map((l) => (
            <button key={l.id} onClick={() => scrollTo(l.id)} className="text-left text-sm font-semibold text-gray-600 hover:text-orange-500 py-1">
              {l.label}
            </button>
          ))}
          <NavBookingDropdown onFormClick={onFormClick} />
          <button
            onClick={() => { setMenuOpen(false); document.getElementById("popular-posts-list")?.scrollIntoView({ behavior: "smooth" }); }}
            className="flex items-center gap-2 font-black px-4 py-2 rounded-full text-sm w-fit text-white"
            style={{ background: "linear-gradient(135deg, #fb923c, #f472b6, #a78bfa)", boxShadow: "0 4px 0 #a855f788" }}
          >
            <img
              src="https://cdn.poehali.dev/projects/891591f8-ea8a-4dbb-94f9-151d66af9489/bucket/541fd8a8-5245-4d70-8595-dad96bdd5912.png"
              alt="клякса"
              className="w-6 h-6 object-contain"
            />
            Статьи в топе
          </button>
        </div>
      )}
    </nav>
  );
}
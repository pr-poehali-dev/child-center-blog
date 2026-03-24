import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeNavbar from "@/components/home/HomeNavbar";
import HomeHero from "@/components/home/HomeHero";
import HomeSections from "@/components/home/HomeSections";
import BookingModal from "@/components/home/BookingModal";

export default function Index() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");
  const [bookingOpen, setBookingOpen] = useState(false);

  const scrollTo = (id: string) => {
    if (id === "blog-link") {
      navigate("/blog");
      return;
    }
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const openBooking = () => {
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fffdf8] font-nunito text-gray-700">
      <HomeNavbar activeSection={activeSection} onFormClick={openBooking} />
      <HomeHero onFormClick={openBooking} onScrollTo={scrollTo} />
      <HomeSections onFormClick={openBooking} />
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}

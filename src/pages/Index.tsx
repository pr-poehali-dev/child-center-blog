import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeNavbar from "@/components/home/HomeNavbar";
import HomeHero from "@/components/home/HomeHero";
import EasterBanner from "@/components/home/EasterBanner";
import HomeSections from "@/components/home/HomeSections";
import BookingModal from "@/components/home/BookingModal";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function Index() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("home");
  const [bookingOpen, setBookingOpen] = useState(false);

  usePageMeta({
    title: "Детский центр «Рыбка Долли» — Керчь | Развитие, английский, продлёнка",
    description: "Детский центр «Рыбка Долли» в Керчи — занятия для детей от 2 лет, английский язык, логопед, подготовка к школе, группа продлённого дня, летний клуб. 8 лет работаем! Первое занятие бесплатно. Запись: +7 (988) 152-16-98",
    url: "https://blogribkadolli.ru/",
    type: "website",
  });

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
      <div className="pt-16">
      <EasterBanner />
      <HomeHero onFormClick={openBooking} onScrollTo={scrollTo} />
      <HomeSections onFormClick={openBooking} />
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
      </div>
    </div>
  );
}
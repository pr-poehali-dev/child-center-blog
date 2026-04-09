import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import QA from "./pages/QA";
import NotFound from "./pages/NotFound";
import Contacts from "./pages/Contacts";
import Unsubscribe from "./pages/Unsubscribe";
import FloatingSubscribe from "@/components/ui/FloatingSubscribe";
import EasterEggWidget from "@/components/ui/EasterEggWidget";

const queryClient = new QueryClient();
const EASTER_ACTIVE = new Date() < new Date("2026-04-15T00:00:00");
const isMobile = () => window.innerWidth < 768;

const App = () => {
  const [eggDone, setEggDone] = useState(false);
  const mobile = isMobile();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <FloatingSubscribe hidden={EASTER_ACTIVE && !eggDone && !mobile} />
          {EASTER_ACTIVE && !mobile && <EasterEggWidget onDone={() => setEggDone(true)} />}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/qa" element={<QA />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
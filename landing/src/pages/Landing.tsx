import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTheme } from "@/hooks/use-theme";

// Import refactored components
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import TechSection from "@/components/landing/TechSection";
import UseCasesSection from "@/components/landing/UseCasesSection";
import BlogSection from "@/components/landing/BlogSection";
import DocumentationSection from "@/components/landing/DocumentationSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import { WaitlistModal } from "@/components/modals/WaitlistModal";
import { MetaTags } from "@/components/layout/MetaTags";

const Landing = () => {
  // Just import the theme hook without destructuring since it's used by child components
  useTheme();
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 100) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openWaitlistForm = () => {
    setWaitlistOpen(true);
  };

  return (
    <div className="bg-background text-foreground flex flex-col w-full min-h-screen overflow-y-auto">
      <MetaTags 
        title="Accord AI | Intelligent Contract Assistant"
        description="AI-powered contract assistant that helps you draft, review, and negotiate contracts with ease. Built with custom SLMs, LoRA fine-tuning, and RAG for superior performance."
      />
      
      <WaitlistModal 
        open={waitlistOpen}
        onOpenChange={setWaitlistOpen}
      />

      <Header isHeaderVisible={isHeaderVisible} openWaitlistForm={openWaitlistForm} />
      <main className="flex-1">
        <div className="animate-fade-in">
          <HeroSection openWaitlistForm={openWaitlistForm} />
        </div>
        <div className="animate-slide-in-up">
          <HowItWorksSection />
        </div>
        <div className="animate-fade-in">
          <FeaturesSection />
        </div>
        <div className="animate-slide-in-up">
          <TechSection />
        </div>
        <div className="animate-fade-in">
          <UseCasesSection />
        </div>
        <div className="animate-slide-in-up">
          <PricingSection />
        </div>
        <div className="animate-fade-in">
          <FAQSection />
        </div>
        <div className="animate-slide-in-up">
          <BlogSection />
        </div>
        <div className="animate-fade-in">
          <DocumentationSection />
        </div>
        <div className="animate-slide-in-up">
          <CTASection openWaitlistForm={waitlistOpen ? () => {} : openWaitlistForm} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Landing;

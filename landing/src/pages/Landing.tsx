import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTheme } from "@/contexts/ThemeContext";

// Import refactored components
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import TechSection from "@/components/landing/TechSection";
import UseCasesSection from "@/components/landing/UseCasesSection";
import BlogSection from "@/components/landing/BlogSection";
import DocumentationSection from "@/components/landing/DocumentationSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Landing = () => {
  useTheme(); // Keep the context active
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  
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
    window.open("https://form.typeform.com/to/waitlist-form-id", "_blank");
  };

  return (
    <div className="bg-background text-foreground flex flex-col w-full min-h-screen overflow-y-auto">
      <Helmet>
        <title>Accord AI | Intelligent Contract Assistant</title>
        <meta name="description" content="AI-powered contract assistant that helps you draft, review, and negotiate contracts with ease. Built with custom SLMs, LoRA fine-tuning, and RAG for superior performance." />
      </Helmet>

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
          <BlogSection />
        </div>
        <div className="animate-fade-in">
          <DocumentationSection />
        </div>
        <div className="animate-slide-in-up">
          <CTASection openWaitlistForm={openWaitlistForm} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Landing;

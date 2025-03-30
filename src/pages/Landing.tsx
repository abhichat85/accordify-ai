
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useTheme } from "@/contexts/ThemeContext";
import { Sparkles } from "lucide-react";

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
  const { colorTheme } = useTheme();
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
    <div className="bg-background text-foreground flex flex-col overflow-x-hidden">
      <Helmet>
        <title>Accord AI | Intelligent Contract Assistant</title>
        <meta name="description" content="AI-powered contract assistant that helps you draft, review, and negotiate contracts with ease. Built with custom SLMs, LoRA fine-tuning, and RAG for superior performance." />
      </Helmet>

      <Header isHeaderVisible={isHeaderVisible} openWaitlistForm={openWaitlistForm} />
      <HeroSection openWaitlistForm={openWaitlistForm} />
      <HowItWorksSection />
      <FeaturesSection />
      <TechSection />
      <UseCasesSection />
      <BlogSection />
      <DocumentationSection />
      <CTASection openWaitlistForm={openWaitlistForm} />
      <Footer />
    </div>
  );
};

export default Landing;

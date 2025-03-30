
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { BackgroundPaths } from "@/components/ui/background-paths";

// Import refactored section components
import LandingHeader from "@/components/landing/LandingHeader";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import TechnologySection from "@/components/landing/TechnologySection";
import UseCasesSection from "@/components/landing/UseCasesSection";
import BlogSection from "@/components/landing/BlogSection";
import DocumentationSection from "@/components/landing/DocumentationSection";
import CtaSection from "@/components/landing/CtaSection";
import LandingFooter from "@/components/landing/LandingFooter";

// Custom HeroBackground component
const HeroBackground = ({ className, children }: { className?: string, children: React.ReactNode }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <BackgroundPaths title="Accord AI" />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

const Landing = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const openWaitlistForm = () => {
    window.open("https://form.typeform.com/to/waitlist-form-id", "_blank");
  };

  return (
    <div className="bg-background text-foreground flex flex-col overflow-x-hidden min-h-screen">
      <Helmet>
        <title>Accord AI | Intelligent Contract Assistant</title>
        <meta name="description" content="AI-powered contract assistant that helps you draft, review, and negotiate contracts with ease. Built with custom SLMs, LoRA fine-tuning, and RAG for superior performance." />
      </Helmet>

      <LandingHeader 
        openWaitlistForm={openWaitlistForm} 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
        isHeaderVisible={isHeaderVisible} 
      />

      <main>
        <HeroBackground className="py-20 md:py-28 px-4 md:px-8 lg:px-0">
          <HeroSection openWaitlistForm={openWaitlistForm} />
        </HeroBackground>

        <section id="how-it-works" className="py-20 px-4 md:px-8 lg:px-0 bg-muted/20 texture-overlay">
          <HowItWorksSection />
        </section>

        <section id="features" className="py-20 px-4 md:px-8 lg:px-0 paper-texture">
          <FeaturesSection openWaitlistForm={openWaitlistForm} />
        </section>

        <section id="tech" className="py-20 px-4 md:px-8 lg:px-0 bg-muted/20 gradient-mesh">
          <TechnologySection />
        </section>

        <section id="use-cases" className="py-20 px-4 md:px-8 lg:px-0 texture-overlay">
          <UseCasesSection openWaitlistForm={openWaitlistForm} />
        </section>

        <section id="blog" className="py-20 px-4 md:px-8 lg:px-0 bg-muted/20 gradient-mesh">
          <BlogSection />
        </section>

        <section id="documentation" className="py-20 px-4 md:px-8 lg:px-0 paper-texture">
          <DocumentationSection />
        </section>

        <section className="py-24 px-4 md:px-8 lg:px-0 bg-muted/30 gradient-mesh">
          <CtaSection openWaitlistForm={openWaitlistForm} />
        </section>
      </main>

      <footer className="border-t border-border py-12 px-4 md:px-8 lg:px-0">
        <LandingFooter />
      </footer>
    </div>
  );
};

export default Landing;

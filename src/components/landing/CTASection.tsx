
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles } from "lucide-react";

interface CTASectionProps {
  openWaitlistForm: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ openWaitlistForm }) => {
  return (
    <section className="py-24 px-4 md:px-8 lg:px-0 bg-muted/30">
      <div className="container mx-auto max-w-5xl text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
          <Sparkles size={14} />
          <span>Limited Beta Access</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold mb-6 max-w-3xl mx-auto">
          Join the waitlist for early access to Accord AI
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          We're rolling out access to our beta program in phases. Sign up now to secure your spot and be among the first to experience the future of contract intelligence.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" onClick={openWaitlistForm} className="gap-2 rounded-full shadow-lg">
            Join Beta Waitlist <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

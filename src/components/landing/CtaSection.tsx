
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CtaSectionProps {
  openWaitlistForm: () => void;
}

const CtaSection: React.FC<CtaSectionProps> = ({ openWaitlistForm }) => {
  return (
    <div className="container mx-auto max-w-5xl text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
        <span className="flex h-2 w-2 rounded-full bg-primary"></span>
        Limited early access
      </div>
      <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to transform your contract workflow?</h2>
      <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
        Join our early access program and be among the first to experience the future of AI-powered contract management.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <Button onClick={openWaitlistForm} size="lg" className="gap-2 emboss">
          Join the waitlist <ArrowRight size={16} />
        </Button>
        <Button variant="outline" size="lg" className="gap-2 deboss">
          Schedule a demo
        </Button>
      </div>
    </div>
  );
};

export default CtaSection;

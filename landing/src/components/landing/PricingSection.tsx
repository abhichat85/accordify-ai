import * as React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AbstractBg } from "@/components/ui/abstract-bg";

interface PricingTier {
  name: string;
  description: string;
  price: string;
  features: string[];
  cta: string;
  popular?: boolean;
  comingSoon?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    description: "For individuals exploring our platform",
    price: "$0",
    features: [
      "Up to 3 contracts per month",
      "Basic contract templates",
      "Contract analysis (limited)",
      "Single user",
    ],
    cta: "Get Started",
  },
  {
    name: "Pro",
    description: "For legal professionals and small teams",
    price: "$49",
    features: [
      "Unlimited contracts",
      "All pro templates",
      "Advanced contract analysis",
      "Up to 5 team members",
      "Customizable contract elements",
      "Export to multiple formats",
      "Email & chat support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For organizations with advanced needs",
    price: "Custom",
    features: [
      "Unlimited everything",
      "Custom AI training",
      "Advanced security features",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantees",
      "On-premises deployment option",
    ],
    cta: "Contact Sales",
    comingSoon: true,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-16 md:py-24 px-4 md:px-8 relative overflow-hidden">
      <AbstractBg variant="mesh" intensity="low" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Transparent Pricing</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works best for your needs. All plans include our core AI-powered contract features.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <PricingCard key={index} tier={tier} />
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            All plans come with a 14-day free trial. No credit card required.
          </p>
          <a
            href="#faq"
            className="text-primary hover:underline font-medium"
          >
            Have questions? See our FAQ
          </a>
        </div>
      </div>
    </section>
  );
}

function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <div className={cn(
      "rounded-xl border bg-card shadow-sm overflow-hidden transition-all duration-300",
      "hover:shadow-lg hover:border-primary/50 hover:translate-y-[-4px]",
      tier.popular ? "border-primary" : "border-border"
    )}>
      {tier.popular && (
        <div className="bg-primary text-primary-foreground text-center py-1.5 text-xs font-medium">
          MOST POPULAR
        </div>
      )}
      
      <div className="p-6 md:p-8">
        <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
        <p className="text-muted-foreground text-sm mb-4">{tier.description}</p>
        
        <div className="mb-6">
          <span className="text-3xl font-bold">{tier.price}</span>
          {tier.price !== "Custom" && <span className="text-muted-foreground">/month</span>}
        </div>
        
        <ul className="space-y-3 mb-8">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="mr-3 mt-1">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        
        <Button 
          className={cn(
            "w-full", 
            tier.popular ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
          )}
          disabled={tier.comingSoon}
        >
          {tier.comingSoon ? "Coming Soon" : tier.cta}
        </Button>
      </div>
    </div>
  );
}

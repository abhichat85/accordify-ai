import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Code2,
  Database,
  ExternalLink,
  FileText,
  Layers,
  LucideIcon,
  Network,
  Presentation,
  ScrollText,
  ServerCog,
  Shield,
  Sparkles,
  Users,
  Zap,
  PenLine,
  ClipboardCheck,
  FileSearch
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { HeroBackground, AnimatedHeroText, AnimatedWaitlistButton } from "@/components/ui/hero-background";

interface FeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface TechCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface BlogPostProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  imageUrl: string;
}

interface DocumentationItemProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

interface InteractionStepProps {
  userMessage: string;
  aiResponse: string;
  icon: LucideIcon;
  title: string;
}

const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <a 
    href={href} 
    className="text-sm font-medium hover:text-primary transition-colors"
  >
    {children}
  </a>
);

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const Feature: React.FC<FeatureProps> = ({ icon: Icon, title, description }) => (
  <div className="bg-card border border-border/50 rounded-xl p-6 hover:shadow-md transition-shadow space-y-4 animate-fade-in delay-100 relative group overflow-hidden">
    <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center relative z-10">
      <Icon size={24} className="text-primary" />
    </div>
    <h3 className="text-xl font-semibold relative z-10">{title}</h3>
    <p className="text-muted-foreground relative z-10">{description}</p>
  </div>
);

const TechCard: React.FC<TechCardProps> = ({ icon: Icon, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="relative h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute inset-0 bg-primary/5 rounded-xl transform transition-transform duration-300 ${isHovered ? 'scale-95' : 'scale-0'}`}></div>
      <div className="bg-card/80 backdrop-blur-sm border border-border/30 rounded-xl p-6 hover:shadow-md transition-all hover:bg-card hover:border-primary/20 space-y-3 h-full relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon size={20} className="text-primary" />
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className={`absolute bottom-6 right-6 transform transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}>
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <ArrowRight size={14} className="text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

const BlogPost: React.FC<BlogPostProps> = ({ title, excerpt, category, date, imageUrl }) => (
  <div className="group overflow-hidden rounded-xl border border-border/50 bg-card hover:shadow-md transition-all h-full flex flex-col">
    <div className="aspect-video w-full overflow-hidden">
      <img 
        src={imageUrl} 
        alt={title} 
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
      />
    </div>
    <div className="p-6 space-y-4 flex flex-col flex-grow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium px-2.5 py-0.5 bg-primary/10 text-primary rounded-full">{category}</span>
        <span className="text-xs text-muted-foreground">{date}</span>
      </div>
      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2 flex-grow">{excerpt}</p>
      <div className="pt-2 mt-auto">
        <Link to="/blog" className="text-sm font-medium text-primary flex items-center gap-1 hover:gap-2 transition-all">
          Read more <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  </div>
);

const DocumentationItem: React.FC<DocumentationItemProps> = ({ title, description, href, icon: Icon }) => (
  <a 
    href={href}
    className="block p-6 rounded-xl border border-border/50 bg-card hover:border-primary/30 hover:shadow-md transition-all h-full"
  >
    <div className="flex items-start gap-4">
      <div className="mt-1 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon size={20} className="text-primary" />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  </a>
);

const InteractionStep: React.FC<InteractionStepProps> = ({ userMessage, aiResponse, icon: Icon, title }) => (
  <div className="bg-card border border-border/50 rounded-xl p-6 space-y-6 animate-fade-in">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon size={24} className="text-primary" />
      </div>
      <div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
    </div>
    
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="w-8 h-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
          ME
        </div>
        <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-none text-sm max-w-md">
          <p className="typing-step">{userMessage}</p>
        </div>
      </div>
      
      <div className="flex gap-3 justify-end">
        <div className="bg-primary/10 px-4 py-3 rounded-2xl rounded-tr-none text-sm max-w-md">
          <p>{aiResponse}</p>
        </div>
        <div className="w-8 h-8 shrink-0 rounded-full bg-primary flex items-center justify-center">
          <Bot size={16} className="text-primary-foreground" />
        </div>
      </div>
    </div>
  </div>
);

const Landing = () => {
  const { colorTheme } = useTheme();
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [blogPosts, setBlogPosts] = useState<BlogPostProps[]>([
    {
      title: "The Future of Legal AI: Beyond GPT-4",
      excerpt: "How specialized language models are transforming contract analysis with domain-specific knowledge and reasoning capabilities.",
      category: "AI Technology",
      date: "June 15, 2023",
      imageUrl: "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "RAG vs. Fine-tuning: Which is Better for Legal AI?",
      excerpt: "A detailed comparison of Retrieval-Augmented Generation and fine-tuning approaches for legal contract assistant systems.",
      category: "Technology",
      date: "May 28, 2023",
      imageUrl: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Measuring ROI: How AI Contract Tools Save Time and Money",
      excerpt: "A case study of how companies have reduced legal costs by up to 60% with AI-powered contract management solutions.",
      category: "Business",
      date: "April 12, 2023",
      imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Legal Compliance and AI: Navigating the Regulatory Landscape",
      excerpt: "How modern legal teams are using AI to stay compliant with evolving regulations across different jurisdictions.",
      category: "Legal",
      date: "March 5, 2023",
      imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    }
  ]);
  
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

      <header className={`border-b border-border/20 backdrop-blur-md sticky top-0 z-50 bg-background/95 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <FileText size={18} className="text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
              Accord AI
            </span>
          </div>
          
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <ListItem
                      title="Contract Drafting"
                      href="#features"
                    >
                      Generate customized contracts from scratch with intelligent AI
                    </ListItem>
                    <ListItem
                      title="Contract Review"
                      href="#features"
                    >
                      Analyze and identify risks in any contract automatically
                    </ListItem>
                    <ListItem
                      title="Negotiation Advisor"
                      href="#features"
                    >
                      Get expert guidance on contract negotiation points
                    </ListItem>
                    <ListItem
                      title="AI Technology"
                      href="#tech"
                    >
                      Custom SLMs, LoRA fine-tuning, and RAG for superior performance
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <ListItem
                      title="Legal Teams"
                      href="#use-cases"
                    >
                      Streamline routine contract work and free your legal team
                    </ListItem>
                    <ListItem
                      title="Business Founders"
                      href="#use-cases"
                    >
                      Generate founder-friendly agreements instantly
                    </ListItem>
                    <ListItem
                      title="HR Departments"
                      href="#use-cases"
                    >
                      Standardize employee documents with compliance assurance
                    </ListItem>
                    <ListItem
                      title="Sales Teams"
                      href="#use-cases"
                    >
                      Close deals faster with quick contract generation
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/blog" className={navigationMenuTriggerStyle()}>
                  Blog
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="#documentation" className={navigationMenuTriggerStyle()}>
                  Documentation
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <div className="flex items-center space-x-4">
            <Button size="sm" onClick={openWaitlistForm}>
              Join Beta Waitlist
            </Button>
          </div>
        </div>
      </header>

      <HeroBackground className="py-20 md:py-28 px-4 md:px-8 lg:px-0">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
                <Sparkles size={14} />
                <span>AI-Powered Legal Intelligence</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                <AnimatedHeroText text="Draft, Review and<br>Intelligence of Contracts,<br>powered by AI Agent" />
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                Draft, review, and negotiate contracts with your intelligent AI assistant. Built with custom SLMs, LoRA fine-tuning, and RAG for unmatched accuracy and performance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <AnimatedWaitlistButton onClick={openWaitlistForm} />
              </div>
              <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-primary" />
                  <span>AI-powered contract analysis</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-primary" />
                  <span>Enterprise-grade security</span>
                </div>
              </div>
            </div>
            
            <div className="relative animate-fade-in delay-100">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl blur-3xl"></div>
              <div className="relative shadow-xl rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                <div className="border-b border-border/20 p-4 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot size={16} className="text-primary" />
                  </div>
                  <span className="font-medium">Accord AI Assistant</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                      ME
                    </div>
                    <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-none text-sm max-w-xs">
                      Draft an SaaS agreement with custom IP protection clauses for a B2B AI software product.
                    </div>
                  </div>
                  
                  <div className="flex gap-3 justify-end">
                    <div className="bg-primary/10 px-4 py-3 rounded-2xl rounded-tr-none text-sm max-w-sm">
                      <p>I'll create a comprehensive SaaS agreement tailored for your B2B AI software with enhanced IP protection. This will include:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Custom AI-specific IP protection clauses</li>
                        <li>Data usage and ownership provisions</li>
                        <li>Model training restrictions</li>
                        <li>Confidentiality terms for AI algorithms</li>
                      </ul>
                    </div>
                    <div className="w-8 h-8 shrink-0 rounded-full bg-primary flex items-center justify-center">
                      <Bot size={16} className="text-primary-foreground" />
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                      ME
                    </div>
                    <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-none text-sm max-w-xs">
                      Can you add specific language about model outputs and derivative works?
                    </div>
                  </div>
                  
                  <div className="flex gap-3 justify-end animate-pulse-subtle">
                    <div className="bg-primary/10 px-4 py-3 rounded-2xl rounded-tr-none text-sm max-w-sm">
                      <p>Absolutely. I'll incorporate specific provisions addressing:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Ownership of model outputs generated by end-users</li>
                        <li>Clear definitions of "derivative works" in AI context</li>
                        <li>Rights to improvements derived from customer data</li>
                        <li>License limitations for AI-generated content</li>
                      </ul>
                      <p className="mt-2">Would you like to see a draft of these clauses now?</p>
                    </div>
                    <div className="w-8 h-8 shrink-0 rounded-full bg-primary flex items-center justify-center">
                      <Bot size={16} className="text-primary-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </HeroBackground>

      <section id="how-it-works" className="py-20 px-4 md:px-8 lg:px-0 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-2">
              <Bot size={14} />
              <span>Intelligent Interaction</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              How Accord AI Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how our AI agent helps you draft, review, and summarize contracts through natural conversation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <InteractionStep 
              icon={PenLine}
              title="Draft Contracts"
              userMessage="Draft a simple NDA for a software development project with standard confidentiality clauses."
              aiResponse="I've prepared a comprehensive NDA tailored for software development with standard confidentiality provisions, disclosure protocols, and a 2-year term. Would you like me to customize any specific sections?"
            />
            
            <InteractionStep 
              icon={ClipboardCheck}
              title="Review Contracts"
              userMessage="Review this employment agreement and identify any clauses that favor the employer too heavily."
              aiResponse="I've identified 3 clauses that disproportionately favor the employer: 1) The non-compete is overly broad in scope and duration, 2) The IP assignment has no exceptions for prior work, and 3) The termination terms lack reciprocal notice periods."
            />
            
            <InteractionStep 
              icon={FileSearch}
              title="Summarize Contracts"
              userMessage="Summarize the key terms of this 45-page service agreement for cloud infrastructure services."
              aiResponse="This agreement covers cloud infrastructure services with: 1) A 3-year term with auto-renewal, 2) 99.9% uptime SLA with defined penalties, 3) Monthly billing with net-30 terms, and 4) Data protection terms compliant with GDPR and CCPA."
            />
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 md:px-8 lg:px-0">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-2">
              <Zap size={14} />
              <span>Powerful Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Powerful AI Contract Tools
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Accord AI combines advanced language models with legal expertise to transform your contract workflow.
            </p>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Feature
                icon={FileText}
                title="Intelligent Drafting"
                description="Generate customized contracts from scratch in seconds, tailored to your specific business needs and industry requirements."
              />
              <Feature
                icon={BrainCircuit}
                title="Comprehensive Review"
                description="Analyze contracts for risks, missing clauses, and compliance issues with detailed recommendations and explanations."
              />
              <Feature
                icon={Zap}
                title="Negotiation Advisor"
                description="Get expert guidance on negotiation points and alternative language with pros and cons analysis based on your position."
              />
              <Feature
                icon={Users}
                title="Collaborative Workflow"
                description="Share contracts with your team, assign roles, and track changes in a secure environment with role-based permissions."
              />
              <Feature
                icon={ScrollText}
                title="Contract Timeline"
                description="Track important deadlines, renewal dates, and obligations with automated reminders and calendar integration."
              />
              <Feature
                icon={Shield}
                title="Enterprise Security"
                description="Bank-level encryption, role-based access control, and data privacy compliance with SOC 2 Type II certification."
              />
            </div>
          </div>
        </div>
      </section>

      <section id="tech" className="py-20 px-4 md:px-8 lg:px-0 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-2">
              <BrainCircuit size={14} />
              <span>Advanced Technology</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Advanced AI Technology
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our contract intelligence platform is powered by cutting-edge AI technologies for unmatched accuracy and performance.
            </p>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TechCard 
                icon={BrainCircuit}
                title="Custom SLMs"
                description="Specialized Language Models designed specifically for legal and contract analysis, trained on vast corpora of legal documents for superior understanding of legal concepts and terminology."
              />
              <TechCard 
                icon={Layers}
                title="LoRA Fine-tuning"
                description="Low-Rank Adaptation provides efficient and targeted fine-tuning of our models on specific contract types and legal domains, ensuring higher precision with minimal computational overhead."
              />
              <TechCard 
                icon={Database}
                title="RAG Architecture"
                description="Retrieval-Augmented Generation combines the power of large language models with specialized legal knowledge bases to ensure responses are grounded in accurate and relevant legal information."
              />
              <TechCard 
                icon={Network}
                title="Domain Adaptation"
                description="Our models adapt to specific industries and use cases, learning the unique language and requirements of different business sectors for more relevant contract generation."
              />
              <TechCard 
                icon={ServerCog}
                title="Legal Reasoning Engines"
                description="Specialized reasoning modules that analyze contractual clauses for risks, inconsistencies, and compliance issues across multiple jurisdictions."
              />
              <TechCard 
                icon={Code2}
                title="Custom Embeddings"
                description="Proprietary embedding models that capture the semantic relationships between legal concepts for more accurate document comparison and clause recommendation."
              />
            </div>
          </div>
        </div>
      </section>

      <section id="use-cases" className="py-20 px-4 md:px-8 lg:px-0">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-2">
              <Users size={14} />
              <span>For Every Team</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Perfect For Every Contract Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trusted by legal teams, entrepreneurs, and business professionals across industries.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "In-House Legal Teams",
                description: "Streamline routine contract work and free your legal team to focus on strategic matters. Reduce review time by up to 80%.",
                tasks: ["NDA automation", "Vendor contract review", "Policy compliance checks", "Legal risk assessment"]
              },
              {
                title: "Business Founders",
                description: "Get the legal protection you need without the expensive attorney fees. Generate founder-friendly agreements instantly.",
                tasks: ["Consultant agreements", "Employment contracts", "Customer agreements", "Partnership documents"]
              },
              {
                title: "HR Departments",
                description: "Standardize your employee documents while ensuring compliance with changing regulations across jurisdictions.",
                tasks: ["Offer letters", "Employment policies", "Severance agreements", "Benefits documentation"]
              },
              {
                title: "Sales Teams",
                description: "Close deals faster with quick contract generation, redlining, and negotiation assistance for your sales agreements.",
                tasks: ["Sales agreements", "Term sheets", "Partnership contracts", "SLA documentation"]
              }
            ].map((useCase, index) => (
              <div 
                key={index} 
                className="bg-card border border-border/50 rounded-xl p-8 animate-fade-in hover:shadow-md transition-all"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
                <p className="text-muted-foreground mb-6">{useCase.description}</p>
                <div className="space-y-2">
                  {useCase.tasks.map((task, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 size={12} className="text-primary" />
                      </div>
                      <span>{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="blog" className="py-20 px-4 md:px-8 lg:px-0 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
            <div className="space-y-3 mb-6 md:mb-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-2">
                <ScrollText size={14} />
                <span>Latest Insights</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">
                Legal AI Blog
              </h2>
              <p className="text-lg text-muted-foreground md:max-w-md">
                Insights and perspectives on AI in the legal industry.
              </p>
            </div>
            <Link to="/blog" className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              View all articles <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {blogPosts.map((post, index) => (
              <BlogPost 
                key={index} 
                title={post.title} 
                excerpt={post.excerpt} 
                category={post.category} 
                date={post.date}
                imageUrl={post.imageUrl}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="documentation" className="py-20 px-4 md:px-8 lg:px-0">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-2">
              <FileText size={14} />
              <span>Resources</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Documentation & Resources
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to get started and make the most of Accord AI.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DocumentationItem 
              icon={Presentation}
              title="Quick Start Guide"
              description="Get up and running with Accord AI in minutes with our step-by-step quick start guide."
              href="/docs/quickstart"
            />
            <DocumentationItem 
              icon={Bot}
              title="AI Agent Capabilities"
              description="Learn about the capabilities of our AI agent and how to leverage its full potential."
              href="/docs/ai-capabilities"
            />
            <DocumentationItem 
              icon={FileText}
              title="Contract Templates"
              description="Browse our library of pre-built contract templates for various industries and use cases."
              href="/docs/templates"
            />
            <DocumentationItem 
              icon={ServerCog}
              title="API Reference"
              description="Comprehensive API documentation for integrating Accord AI into your existing systems."
              href="/docs/api"
            />
            <DocumentationItem 
              icon={ExternalLink}
              title="Integration Guides"
              description="Step-by-step guides for integrating with popular tools like Salesforce, Notion, and more."
              href="/docs/integrations"
            />
            <DocumentationItem 
              icon={Shield}
              title="Security & Compliance"
              description="Details about our security practices, data handling, and compliance certifications."
              href="/docs/security"
            />
          </div>
        </div>
      </section>

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

      <footer className="border-t border-border py-12 px-4 md:px-8 lg:px-0">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2 lg:col-span-2 mb-8 lg:mb-0">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <FileText size={14} className="text-primary-foreground" />
                </div>
                <span className="text-lg font-semibold">Accord AI</span>
              </div>
              <p className="text-muted-foreground text-sm mb-6 max-w-xs">
                AI-powered contract intelligence platform for legal teams and business professionals.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-sm">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-muted-foreground hover:text-primary">Features</a></li>
                <li><a href="#tech" className="text-muted-foreground hover:text-primary">Technology</a></li>
                <li><a href="#use-cases" className="text-muted-foreground hover:text-primary">Use Cases</a></li>
                <li><a href="#documentation" className="text-muted-foreground hover:text-primary">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-sm">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/blog" className="text-muted-foreground hover:text-primary">Blog</Link></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Help Center</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-sm">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-primary">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Contact</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-border text-sm text-muted-foreground">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p>© 2023 Accord AI, Inc. All rights reserved.</p>
              <div className="mt-4 sm:mt-0 flex items-center gap-6">
                <a href="#" className="hover:text-foreground">Privacy Policy</a>
                <a href="#" className="hover:text-foreground">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Menu, X, CheckCircle2, FileText, ShieldCheck, Users, Zap, BookOpen, ChevronRight, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { BackgroundPaths } from "@/components/ui/background-paths";
import BlogPost from "../components/landing/BlogPost";
import Feature from "../components/landing/Feature";
import TechCard from "../components/landing/TechCard";

// Custom icon components - MOVED TO THE TOP before usage
const CodeIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const Link2Icon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
  </svg>
);

const VideoIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
    <line x1="7" y1="2" x2="7" y2="22"></line>
    <line x1="17" y1="2" x2="17" y2="22"></line>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <line x1="2" y1="7" x2="7" y2="7"></line>
    <line x1="2" y1="17" x2="7" y2="17"></line>
    <line x1="17" y1="17" x2="22" y2="17"></line>
    <line x1="17" y1="7" x2="22" y2="7"></line>
  </svg>
);

// Feature data
const features = [
  {
    icon: <FileText className="h-6 w-6 text-primary" />,
    title: "Contract Generation",
    description: "Create customized contracts in minutes with AI that understands legal language and best practices."
  },
  {
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
    title: "Risk Analysis",
    description: "Identify potential risks and issues in contracts with advanced legal pattern recognition."
  },
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    title: "Collaboration",
    description: "Share contracts with team members and clients with controlled permissions and tracking."
  },
  {
    icon: <Zap className="h-6 w-6 text-primary" />,
    title: "E-Signatures",
    description: "Legally binding electronic signatures with robust verification and security."
  }
];

// Technology cards
const techCards = [
  {
    title: "SLM Legal Models",
    description: "Specialized small language models optimized for legal understanding and generation.",
    icon: "🧠"
  },
  {
    title: "RAG Architecture",
    description: "Retrieval-Augmented Generation ensures accurate and reliable information in your contracts.",
    icon: "📚"
  },
  {
    title: "LoRA Fine-tuning",
    description: "Low-Rank Adaptation enables precise domain specialization with minimal compute.",
    icon: "🛠️"
  },
  {
    title: "Edge Processing",
    description: "Local model execution for enhanced speed and privacy of sensitive contract data.",
    icon: "⚡"
  }
];

// Blog posts
const blogPosts = [
  {
    title: "The Future of Legal Tech: AI and Contract Management",
    description: "Examining how AI is transforming contract workflows and management in the legal industry.",
    image: "https://images.unsplash.com/photo-1543286386-2e659306cd6c",
    date: "May 10, 2023",
    author: "Sarah Chen",
    category: "Legal Tech"
  },
  {
    title: "Understanding Retrieval-Augmented Generation in Legal AI",
    description: "How RAG technology enhances the accuracy and reliability of AI-generated legal documents.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
    date: "April 22, 2023",
    author: "Michael Rodriguez",
    category: "AI Technology"
  },
  {
    title: "Legal Compliance Automation: Benefits and Implementation",
    description: "Strategies for implementing automated compliance checks in your contract workflow.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85",
    date: "March 15, 2023", 
    author: "David Thompson",
    category: "Compliance"
  },
  {
    title: "Smart Contracts and Blockchain: Legal Considerations",
    description: "Navigating the complex legal landscape of blockchain-based smart contracts.",
    image: "https://images.unsplash.com/photo-1639322537504-6427a16b0a28",
    date: "February 28, 2023",
    author: "Lisa Wong",
    category: "Blockchain"
  }
];

// Use cases
const useCases = [
  {
    title: "Legal Departments",
    description: "Streamline contract workflows and reduce outside counsel spend with AI-powered contract generation, review, and management.",
    icon: "⚖️",
    benefits: [
      "40% reduction in contract processing time",
      "Standardized templates across departments",
      "Risk identification and mitigation",
      "Contract portfolio analytics"
    ]
  },
  {
    title: "Law Firms",
    description: "Enhance client service and increase efficiency with intelligent contract analysis and generation tools.",
    icon: "📝",
    benefits: [
      "Focus attorney time on high-value tasks",
      "Improve accuracy of contract review",
      "Consistent quality across junior associates",
      "Higher client satisfaction"
    ]
  },
  {
    title: "Startups & SMBs",
    description: "Access enterprise-quality legal support without the enterprise budget through AI-powered contract assistance.",
    icon: "🚀",
    benefits: [
      "Reduced legal spend",
      "Quick generation of standard agreements",
      "Risk identification for non-legal professionals",
      "Simplified contract language"
    ]
  }
];

// Documentation sections - Now custom icon components are defined BEFORE this usage
const docSections = [
  {
    title: "Quick Start Guide",
    description: "Get up and running with Accord AI in less than 5 minutes",
    icon: <Zap className="h-5 w-5" />
  },
  {
    title: "API Reference",
    description: "Comprehensive documentation for our REST and GraphQL APIs",
    icon: <CodeIcon className="h-5 w-5" />
  },
  {
    title: "Contract Templates",
    description: "Library of customizable templates for common business needs",
    icon: <FileText className="h-5 w-5" />
  },
  {
    title: "Security & Compliance",
    description: "Our approach to data security, privacy, and regulatory compliance",
    icon: <ShieldCheck className="h-5 w-5" />
  },
  {
    title: "Integration Guides",
    description: "Connect Accord AI with your existing tools and workflows",
    icon: <Link2Icon className="h-5 w-5" />
  },
  {
    title: "Video Tutorials",
    description: "Step-by-step visual guides to mastering Accord AI",
    icon: <VideoIcon className="h-5 w-5" />
  }
];

// Custom HeroBackground component that will wrap the hero section
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

      <header className={`border-b border-border/20 backdrop-blur-md sticky top-0 z-50 bg-background/95 transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <FileText size={18} className="text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
              Accord AI
            </span>
          </div>
          
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <a href="#features" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </a>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a href="#tech" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Technology
                </a>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a href="#use-cases" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Use Cases
                </a>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a href="#blog" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </a>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <a href="#documentation" className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </a>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center space-x-3">
            <Link to="/app">
              <Button variant="outline" size="sm" className="hidden md:flex">
                Sign In
              </Button>
            </Link>
            <Button size="sm" className="hidden md:flex gap-1 bg-primary text-primary-foreground hover:bg-primary/90">
              Join Waitlist <ArrowRight size={14} />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 px-4 bg-background border-t border-border/20 animate-fade-in">
            <div className="flex flex-col space-y-3">
              <a 
                href="#features" 
                className="px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#tech" 
                className="px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Technology
              </a>
              <a 
                href="#use-cases" 
                className="px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Use Cases
              </a>
              <a 
                href="#blog" 
                className="px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </a>
              <a 
                href="#documentation" 
                className="px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Documentation
              </a>
              <div className="pt-3 flex flex-col space-y-3">
                <Link to="/app" className="w-full">
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Button className="w-full gap-1">
                  Join Waitlist <ArrowRight size={14} />
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        <HeroBackground className="py-20 md:py-28 px-4 md:px-8 lg:px-0">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <motion.div 
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="flex h-2 w-2 rounded-full bg-primary"></span>
                  Now in private beta
                </motion.div>
                
                <motion.h1 
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">AI-powered</span> contract assistant
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-muted-foreground"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Create, analyze, and manage contracts with unmatched precision using specialized AI models trained on millions of legal documents.
                </motion.p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-3"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button onClick={openWaitlistForm} size="lg" className="gap-2 emboss">
                    Join the waitlist <ArrowRight size={16} />
                  </Button>
                  <Link to="/app">
                    <Button variant="outline" size="lg" className="gap-2 deboss">
                      View demo <ArrowUpRight size={16} />
                    </Button>
                  </Link>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-2 text-muted-foreground text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <CheckCircle2 size={16} className="text-primary" />
                  <span>No credit card required</span>
                  <span className="mx-1">•</span>
                  <CheckCircle2 size={16} className="text-primary" />
                  <span>Free trial available</span>
                </motion.div>
              </div>
              
              <div className="lg:ml-10 relative">
                <motion.img 
                  src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2342&q=80"
                  alt="Contract Management UI" 
                  className="rounded-2xl shadow-2xl border border-border/20 layered-paper card-elevation"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </HeroBackground>

        <section id="how-it-works" className="py-20 px-4 md:px-8 lg:px-0 bg-muted/20 texture-overlay">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16 space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Accord AI simplifies contract workflows through intelligent automation and analysis.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-background/50 backdrop-blur-sm card-elevation">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl">1</span>
                  </div>
                  <h3 className="text-xl font-semibold">Upload or Create</h3>
                  <p className="text-muted-foreground">
                    Start with an existing contract or create a new one from our template library.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-background/50 backdrop-blur-sm card-elevation">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl">2</span>
                  </div>
                  <h3 className="text-xl font-semibold">AI Analysis</h3>
                  <p className="text-muted-foreground">
                    Our AI models analyze the content, identifying risks and suggesting improvements.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-background/50 backdrop-blur-sm card-elevation">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl">3</span>
                  </div>
                  <h3 className="text-xl font-semibold">Finalize & Sign</h3>
                  <p className="text-muted-foreground">
                    Make revisions based on AI insights, then collect secure electronic signatures.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 px-4 md:px-8 lg:px-0 paper-texture">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16 space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold">Key Features</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our platform combines legal expertise and AI technology to streamline your contract processes.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <Feature
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  className="card-elevation"
                />
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <Button onClick={openWaitlistForm} variant="default" size="lg" className="gap-2 emboss">
                Get Started <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </section>

        <section id="tech" className="py-20 px-4 md:px-8 lg:px-0 bg-muted/20 gradient-mesh">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16 space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold">Our Technology</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Powered by specialized AI models for unmatched understanding of legal language and context.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {techCards.map((card, index) => (
                <TechCard
                  key={index}
                  title={card.title}
                  description={card.description}
                  icon={card.icon}
                  className="h-full card-elevation"
                />
              ))}
            </div>
            
            <div className="mt-16 bg-background/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-border/20 card-elevation">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Built for Performance and Privacy</h3>
                  <p className="text-muted-foreground mb-4">
                    Our technology stack prioritizes both powerful AI capabilities and strict data security. We've engineered our platform to provide enterprise-grade performance while maintaining the highest standards of privacy.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={18} className="text-primary mt-0.5" />
                      <span>Edge computing for sensitive data processing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={18} className="text-primary mt-0.5" />
                      <span>SOC 2 Type II compliant infrastructure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 size={18} className="text-primary mt-0.5" />
                      <span>Model training on anonymized legal corpora</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-muted/30 rounded-xl p-6 relative deboss">
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1581092921461-eab10380b606?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
                      alt="Technology visualization" 
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="use-cases" className="py-20 px-4 md:px-8 lg:px-0 texture-overlay">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16 space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold">Use Cases</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Accord AI adapts to the needs of different organizations and legal professionals.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {useCases.map((useCase, index) => (
                <Card key={index} className="card-elevation bg-background/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="text-3xl mb-4">{useCase.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                    <p className="text-muted-foreground mb-4">{useCase.description}</p>
                    <div className="pt-2">
                      <h4 className="text-sm font-semibold text-primary mb-2">Key Benefits:</h4>
                      <ul className="space-y-1">
                        {useCase.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 size={14} className="text-primary mt-0.5 shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <p className="text-muted-foreground mb-4">
                Ready to see how Accord AI can work for your organization?
              </p>
              <Button onClick={openWaitlistForm} size="lg" className="gap-2 emboss">
                Request a Demo <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </section>

        <section id="blog" className="py-20 px-4 md:px-8 lg:px-0 bg-muted/20 gradient-mesh">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold">Latest Insights</h2>
                <p className="text-muted-foreground mt-2">Industry trends and best practices in contract management.</p>
              </div>
              <Link to="/blog" className="mt-4 md:mt-0">
                <Button variant="outline" className="gap-1 deboss">
                  View all articles <ChevronRight size={16} />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {blogPosts.map((post, index) => (
                <BlogPost
                  key={index}
                  title={post.title}
                  image={post.image}
                  date={post.date}
                  author={post.author}
                  category={post.category}
                  className="card-elevation"
                  excerpt={post.description}
                />
              ))}
            </div>
            
            <div className="mt-12 bg-primary/5 rounded-2xl p-6 border border-primary/10 deboss">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="text-2xl">📬</div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">Subscribe to our newsletter</h3>
                  <p className="text-muted-foreground text-sm">Get the latest updates and insights delivered to your inbox.</p>
                </div>
                <Button variant="default" className="whitespace-nowrap emboss">
                  Subscribe Now
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="documentation" className="py-20 px-4 md:px-8 lg:px-0 paper-texture">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16 space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold">Documentation</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Comprehensive resources to help you get the most out of Accord AI.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {docSections.map((section, index) => (
                <Card key={index} className="card-elevation border-border/30">
                  <CardContent className="p-5 flex items-start gap-3">
                    <div className="mt-1 p-2 bg-muted rounded-md">
                      {section.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{section.title}</h3>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                      <Link to="/docs" className="text-primary text-sm flex items-center gap-1 mt-2 hover:underline">
                        <span>Read more</span>
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-16 bg-muted/20 rounded-2xl p-8 border border-border/20 flex flex-col md:flex-row justify-between items-center gap-6 card-elevation">
              <div>
                <h3 className="text-xl font-semibold mb-2">Need additional help?</h3>
                <p className="text-muted-foreground">Our team is available to provide personalized support.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="gap-1 deboss">
                  <BookOpen size={16} />
                  <span>Knowledge Base</span>
                </Button>
                <Button className="gap-1 emboss">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 px-4 md:px-8 lg:px-0 bg-muted/30 gradient-mesh">
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
        </section>
      </main>

      <footer className="border-t border-border py-12 px-4 md:px-8 lg:px-0">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <FileText size={18} className="text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">
                  Accord AI
                </span>
              </div>
              <p className="text-muted-foreground mb-4 text-sm">
                AI-powered contract assistant for legal professionals and businesses.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-muted-foreground hover:text-foreground">Features</a></li>
                <li><a href="#tech" className="text-muted-foreground hover:text-foreground">Technology</a></li>
                <li><a href="#pricing" className="text-muted-foreground hover:text-foreground">Pricing</a></li>
                <li><a href="#use-cases" className="text-muted-foreground hover:text-foreground">Use Cases</a></li>
                <li><a href="#integrations" className="text-muted-foreground hover:text-foreground">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#documentation" className="text-muted-foreground hover:text-foreground">Documentation</a></li>
                <li><a href="#blog" className="text-muted-foreground hover:text-foreground">Blog</a></li>
                <li><a href="#guides" className="text-muted-foreground hover:text-foreground">Guides</a></li>
                <li><a href="#webinars" className="text-muted-foreground hover:text-foreground">Webinars</a></li>
                <li><a href="#api-docs" className="text-muted-foreground hover:text-foreground">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="text-muted-foreground hover:text-foreground">About Us</a></li>
                <li><a href="#careers" className="text-muted-foreground hover:text-foreground">Careers</a></li>
                <li><a href="#contact" className="text-muted-foreground hover:text-foreground">Contact</a></li>
                <li><a href="#partners" className="text-muted-foreground hover:text-foreground">Partners</a></li>
                <li><a href="#legal" className="text-muted-foreground hover:text-foreground">Legal</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#terms" className="text-muted-foreground hover:text-foreground">Terms of Service</a></li>
                <li><a href="#cookies" className="text-muted-foreground hover:text-foreground">Cookie Policy</a></li>
                <li><a href="#security" className="text-muted-foreground hover:text-foreground">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/60 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm">
            <p className="text-muted-foreground mb-4 sm:mb-0">
              © {new Date().getFullYear()} Accord AI Ltd. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <a href="#privacy" className="hover:text-foreground">Privacy</a>
              <a href="#terms" className="hover:text-foreground">Terms</a>
              <a href="#cookies" className="hover:text-foreground">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

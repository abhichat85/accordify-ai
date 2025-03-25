
import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Zap, 
  Shield, 
  Check, 
  ChevronRight,
  Bot,
  BrainCircuit,
  FileClock,
  Users
} from "lucide-react";

const Landing = () => {
  const { colorTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">
      <Helmet>
        <title>Accord AI | Intelligent Contract Assistant</title>
        <meta name="description" content="AI-powered contract assistant that helps you draft, review, and negotiate contracts with ease." />
      </Helmet>

      {/* Navigation */}
      <header className="border-b border-border/20 backdrop-blur-md sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <FileText size={18} className="text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
              Accord AI
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">How It Works</a>
            <a href="#use-cases" className="text-sm font-medium hover:text-primary transition-colors">Use Cases</a>
            <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                Log In
              </Button>
            </Link>
            <Link to="/">
              <Button size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 md:px-8 lg:px-0">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
                AI-Powered Contract Intelligence
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                Draft, review, and negotiate contracts with the help of your intelligent AI assistant. Save time and reduce risk with Accord AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/">
                  <Button size="lg" className="gap-2 rounded-full shadow-lg">
                    Get Started <ChevronRight size={16} />
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" size="lg" className="gap-2 rounded-full">
                    Watch Demo <FileText size={16} />
                  </Button>
                </Link>
              </div>
              <div className="pt-6 flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Check size={16} className="text-primary" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={16} className="text-primary" />
                  <span>14-day free trial</span>
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
                      Can you draft an NDA for my new software company?
                    </div>
                  </div>
                  
                  <div className="flex gap-3 justify-end">
                    <div className="bg-primary/10 px-4 py-3 rounded-2xl rounded-tr-none text-sm max-w-sm">
                      <p>I'd be happy to draft an NDA for your software company. I'll create a comprehensive agreement that includes:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Standard confidentiality provisions</li>
                        <li>IP protection clauses</li>
                        <li>Term and termination conditions</li>
                        <li>Customized for software industry</li>
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
                      Great! Can you make sure it's valid in California?
                    </div>
                  </div>
                  
                  <div className="flex gap-3 justify-end animate-pulse-subtle">
                    <div className="bg-primary/10 px-4 py-3 rounded-2xl rounded-tr-none text-sm max-w-sm">
                      <p>I'll ensure the NDA is compliant with California law, including specific provisions required by the state such as:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>California trade secret protection</li>
                        <li>Proper jurisdiction clauses</li>
                        <li>Consideration requirements</li>
                      </ul>
                      <p className="mt-2">Would you like me to draft this now?</p>
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
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 md:px-8 lg:px-0 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold">
              Powerful AI Contract Tools
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Accord AI combines advanced language models with legal expertise to transform your contract workflow.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FileText size={24} className="text-primary" />,
                title: "Intelligent Drafting",
                description: "Generate customized contracts from scratch in seconds, tailored to your specific business needs."
              },
              {
                icon: <BrainCircuit size={24} className="text-primary" />,
                title: "Comprehensive Review",
                description: "Analyze contracts for risks, missing clauses, and compliance issues with detailed recommendations."
              },
              {
                icon: <Zap size={24} className="text-primary" />,
                title: "Negotiation Advisor",
                description: "Get expert guidance on negotiation points and alternative language with pros and cons analysis."
              },
              {
                icon: <Users size={24} className="text-primary" />,
                title: "Collaborative Workflow",
                description: "Share contracts with your team, assign roles, and track changes in a secure environment."
              },
              {
                icon: <FileClock size={24} className="text-primary" />,
                title: "Contract Timeline",
                description: "Track important deadlines, renewal dates, and obligations with automated reminders."
              },
              {
                icon: <Shield size={24} className="text-primary" />,
                title: "Enterprise Security",
                description: "Bank-level encryption, role-based access control, and data privacy compliance built-in."
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="bg-card border border-border/50 rounded-xl p-6 hover:shadow-md transition-shadow space-y-4 animate-fade-in delay-100"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 md:px-8 lg:px-0">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold">
              How Accord AI Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our intelligent agent guides you through your entire contract lifecycle with minimal effort.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative">
            {/* Connection line (desktop only) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 z-0"></div>
            
            {[
              {
                step: "01",
                title: "Describe Your Needs",
                description: "Simply tell Accord AI what you need in plain language - generate a contract, review a document, or ask legal questions."
              },
              {
                step: "02",
                title: "AI Takes Action",
                description: "Our agent analyzes your request, accesses relevant legal knowledge, and performs the requested task with reasoning."
              },
              {
                step: "03",
                title: "Review & Finalize",
                description: "Get instant results with explanations. Edit, ask follow-up questions, or approve the work to finalize your document."
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className="relative z-10 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="bg-card border border-border/50 rounded-xl p-6 h-full">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-20 px-4 md:px-8 lg:px-0 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-3">
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
                tasks: ["NDA automation", "Vendor contract review", "Policy compliance checks"]
              },
              {
                title: "Business Founders",
                description: "Get the legal protection you need without the expensive attorney fees. Generate founder-friendly agreements instantly.",
                tasks: ["Consultant agreements", "Employment contracts", "Customer agreements"]
              },
              {
                title: "HR Departments",
                description: "Standardize your employee documents while ensuring compliance with changing regulations across jurisdictions.",
                tasks: ["Offer letters", "Employment policies", "Severance agreements"]
              },
              {
                title: "Sales Teams",
                description: "Close deals faster with quick contract generation, redlining, and negotiation assistance for your sales agreements.",
                tasks: ["Sales agreements", "Term sheets", "Partnership contracts"]
              }
            ].map((useCase, index) => (
              <div 
                key={index} 
                className="bg-card border border-border/50 rounded-xl p-8 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
                <p className="text-muted-foreground mb-6">{useCase.description}</p>
                <div className="space-y-2">
                  {useCase.tasks.map((task, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <Check size={12} className="text-primary" />
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

      {/* CTA Section */}
      <section className="py-24 px-4 md:px-8 lg:px-0">
        <div className="container mx-auto max-w-5xl">
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-primary/10 backdrop-blur-sm"></div>
            <div className="relative p-12 md:p-16 text-center z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Transform Your Contract Workflow Today
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Join thousands of professionals who save time and reduce risk with Accord AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/">
                  <Button size="lg" className="gap-2 rounded-full shadow-lg">
                    Start Free Trial <ChevronRight size={16} />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" size="lg" className="gap-2 rounded-full bg-background">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 md:px-8 lg:px-0 bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <FileText size={16} className="text-primary-foreground" />
                </div>
                <span className="text-lg font-semibold">Accord AI</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                AI-powered contract assistance for the modern business.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Features</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Pricing</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Integrations</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Changelog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">About</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Careers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Press</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Terms</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Privacy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Cookies</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Licenses</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Settings</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Accord AI. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <select 
                className="text-sm bg-transparent border border-border rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                defaultValue="en"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

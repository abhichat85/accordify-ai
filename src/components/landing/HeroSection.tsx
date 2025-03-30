
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  openWaitlistForm: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ openWaitlistForm }) => {
  return (
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
  );
};

export default HeroSection;

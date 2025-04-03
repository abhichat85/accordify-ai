import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  ChevronRight,
  FileText,
  Search,
  Tag
} from "lucide-react";
import BlogPost from "@/components/landing/BlogPost";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = [
    "All",
    "AI Technology",
    "Legal",
    "Business",
    "Tutorials",
    "News"
  ];
  
  const blogPosts = [
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
    },
    {
      title: "The Rise of Custom SLMs in Legal Tech",
      excerpt: "Why specialized language models are becoming essential for high-performance legal AI applications.",
      category: "AI Technology",
      date: "February 18, 2023",
      imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "How LoRA Fine-tuning Revolutionizes Legal AI",
      excerpt: "A technical deep dive into how Low-Rank Adaptation enables more efficient and accurate legal language models.",
      category: "Technology",
      date: "January 30, 2023",
      imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
    }
  ];
  
  // Filter posts based on search query and selected category
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === null || 
                            selectedCategory === "All" || 
                            post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Blog | Accord AI</title>
        <meta name="description" content="Latest insights and updates on contract AI, legal tech, and industry trends." />
      </Helmet>
      
      {/* Header */}
      <header className="border-b border-border bg-muted/20">
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <FileText size={18} className="text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">Accord AI</span>
            </Link>
            <h1 className="text-4xl font-bold mt-8">Our Blog</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Latest insights and updates on contract AI, legal technology, and industry trends
            </p>
            
            <div className="w-full max-w-md relative mt-4">
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-6"
              />
              <Search className="absolute left-3 top-3 text-muted-foreground" size={16} />
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category || (category === "All" && selectedCategory === null) ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category === "All" ? null : category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto py-12 px-4">
        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <div className="mb-16">
            <BlogPost 
              {...filteredPosts[0]} 
              featured={true}
            />
          </div>
        )}
        
        {/* Grid of Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.slice(1).map((post, index) => (
            <BlogPost key={index} {...post} />
          ))}
        </div>
        
        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <Tag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-6">
              We couldn't find any articles matching your search criteria.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </main>
      
      {/* Newsletter */}
      <section className="bg-muted/20 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Subscribe to Our Newsletter</h2>
            <p className="text-muted-foreground">
              Get the latest insights and updates on legal AI and contract technology directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-grow"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center">
          <Link to="/" className="text-primary hover:underline">
            Return to Home
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            &copy; {new Date().getFullYear()} Accord AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Blog;

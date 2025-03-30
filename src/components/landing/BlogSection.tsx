
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlogPost from "@/components/landing/BlogPost";

const BlogSection: React.FC = () => {
  const blogPosts = [
    {
      title: "The Future of Legal Tech: AI and Contract Management",
      excerpt: "Examining how AI is transforming contract workflows and management in the legal industry.",
      image: "https://images.unsplash.com/photo-1543286386-2e659306cd6c",
      date: "May 10, 2023",
      author: "Sarah Chen",
      category: "Legal Tech"
    },
    {
      title: "Understanding Retrieval-Augmented Generation in Legal AI",
      excerpt: "How RAG technology enhances the accuracy and reliability of AI-generated legal documents.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
      date: "April 22, 2023",
      author: "Michael Rodriguez",
      category: "AI Technology"
    },
    {
      title: "Legal Compliance Automation: Benefits and Implementation",
      excerpt: "Strategies for implementing automated compliance checks in your contract workflow.",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85",
      date: "March 15, 2023", 
      author: "David Thompson",
      category: "Compliance"
    },
    {
      title: "Smart Contracts and Blockchain: Legal Considerations",
      excerpt: "Navigating the complex legal landscape of blockchain-based smart contracts.",
      image: "https://images.unsplash.com/photo-1639322537504-6427a16b0a28",
      date: "February 28, 2023",
      author: "Lisa Wong",
      category: "Blockchain"
    }
  ];
  
  return (
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
            excerpt={post.excerpt}
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
  );
};

export default BlogSection;

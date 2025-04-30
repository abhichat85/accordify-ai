import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ScrollText } from "lucide-react";

interface BlogPostProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  imageUrl: string;
}

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

const BlogSection: React.FC = () => {
  const blogPosts: BlogPostProps[] = [
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
  ];
  
  return (
    <section id="blog" className="py-20 px-4 md:px-8 bg-subtle-accent">
      <div className="container mx-auto max-w-[90%] xl:max-w-[1400px]">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
          <div className="space-y-3 mb-6 md:mb-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-2">
              <ScrollText size={14} />
              <span>Latest Insights</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Legal AI Blog
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
  );
};

export default BlogSection;


import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export interface BlogPostProps {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  imageUrl: string;
  featured?: boolean;
}

const BlogPost: React.FC<BlogPostProps> = ({ 
  title, 
  excerpt, 
  category, 
  date, 
  imageUrl,
  featured = false
}) => {
  if (featured) {
    return (
      <div className="rounded-xl border border-border/50 bg-card hover:shadow-md transition-all h-full overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          <div className="aspect-square md:aspect-auto md:h-full overflow-hidden">
            <img 
              src={imageUrl} 
              alt={title} 
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-8 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium px-2.5 py-0.5 bg-primary/10 text-primary rounded-full">{category}</span>
              <span className="text-xs text-muted-foreground">{date}</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4">{title}</h3>
            <p className="text-muted-foreground flex-grow mb-6">
              {excerpt}
            </p>
            <Link to="/blog" className="text-sm font-medium text-primary flex items-center gap-1 hover:gap-2 transition-all mt-auto">
              Read the full article <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
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
};

export default BlogPost;

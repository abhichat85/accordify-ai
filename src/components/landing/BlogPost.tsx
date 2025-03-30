
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon, UserIcon } from 'lucide-react';

interface BlogPostProps {
  title: string;
  image: string;
  date: string;
  author: string;
  category: string;
  excerpt: string;
  className?: string;
}

const BlogPost: React.FC<BlogPostProps> = ({
  title,
  image,
  date,
  author,
  category,
  excerpt,
  className = ""
}) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
      </div>
      <CardContent className="p-4">
        <div className="text-xs text-primary font-medium mb-2">{category}</div>
        <h3 className="font-semibold mb-2 line-clamp-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{excerpt}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center">
            <UserIcon className="w-3 h-3 mr-1" />
            {author}
          </div>
          <div className="flex items-center">
            <CalendarIcon className="w-3 h-3 mr-1" />
            {date}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogPost;


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon, UserIcon } from 'lucide-react';

interface BlogPostProps {
  title: string;
  image?: string;
  imageUrl?: string; // Add optional imageUrl for compatibility
  date: string;
  author: string;
  category: string;
  excerpt: string;
  className?: string;
  featured?: boolean; // Add optional featured property
}

const BlogPost: React.FC<BlogPostProps> = ({
  title,
  image,
  imageUrl, // Support both image and imageUrl
  date,
  author,
  category,
  excerpt,
  className = "",
  featured = false // Default to false
}) => {
  // Use either image or imageUrl, preferring image if both are provided
  const imageSource = image || imageUrl || "";
  
  return (
    <Card className={`overflow-hidden ${featured ? 'col-span-full' : ''} ${className}`}>
      <div className={`aspect-video w-full overflow-hidden ${featured ? 'md:aspect-[21/9]' : ''}`}>
        <img 
          src={imageSource} 
          alt={title} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
      </div>
      <CardContent className={`p-4 ${featured ? 'md:p-6' : ''}`}>
        <div className="text-xs text-primary font-medium mb-2">{category}</div>
        <h3 className={`font-semibold mb-2 line-clamp-2 ${featured ? 'text-xl md:text-2xl' : ''}`}>{title}</h3>
        <p className={`text-sm text-muted-foreground mb-3 ${featured ? 'line-clamp-3' : 'line-clamp-2'}`}>{excerpt}</p>
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

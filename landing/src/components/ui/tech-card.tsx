import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "./card";

interface TechCardProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  className?: string;
  index?: number;
}

export const TechCard: React.FC<TechCardProps> = ({
  title,
  description,
  icon: Icon,
  className,
  // We're accepting index but not using it directly - this is to match the API used in TechSection
  index: _index,
}) => {
  return (
    <Card 
      className={cn("backdrop-blur-sm group", className)} 
      hoverEffect="glow"
      animateIn
      variant="outline"
    >
      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
      
      <CardHeader className="relative z-10">
        {Icon && (
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2 text-primary animate-scale-in">
            <Icon size={24} />
          </div>
        )}
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};

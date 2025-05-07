import { Palette } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { ColorTheme } from "@/contexts/theme-constants";
import { Button } from "./button";
import { cn } from "@/lib/utils";

// Define theme options with proper typing
const themes: Array<{name: string; value: ColorTheme; color: string}> = [
  { name: "Purple", value: "purple", color: "bg-[hsl(262,70%,60%)]" },
  { name: "Blue", value: "blue", color: "bg-[hsl(221,83%,53%)]" },
  { name: "Orange", value: "orange", color: "bg-[hsl(24,95%,53%)]" }
];

export function ColorThemeToggle() {
  const { colorTheme, setColorTheme } = useTheme();

  // When button is clicked, cycle through the available themes
  const cycleTheme = () => {
    const currentIndex = themes.findIndex(t => t.value === colorTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setColorTheme(themes[nextIndex].value);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full relative overflow-hidden"
      onClick={cycleTheme}
    >
      <Palette className="h-[1.2rem] w-[1.2rem] z-10" />
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 h-1.5 transition-colors", 
          themes.find(t => t.value === colorTheme)?.color || "bg-primary"
        )} 
      />
    </Button>
  );
}

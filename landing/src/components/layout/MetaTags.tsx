import * as React from "react";
import { Helmet } from "react-helmet-async";
import { useTheme } from "@/hooks/use-theme";

interface MetaTagsProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export function MetaTags({
  title = "Accord AI | AI-powered Contract Generation and Analysis",
  description = "Accord AI streamlines contract creation and analysis with powerful AI capabilities, saving time and reducing legal risks.",
  image = "/images/accord-ai-social.png",
  url = "https://accordify.ai"
}: MetaTagsProps) {
  const { modeTheme } = useTheme();
  
  // Dynamically set theme-color meta tag based on current theme
  const themeColor = React.useMemo(() => {
    if (modeTheme === "dark") {
      return "#1E1E1E"; // Dark mode background
    } else {
      return "#FFFFFF"; // Light mode background
    }
  }, [modeTheme]);
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Theme color for mobile browsers */}
      <meta name="theme-color" content={themeColor} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Version badge */}
      <meta name="app-version" content={"1.0.0"} />
    </Helmet>
  );
}

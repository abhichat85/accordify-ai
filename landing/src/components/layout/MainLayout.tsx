import * as React from "react";
import { ScrollTop } from "./ScrollTop";
import { CookieBanner } from "./CookieBanner";
import { MetaTags } from "./MetaTags";

interface MainLayoutProps {
  children: React.ReactNode;
  meta?: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
  };
}

export function MainLayout({ children, meta }: MainLayoutProps) {
  return (
    <>
      {/* Meta tags for SEO and social sharing */}
      <MetaTags {...meta} />
      
      {/* Main content area */}
      <div className="flex flex-col min-h-screen">
        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
      
      {/* Global UI components */}
      <ScrollTop />
      <CookieBanner />
    </>
  );
}

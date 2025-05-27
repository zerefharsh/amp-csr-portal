"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function MainLayout({ children, title, subtitle }: MainLayoutProps) {
  return (
    <div className="csr-page flex overflow-hidden">
      {/* Skip to main content link for keyboard navigation */}
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header title={title} subtitle={subtitle} />
        
        {/* Main Content */}
        <main 
          className="csr-main csr-main flex-1 overflow-y-auto px-6 py-8"
          id="main-content"
          role="main"
          aria-labelledby="page-title"
          aria-describedby={subtitle ? "page-subtitle" : undefined}
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
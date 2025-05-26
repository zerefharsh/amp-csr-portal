"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NotificationsDropdown } from "../notifications/notifications-dropdown";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement global search functionality
      console.log("Searching for:", searchQuery);
    }
  };

  return (
    <header 
      className="csr-header"
      role="banner"
    >
      {/* Left side - Title and subtitle */}
      <div className="flex items-center space-x-4">
        <div>
          <h1 
            className="text-2xl font-bold text-foreground"
            id="page-title"
          >
            {title}
          </h1>
          {subtitle && (
            <p 
              className="text-sm text-muted-foreground"
              id="page-subtitle"
              aria-describedby="page-title"
            >
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Live status indicator */}
        <div 
          className="flex items-center space-x-2 text-sm text-muted-foreground"
          role="status"
          aria-live="polite"
          aria-label="System status"
        >
          <span>Live</span>
          <div 
            className="w-2 h-2 bg-success rounded-full animate-pulse" 
            aria-hidden="true"
            title="System is online and operational"
          />
        </div>
      </div>

      {/* Right side - Search and notifications */}
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <form 
          onSubmit={handleSearch} 
          className="search-input"
          role="search"
          aria-label="Global search"
        >
          <label htmlFor="global-search" className="sr-only">
            Search members, subscriptions, and support tickets
          </label>
          <Search 
            className="search-icon" 
            aria-hidden="true"
          />
          <Input
            id="global-search"
            type="search"
            placeholder="Search Members, subscriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-80 pl-10 bg-background"
            aria-describedby="search-help"
          />
          <div id="search-help" className="sr-only">
            Search across all members, subscriptions, and support tickets. Press Enter to search.
          </div>
        </form>

        {/* Notifications */}
        <NotificationsDropdown unreadCount={3} />

        {/* Quick Actions Indicator */}
        <div 
          className="hidden sm:flex items-center space-x-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full"
          role="status"
          aria-live="polite"
          aria-label="Last data update time"
        >
          <span>Last updated: 2m ago</span>
        </div>
      </div>
    </header>
  );
}
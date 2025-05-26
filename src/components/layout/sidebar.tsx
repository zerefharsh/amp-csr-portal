"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Headphones,
  Car,
  Settings,
  User,
  FileBarChart
} from "lucide-react";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "View overview and key metrics"
  },
  {
    title: "Members",
    href: "/members",
    icon: Users,
    description: "Manage customer accounts"
  },
  {
    title: "Subscriptions",
    href: "/subscriptions",
    icon: CreditCard,
    description: "Manage vehicle subscriptions"
  },
  {
    title: "Support",
    href: "/support",
    icon: Headphones,
    description: "Handle customer support tickets"
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileBarChart,
    description: "View analytics and reports"
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href: string) => {
    if (!mounted) return false; // Prevent hydration mismatch
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside 
      className="csr-sidebar"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center"
            role="img"
            aria-label="AMP logo"
          >
            <Car className="h-5 w-5 text-sidebar-primary-foreground" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">AMP CSR</h1>
            <p className="text-xs text-sidebar-foreground/60" aria-label="Application version">Portal v2.1</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav 
        className="flex-1 p-4 space-y-1"
        role="navigation"
        aria-label="Main menu"
      >
        <ul role="list" className="space-y-1">
          {navigationItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href} role="listitem">
                <Link
                  href={item.href}
                  className={cn(
                    "nav-item",
                    active ? "nav-item-active" : "nav-item-inactive"
                  )}
                  aria-current={active ? "page" : undefined}
                  aria-label={`${item.title} - ${item.description}`}
                  title={item.description}
                >
                  <item.icon 
                    className="h-5 w-5" 
                    aria-hidden="true"
                  />
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div 
            className="w-9 h-9 bg-sidebar-accent rounded-full flex items-center justify-center"
            role="img"
            aria-label="User avatar"
          >
            <User className="h-4 w-4 text-sidebar-accent-foreground" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              Sarah Johnson
            </p>
            <p className="text-xs text-sidebar-foreground/60">CSR Manager</p>
          </div>
          <button 
            className="text-sidebar-foreground/60 hover:text-sidebar-foreground p-1 rounded-md hover:bg-sidebar-accent/50 transition-colors"
            aria-label="User settings and preferences"
            title="Settings"
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
}
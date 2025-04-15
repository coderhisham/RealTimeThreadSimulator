"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Server, 
  Activity, 
  ScrollText
} from "lucide-react";

interface SidebarNavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  variant: "default" | "ghost" | "outline";
}

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  
  const navItems: SidebarNavItem[] = [
    {
      title: "Thread Manager",
      href: "/",
      icon: <Home className="h-5 w-5" />,
      variant: "default",
    },
    {
      title: "Many-to-One",
      href: "/many-to-one",
      icon: <Server className="h-5 w-5" />,
      variant: "ghost",
    },
    {
      title: "One-to-One",
      href: "/one-to-one",
      icon: <Server className="h-5 w-5" />,
      variant: "ghost",
    },
    {
      title: "Many-to-Many",
      href: "/many-to-many",
      icon: <Server className="h-5 w-5" />,
      variant: "ghost",
    },
    {
      title: "Visualization",
      href: "/visualization",
      icon: <Activity className="h-5 w-5" />,
      variant: "ghost",
    },
    {
      title: "System Logs",
      href: "/logs",
      icon: <ScrollText className="h-5 w-5" />,
      variant: "ghost",
    }
  ];

  return (
    <div className={cn("flex flex-col h-full space-y-4 py-4", className)}>
      <div className="px-4 py-2">
        <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
          Thread Simulator
        </h2>
        <div className="space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "default" : "ghost"}
              size="sm"
              className={cn(
                "w-full justify-start",
                pathname === item.href
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
              asChild
            >
              <Link
                href={item.href}
                className="flex items-center gap-2"
              >
                {item.icon}
                {item.title}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
} 
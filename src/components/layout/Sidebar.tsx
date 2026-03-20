"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calculator,
  BookOpen,
  Languages,
  Type,
  ClipboardCheck,
  AlertCircle,
  LayoutDashboard,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Math", href: "/math", icon: Calculator },
  { name: "Hebrew", href: "/hebrew", icon: BookOpen },
  { name: "English", href: "/english", icon: Languages },
  { name: "Vocabulary", href: "/vocabulary", icon: Type },
  { name: "Tests", href: "/tests", icon: ClipboardCheck },
  { name: "Mistakes", href: "/mistakes", icon: AlertCircle },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Admin", href: "/admin", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-screen w-64 bg-slate-50 border-r border-slate-200">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-indigo-600">Psychometric</h1>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

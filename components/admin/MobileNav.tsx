"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  TrendingUp,
  Users,
  Building2,
  Mail,
  FileText,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

// @ts-ignore - Client component event handler
export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "clients", label: "Clients", icon: Users },
    { id: "projects", label: "Projects", icon: Building2 },
    { id: "newsletter", label: "Newsletter", icon: Mail },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "messages", label: "Messages", icon: MessageSquare },
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setIsOpen(false);
  };

  const activeTabLabel =
    tabs.find((tab) => tab.id === activeTab)?.label || "Menu";

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <Menu className="h-5 w-5" />
            <span className="font-medium">{activeTabLabel}</span>
          </span>
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="lg:hidden mb-4 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                    activeTab === tab.id
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

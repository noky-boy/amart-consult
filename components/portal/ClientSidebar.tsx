// amart-consult/components/portal/ClientSidebar.tsx
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  TrendingUp,
  Clock,
  Camera,
  FileText,
  MessageSquare,
  LucideProps,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

// Define a type for our tab objects to solve the TypeScript error
type TabItem = {
  id: "overview" | "timeline" | "photos" | "documents" | "messages";
  label: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  badge?: number; // Make badge optional
};

type ClientSidebarProps = {
  activeTab: TabItem["id"];
  onTabChange: (tab: TabItem["id"]) => void;
  photoCount: number;
  documentCount: number;
  unreadMessagesCount: number;
};

export default function ClientSidebar({
  activeTab,
  onTabChange,
  photoCount,
  documentCount,
  unreadMessagesCount,
}: ClientSidebarProps) {
  // Apply the TabItem type to the array
  const tabs: TabItem[] = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "timeline", label: "Timeline", icon: Clock },
    { id: "photos", label: `Photos (${photoCount})`, icon: Camera },
    { id: "documents", label: `Documents (${documentCount})`, icon: FileText },
    {
      id: "messages",
      label: "Messages",
      icon: MessageSquare,
      badge: unreadMessagesCount,
    },
  ];

  return (
    <aside className="w-64 bg-white/70 backdrop-blur-sm border-r border-slate-200/60">
      <nav className="p-6">
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-200 transform scale-105"
                  : "text-slate-700 hover:bg-slate-100 hover:scale-102 hover:shadow-sm"
              }`}
            >
              <tab.icon className="mr-3 h-4 w-4" />
              <span className="flex-1 text-left">{tab.label}</span>
              {/* This runtime check is still good practice */}
              {tab.badge && tab.badge > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-3 text-center">
            Your Project Team
          </h3>
          <div className="flex items-center justify-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                AM
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p className="text-xs font-medium text-slate-700">
                Amart Consult
              </p>
              <p className="text-xs text-slate-500">Your Architecture Team</p>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
}

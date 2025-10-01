// amart-consult/components/portal/ClientSidebar.tsx
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  TrendingUp,
  Clock,
  Camera,
  FileText,
  MessageSquare,
  LucideProps,
  X,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes, useEffect } from "react";

type TabItem = {
  id: "overview" | "timeline" | "photos" | "documents" | "messages";
  label: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  badge?: number;
};

type ClientSidebarProps = {
  activeTab: TabItem["id"];
  onTabChange: (tab: TabItem["id"]) => void;
  photoCount: number;
  documentCount: number;
  unreadMessagesCount: number;
  isMobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
};

export default function ClientSidebar({
  activeTab,
  onTabChange,
  photoCount,
  documentCount,
  unreadMessagesCount,
  isMobileMenuOpen,
  onCloseMobileMenu,
}: ClientSidebarProps) {
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

  const handleTabClick = (tabId: TabItem["id"]) => {
    onTabChange(tabId);
    onCloseMobileMenu(); // Close mobile menu when tab is selected
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onCloseMobileMenu}
        />
      )}

      {/* Sidebar - Drawer on Mobile, Fixed on Desktop */}
      <aside
        className={`
          fixed lg:static
          top-0 left-0 bottom-0
          w-64 lg:w-64
          bg-white/95 lg:bg-white/70 backdrop-blur-sm
          border-r border-slate-200/60
          z-50 lg:z-auto
          transform transition-transform duration-300 ease-in-out
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <nav className="p-4 sm:p-6 h-full flex flex-col">
          {/* Mobile Close Button */}
          <div className="lg:hidden flex items-center justify-between mb-4 pb-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">Menu</h2>
            <button
              onClick={onCloseMobileMenu}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="space-y-2 flex-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full flex items-center px-3 sm:px-4 py-2.5 sm:py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-200 transform scale-105"
                    : "text-slate-700 hover:bg-slate-100 hover:scale-102 hover:shadow-sm"
                }`}
              >
                <tab.icon className="mr-2 sm:mr-3 h-4 w-4 flex-shrink-0" />
                <span className="flex-1 text-left">{tab.label}</span>
                {tab.badge && tab.badge > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse flex-shrink-0">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Project Team Card */}
          <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-700 mb-2 sm:mb-3 text-center">
              Your Project Team
            </h3>
            <div className="flex items-center justify-center space-x-2 sm:space-x-3">
              <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
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
    </>
  );
}

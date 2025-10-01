// amart-consult/components/portal/ClientHeader.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Settings,
  LogOut,
  ArrowLeft,
  Building2,
  Menu,
} from "lucide-react";
import type { Client, Project } from "@/lib/supabase";

type ClientHeaderProps = {
  client: Client;
  currentProject?: Project;
  unreadMessagesCount: number;
  onShowSettings: () => void;
  onLogout: () => void;
  onToggleMobileMenu: () => void;
};

export default function ClientHeader({
  client,
  currentProject,
  unreadMessagesCount,
  onShowSettings,
  onLogout,
  onToggleMobileMenu,
}: ClientHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-40 shadow-sm">
      <div className="px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          {/* Left Section - Logo and Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
            {/* Hamburger Menu - Mobile Only */}
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5 text-slate-700" />
            </button>

            <Link
              href="/"
              className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0"
            >
              <Image
                src="/images/amart-logo.png"
                alt="Amart Consult"
                width={100}
                height={33}
                className="sm:w-[120px] sm:h-[40px]"
              />
            </Link>

            {/* Desktop Divider */}
            <div className="hidden sm:block h-6 w-px bg-slate-300"></div>

            {/* Project Info - Responsive */}
            {currentProject ? (
              <div className="hidden sm:flex items-center space-x-3 min-w-0">
                <Link href="/portal/projects">
                  <Button variant="ghost" size="sm" className="hidden md:flex">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    All Projects
                  </Button>
                </Link>
                <div className="hidden md:block h-6 w-px bg-slate-300"></div>
                <div className="flex items-center space-x-2 min-w-0">
                  <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 flex-shrink-0" />
                  <h1 className="text-sm sm:text-lg font-semibold text-slate-800 truncate">
                    {currentProject.project_title}
                  </h1>
                </div>
              </div>
            ) : (
              <h1 className="hidden sm:block text-lg sm:text-xl font-serif font-bold text-slate-800">
                Client Portal
              </h1>
            )}
          </div>

          {/* Right Section - Notifications and User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {/* Notification Bell */}
            <div className="relative">
              <Bell className="h-4 w-4 text-slate-400" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </div>

            {/* User Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 bg-slate-50 rounded-full px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-slate-100 transition-colors"
              >
                <Avatar className="h-7 w-7 sm:h-8 sm:w-8 ring-2 ring-indigo-100">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-semibold">
                    {client.first_name[0]}
                    {client.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm font-medium text-slate-700">
                  {client.first_name} {client.last_name}
                </span>
                <svg
                  className={`hidden sm:block h-4 w-4 text-slate-400 transition-transform ${
                    showUserMenu ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                  {/* Mobile: Show user name */}
                  <div className="sm:hidden px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-900">
                      {client.first_name} {client.last_name}
                    </p>
                    <p className="text-xs text-slate-500">{client.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      onShowSettings();
                      setShowUserMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Settings className="h-4 w-4 mr-3 text-slate-500" />
                    Change Password
                  </button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={() => {
                      onLogout();
                      setShowUserMenu(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Project Title - Shows below header on small screens */}
        {currentProject && (
          <div className="sm:hidden mt-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <Building2 className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                <h1 className="text-sm font-semibold text-slate-800 truncate">
                  {currentProject.project_title}
                </h1>
              </div>
              <Link href="/portal/projects">
                <Button variant="ghost" size="sm" className="text-xs">
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  All
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

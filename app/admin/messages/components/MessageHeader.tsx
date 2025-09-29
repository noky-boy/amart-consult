"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, MessageSquare, FileText } from "lucide-react";

type ActiveTab = "compose" | "conversations" | "templates";

interface MessageHeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export function MessageHeader({ activeTab, setActiveTab }: MessageHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="h-6 w-px bg-slate-300" />
            <Image
              src="/images/amart-logo.png"
              alt="Amart Consult"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
            <h1 className="text-xl font-semibold text-slate-900">Messages</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === "compose" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("compose")}
            >
              <Send className="h-4 w-4 mr-2" />
              Compose
            </Button>
            <Button
              variant={activeTab === "conversations" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("conversations")}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Conversations
            </Button>
            <Button
              variant={activeTab === "templates" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("templates")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Templates
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

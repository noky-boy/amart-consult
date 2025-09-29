"use client";

import React, { Suspense, useState } from "react";
import { useMessageSystem } from "./useMessageSystem";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { MessageHeader } from "./components/MessageHeader";
import { ComposeTab } from "./components/ComposeTab";
import { ConversationFilters } from "./components/ConversationFilters";
import { ConversationView } from "./components/ConversationView";
import { TemplatesTab } from "./components/TemplatesTab";

function MessagesSystem() {
  const [activeTab, setActiveTab] = useState<
    "compose" | "conversations" | "templates"
  >("compose");
  const messageSystem = useMessageSystem();

  if (messageSystem.loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-indigo-600 mx-auto mb-4 animate-spin" />
          <p className="text-slate-600">Loading Messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <MessageHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto p-6">
        {messageSystem.error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{messageSystem.error}</AlertDescription>
          </Alert>
        )}

        {activeTab === "compose" && <ComposeTab {...messageSystem} />}

        {activeTab === "conversations" && (
          <div className="space-y-6">
            <ConversationFilters {...messageSystem} />
            <ConversationView {...messageSystem} setActiveTab={setActiveTab} />
          </div>
        )}

        {activeTab === "templates" && (
          <TemplatesTab
            messageTemplates={messageSystem.messageTemplates}
            handleTemplateSelect={messageSystem.handleTemplateSelect}
            setActiveTab={setActiveTab}
          />
        )}
      </main>
    </div>
  );
}

export default function MessagesSytemPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-indigo-600 mx-auto mb-4 animate-spin" />
          <p className="text-slate-600">Loading Messages...</p>
        </div>
      }
    >
      <MessagesSystem />
    </Suspense>
  );
}

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import type { UseMessageSystemReturn } from "../useMessageSystem";

interface TemplatesTabProps {
  messageTemplates: UseMessageSystemReturn["messageTemplates"];
  handleTemplateSelect: UseMessageSystemReturn["handleTemplateSelect"];
  setActiveTab: (tab: "compose") => void;
}

export function TemplatesTab({
  messageTemplates,
  handleTemplateSelect,
  setActiveTab,
}: TemplatesTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Message Templates</CardTitle>
        <CardDescription>
          Pre-written templates for common construction and project
          communications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {messageTemplates.map((template) => (
            <Card key={template.id} className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <CardDescription>Subject: {template.subject}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-900 whitespace-pre-wrap">
                      {template.message.substring(0, 200)}...
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        handleTemplateSelect(template.id);
                        setActiveTab("compose");
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

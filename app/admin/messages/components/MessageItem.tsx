"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import type { ClientMessage } from "@/lib/supabase";

interface MessageItemProps {
  msg: ClientMessage;
}

export function MessageItem({ msg }: MessageItemProps) {
  const isAdmin = msg.sender_type === "admin";
  const alignmentClass = isAdmin ? "ml-auto" : "mr-auto";
  const colorClass = isAdmin
    ? "bg-indigo-50 border-indigo-200"
    : "bg-slate-50 border-slate-200";

  return (
    <div
      className={`p-4 rounded-lg border w-full max-w-[85%] ${alignmentClass} ${colorClass}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={isAdmin ? "default" : "secondary"}>
            {msg.sender_name}
          </Badge>
          {!msg.is_read && msg.sender_type === "client" && (
            <Badge variant="destructive">Unread</Badge>
          )}
          {msg.project_id ? (
            <Badge
              variant="outline"
              className="bg-green-50 border-green-200 text-green-800"
            >
              Project-specific
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-blue-50 border-blue-200 text-blue-800"
            >
              Client-level
            </Badge>
          )}
        </div>
        <span className="text-sm text-slate-500 flex-shrink-0 ml-2">
          {new Date(msg.created_at).toLocaleString()}
        </span>
      </div>
      <p className="text-slate-900 whitespace-pre-wrap">{msg.message}</p>
    </div>
  );
}

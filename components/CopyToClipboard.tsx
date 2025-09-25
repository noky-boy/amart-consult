"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface CopyToClipboardProps {
  text: string;
  variant?: "outline" | "ghost" | "default" | "destructive" | "secondary";
  size?: "sm" | "default" | "lg" | "icon";
  className?: string;
  showText?: boolean;
  successMessage?: string;
}

export default function CopyToClipboard({
  text,
  variant = "outline",
  size = "sm",
  className = "",
  showText = false,
  successMessage = "Copied!",
}: CopyToClipboardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        // Modern clipboard API
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers or non-HTTPS
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        textArea.remove();
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      // You could show a toast notification here instead of alert
      alert("Failed to copy to clipboard");
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={copyToClipboard}
      className={`transition-all duration-200 ${
        copied ? "bg-green-50 border-green-200 text-green-700" : ""
      } ${className}`}
      title={copied ? successMessage : "Copy to clipboard"}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {showText && (
        <span className="ml-2">{copied ? successMessage : "Copy"}</span>
      )}
    </Button>
  );
}

"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "@/components/ui/icons";

interface WhatsAppMessage {
  text: string;
  context: string;
}

export default function WhatsAppFloat() {
  const [showOptions, setShowOptions] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component only renders on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const whatsappMessages: WhatsAppMessage[] = [
    {
      text: "Hello! I'm interested in Amart Consult's architectural services.",
      context: "General Inquiry",
    },
    {
      text: "Hi! I'd like to get a quote for my residential project.",
      context: "Quote Request",
    },
    {
      text: "Hello! I saw your portfolio and would like to discuss a similar project.",
      context: "Portfolio Inquiry",
    },
    {
      text: "Hi! I need help with commercial building design. Can we discuss?",
      context: "Commercial Project",
    },
  ];

  const handleWhatsAppClick = (message?: string) => {
    try {
      const phoneNumber = "233543543356"; // +233 54 354 3356
      const defaultMessage =
        "Hello! I'm interested in Amart Consult's architectural services.";
      const finalMessage = message || defaultMessage;
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        finalMessage
      )}`;

      console.log("Opening WhatsApp URL:", whatsappUrl); // Debug log

      // Track click for analytics (if gtag is available)
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "whatsapp_click", {
          event_category: "engagement",
          event_label: message ? "contextual_message" : "default_message",
        });
      }

      // Open WhatsApp
      if (typeof window !== "undefined") {
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      }

      setShowOptions(false);
    } catch (error) {
      console.error("Error opening WhatsApp:", error);
      // Fallback: try to navigate to the URL
      if (typeof window !== "undefined") {
        window.location.href = `https://wa.me/233543543356?text=${encodeURIComponent(
          message ||
            "Hello! I'm interested in Amart Consult's architectural services."
        )}`;
      }
    }
  };

  const handleMainButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // On mobile, directly open WhatsApp. On desktop, show options
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    if (isMobile) {
      handleWhatsAppClick();
    } else {
      setShowOptions(!showOptions);
    }
  };

  // Don't render on server to avoid hydration issues
  if (!isMounted) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Message Options Popup */}
      {showOptions && (
        <>
          {/* Backdrop to close options */}
          <div
            className="fixed inset-0 bg-transparent z-40"
            onClick={() => setShowOptions(false)}
          />

          <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80 mb-2 z-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-indigo-deep text-sm">
                Quick Messages
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowOptions(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {whatsappMessages.map((msg, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWhatsAppClick(msg.text);
                  }}
                  className="w-full text-left p-3 rounded-lg border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all duration-200 group"
                >
                  <div className="font-medium text-sm text-indigo-deep group-hover:text-green-700">
                    {msg.context}
                  </div>
                  <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {msg.text}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleWhatsAppClick();
                }}
                className="w-full text-center p-2 text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
              >
                Send Custom Message
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main WhatsApp Button */}
      <div className="relative">
        <button
          onClick={handleMainButtonClick}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group relative z-10"
          aria-label="Contact us on WhatsApp"
          type="button"
        >
          <MessageCircle className="w-6 h-6" />
        </button>

        {/* Pulse animation */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20 pointer-events-none"></div>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          {showOptions ? "Quick messages" : "Chat with us on WhatsApp"}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  );
}

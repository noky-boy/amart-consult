"use client"

import { useState } from "react"
import { MessageCircle, X } from "lucide-react"

interface WhatsAppMessage {
  text: string
  context: string
}

export default function WhatsAppFloat() {
  const [showOptions, setShowOptions] = useState(false)

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
  ]

  const handleWhatsAppClick = (message?: string) => {
    const phoneNumber = "233543543356" // Updated to actual number
    const defaultMessage = "Hello! I'm interested in Amart Consult's architectural services."
    const finalMessage = message || defaultMessage
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(finalMessage)}`

    // Track click for analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "whatsapp_click", {
        event_category: "engagement",
        event_label: message ? "contextual_message" : "default_message",
      })
    }

    window.open(whatsappUrl, "_blank")
    setShowOptions(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Message Options Popup */}
      {showOptions && (
        <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80 mb-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-indigo-deep text-sm">Quick Messages</h3>
            <button
              onClick={() => setShowOptions(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            {whatsappMessages.map((msg, index) => (
              <button
                key={index}
                onClick={() => handleWhatsAppClick(msg.text)}
                className="w-full text-left p-3 rounded-lg border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all duration-200 group"
              >
                <div className="font-medium text-sm text-indigo-deep group-hover:text-green-700">{msg.context}</div>
                <div className="text-xs text-gray-600 mt-1 line-clamp-2">{msg.text}</div>
              </button>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100">
            <button
              onClick={() => handleWhatsAppClick()}
              className="w-full text-center p-2 text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              Send Custom Message
            </button>
          </div>
        </div>
      )}

      {/* Main WhatsApp Button */}
      <div className="relative">
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
          aria-label="Contact us on WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </button>

        {/* Pulse animation */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Chat with us on WhatsApp
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  )
}

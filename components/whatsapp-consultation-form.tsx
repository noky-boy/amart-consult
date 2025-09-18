"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  X,
  MessageCircle,
  User,
  Mail,
  Phone,
  MessageSquare,
  Send,
} from "@/components/ui/icons";

interface WhatsAppConsultationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WhatsAppConsultationForm({
  isOpen,
  onClose,
}: WhatsAppConsultationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    projectType: "residential",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to database first
      const response = await fetch("/api/whatsapp-consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          projectType: formData.projectType,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save consultation request");
      }

      // If database save successful, then open WhatsApp (your existing code)
      const whatsappMessage = `🗏️ *New Consultation Request - Amart Consult*

👤 *Name:* ${formData.name}
📧 *Email:* ${formData.email}
📱 *Phone:* ${formData.phone}
🏠 *Project Type:* ${
        formData.projectType.charAt(0).toUpperCase() +
        formData.projectType.slice(1)
      }

💬 *Message:*
${formData.message}

---
*Sent via Amart Consult Website*`;

      const encodedMessage = encodeURIComponent(whatsappMessage);
      const whatsappNumber = "233543543356";
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      window.open(whatsappURL, "_blank");

      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          projectType: "residential",
        });
        setIsSubmitting(false);
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error saving consultation:", error);
      setIsSubmitting(false);
      // You might want to show an error message to the user here
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl">
        <CardHeader className="relative bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold">
                WhatsApp Consultation
              </CardTitle>
              <p className="text-green-100 text-sm">
                Get instant response via WhatsApp
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <User className="w-4 h-4 inline mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="+233 XX XXX XXXX"
              />
            </div>

            <div>
              <label
                htmlFor="projectType"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Project Type
              </label>
              <select
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="renovation">Renovation</option>
                <option value="consultation">General Consultation</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Project Details *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                placeholder="Tell us about your project, budget range, timeline, and any specific requirements..."
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send via WhatsApp
                </>
              )}
            </Button>
          </form>

          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-700 text-center">
              📱 This will open WhatsApp with your message pre-filled. You can
              review and send it directly to our team.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

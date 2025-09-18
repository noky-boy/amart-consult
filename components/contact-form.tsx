"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Send,
} from "@/components/ui/icons";

// Declare grecaptcha for TypeScript
declare global {
  interface Window {
    grecaptcha: any;
  }
}

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "residential",
    location: "",
    budgetRange: "",
    serviceInterest: [] as string[],
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isRecaptchaLoaded, setIsRecaptchaLoaded] = useState(false);

  useEffect(() => {
    // Load reCAPTCHA Enterprise script
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.grecaptcha) {
        window.grecaptcha.enterprise.ready(() => {
          setIsRecaptchaLoaded(true);
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector(
        `script[src*="recaptcha/enterprise.js"]`
      );
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceInterestChange = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceInterest: prev.serviceInterest.includes(service)
        ? prev.serviceInterest.filter((s) => s !== service)
        : [...prev.serviceInterest, service],
    }));
  };

  const executeRecaptcha = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!window.grecaptcha || !isRecaptchaLoaded) {
        reject(new Error("reCAPTCHA not loaded"));
        return;
      }

      window.grecaptcha.enterprise.ready(async () => {
        try {
          const token = await window.grecaptcha.enterprise.execute(
            process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
            { action: "CONTACT_FORM" }
          );
          console.log("Generated reCAPTCHA token:", token);

          resolve(token);
        } catch (error) {
          console.error("reCAPTCHA execution error:", error);
          reject(error);
        }
      });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Execute reCAPTCHA Enterprise
      const recaptchaToken = await executeRecaptcha();

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        projectType: "residential",
        location: "",
        budgetRange: "",
        serviceInterest: [],
        message: "",
      });
    } catch (err) {
      console.error("Form submission error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-green-900 mb-2">
            Message Sent Successfully!
          </h3>
          <p className="text-green-700 mb-4">
            Thank you for contacting us. We'll get back to you within 24 hours.
          </p>
          <Button
            onClick={() => setIsSubmitted(false)}
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
          >
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-serif text-indigo-deep">
          Send Us a Message
        </CardTitle>
        <p className="text-gray-600">
          Fill out the form below and we'll get back to you soon.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <User className="w-4 h-4 inline mr-2" />
                Full Name *
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Your full name"
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
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number *
              </label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="+233 XX XXX XXXX"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <MapPin className="w-4 h-4 inline mr-2" />
                Project Location *
              </label>
              <Input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="City, Region"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-deep focus:border-transparent"
                suppressHydrationWarning={true}
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="renovation">Renovation</option>
                <option value="consultation">General Consultation</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="budgetRange"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Budget Range (Optional)
              </label>
              <select
                id="budgetRange"
                name="budgetRange"
                value={formData.budgetRange}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-deep focus:border-transparent"
                suppressHydrationWarning={true}
              >
                <option value="">Select budget range</option>
                <option value="Under $50,000">Under $50,000</option>
                <option value="$50,000 - $100,000">$50,000 - $100,000</option>
                <option value="$100,000 - $200,000">$100,000 - $200,000</option>
                <option value="$200,000+">$200,000+</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Services Interested In (Optional)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Architectural Design",
                "Construction Management",
                "Bill of Quantities",
                "Project Consultation",
              ].map((service) => (
                <label key={service} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.serviceInterest.includes(service)}
                    onChange={() => handleServiceInterestChange(service)}
                    className="rounded border-gray-300 text-indigo-deep focus:ring-indigo-deep"
                  />
                  <span className="ml-2 text-sm text-gray-700">{service}</span>
                </label>
              ))}
            </div>
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
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-deep focus:border-transparent resize-none"
              placeholder="Tell us about your project vision, requirements, timeline, and any specific questions you have..."
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !isRecaptchaLoaded}
            className="w-full bg-indigo-deep hover:bg-indigo-deep/90 text-white py-3"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Sending Message...
              </>
            ) : !isRecaptchaLoaded ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Loading Security...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
          </Button>

          {/* reCAPTCHA badge will appear automatically */}
          <div className="text-xs text-gray-500 text-center mt-2">
            This site is protected by reCAPTCHA Enterprise and the Google{" "}
            <a
              href="https://policies.google.com/privacy"
              className="text-blue-600 hover:underline"
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="https://policies.google.com/terms"
              className="text-blue-600 hover:underline"
            >
              Terms of Service
            </a>{" "}
            apply.
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

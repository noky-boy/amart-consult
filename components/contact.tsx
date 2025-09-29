"use client";

import ContactFormModal from "./contact-form-modal";
import WhatsAppConsultationForm from "./whatsapp-consultation-form";
import { useState } from "react";
import { Phone, Mail, MessageCircle } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Contact = () => {
  const [showWhatsAppForm, setShowWhatsAppForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <section
      id="contact"
      className="py-16 bg-gradient-to-br from-sand-beige/20 to-white"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-indigo-deep mb-3">
            Let's Build Your Vision Together
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ready to start your architectural journey? Choose your preferred way
            to connect with us.
          </p>
        </div>

        {/* Compact Contact Cards */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Phone Card */}
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-deep/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-indigo-deep" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-indigo-deep mb-1">
                    Call Us
                  </h3>
                  <a
                    href="tel:+233543543356"
                    className="text-gray-600 hover:text-indigo-deep transition-colors"
                  >
                    +233 54 354 3356
                  </a>
                  <p className="text-sm text-gray-500">Nathan Amarkwei</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Card - Clickable */}
          <Card
            className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
            onClick={() => setShowContactForm(true)}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-deep/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-indigo-deep" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-indigo-deep mb-1">
                    Send a Message
                  </h3>
                  <p className="text-gray-600">Click to fill contact form</p>
                  <p className="text-sm text-gray-500">
                    We respond within 24hrs
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* WhatsApp CTA Section */}
        <div className="max-w-md mx-auto mt-8">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Quick WhatsApp Consultation
              </h3>
              <p className="text-sm text-green-700 mb-4">
                Need immediate assistance? Chat with us on WhatsApp for instant
                responses.
              </p>
              <Button
                onClick={() => setShowWhatsAppForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Start WhatsApp Chat
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Modals */}
        <ContactFormModal
          isOpen={showContactForm}
          onClose={() => setShowContactForm(false)}
        />

        <WhatsAppConsultationForm
          isOpen={showWhatsAppForm}
          onClose={() => setShowWhatsAppForm(false)}
        />
      </div>
    </section>
  );
};

export default Contact;

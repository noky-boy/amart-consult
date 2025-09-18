"use client";

import ContactForm from "./contact-form";
import WhatsAppConsultationForm from "./whatsapp-consultation-form";
import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Contact = () => {
  const [showWhatsAppForm, setShowWhatsAppForm] = useState(false);

  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-br from-sand-beige/20 to-white"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-indigo-deep mb-4">
            Let's Build Your Vision Together
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to start your architectural journey? Get in touch with us for
            a consultation or detailed project discussion.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent>
              <div className="w-12 h-12 bg-indigo-deep/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-indigo-deep" />
              </div>
              <h3 className="font-semibold text-indigo-deep mb-2">Call Us</h3>
              <a
                href="tel:+233543543356"
                className="text-gray-600 hover:text-indigo-deep"
              >
                +233 54 354 3356
              </a>
              <p className="text-sm text-gray-500 mt-1">Nathan Amarkwei</p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent>
              <div className="w-12 h-12 bg-indigo-deep/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-indigo-deep" />
              </div>
              <h3 className="font-semibold text-indigo-deep mb-2">Email Us</h3>
              <a
                href="mailto:amartconsult1@gmail.com"
                className="text-gray-600 hover:text-indigo-deep"
              >
                amartconsult1@gmail.com
              </a>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent>
              <div className="w-12 h-12 bg-indigo-deep/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-indigo-deep" />
              </div>
              <h3 className="font-semibold text-indigo-deep mb-2">Visit Us</h3>
              <p className="text-gray-600">Accra, Ghana</p>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>

            {/* WhatsApp Option */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-900 mb-2">
                    Quick WhatsApp Consultation
                  </h3>
                  <p className="text-green-700 mb-6">
                    Need immediate assistance? Chat with us directly on WhatsApp
                    for instant responses.
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

              <div className="bg-indigo-50 rounded-lg p-6">
                <h4 className="font-semibold text-indigo-deep mb-3">
                  What to expect:
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Response within 24 hours</li>
                  <li>• Detailed project consultation</li>
                  <li>• Custom proposal and timeline</li>
                  <li>• Free initial assessment</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Form Modal */}
        <WhatsAppConsultationForm
          isOpen={showWhatsAppForm}
          onClose={() => setShowWhatsAppForm(false)}
        />
      </div>
    </section>
  );
};

export default Contact;

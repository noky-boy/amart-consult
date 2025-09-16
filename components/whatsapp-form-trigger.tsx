"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import WhatsAppConsultationForm from "./whatsapp-consultation-form";

interface WhatsAppFormTriggerProps {
  triggerText?: string;
  className?: string;
  children?: React.ReactNode;
  size?: "sm" | "lg" | "default";
  variant?: "default" | "outline" | "ghost" | "link";
}

export default function WhatsAppFormTrigger({
  triggerText = "Get Free Consultation",
  className,
  children,
  size = "default",
  variant = "default",
}: WhatsAppFormTriggerProps) {
  const [isWhatsAppFormOpen, setIsWhatsAppFormOpen] = useState(false);

  const openWhatsAppForm = () => {
    setIsWhatsAppFormOpen(true);
  };

  const closeWhatsAppForm = () => {
    setIsWhatsAppFormOpen(false);
  };

  return (
    <>
      <Button
        onClick={openWhatsAppForm}
        className={className}
        size={size}
        variant={variant}
        suppressHydrationWarning
      >
        {children || triggerText}
      </Button>

      <WhatsAppConsultationForm
        isOpen={isWhatsAppFormOpen}
        onClose={closeWhatsAppForm}
      />
    </>
  );
}

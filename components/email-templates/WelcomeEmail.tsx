// components/email-templates/WelcomeEmail.tsx
import Image from "next/image";

interface WelcomeEmailProps {
  firstName?: string;
  websiteUrl?: string;
  logoUrl?: string;
}

export function WelcomeEmailPreview({
  firstName = "[First Name]",
  websiteUrl = "#",
  logoUrl = "/images/amart-logo.png",
}: WelcomeEmailProps) {
  return (
    <div className="bg-white max-w-2xl mx-auto shadow-lg">
      {/* Email Header with Logo */}
      <div className="bg-gradient-to-r from-indigo-600 to-red-600 p-8 text-center">
        <div className="bg-white inline-block p-4 rounded-lg mb-4">
          <Image
            src={logoUrl}
            alt="Amart Consult"
            width={120}
            height={40}
            className="object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome to Amart Consult!
        </h1>
        <p className="text-indigo-100">
          Your journey to exceptional architecture begins here
        </p>
      </div>

      {/* Email Body */}
      <div className="p-8">
        <p className="text-gray-700 mb-6">Hi {firstName},</p>
        <p className="text-gray-700 mb-6">
          Welcome to the Amart Consult family! I'm Nathan Amarteifio, founder
          and lead architect, and I'm thrilled you've joined our community of
          forward-thinking builders and dreamers.
        </p>
        <p className="text-gray-700 mb-6">
          Over the next few days, I'll be sharing insights from my 10+ years of
          experience in Ghana's construction industry, including:
        </p>
        <ul className="text-gray-700 mb-6 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-red-600 font-bold">•</span>
            How our unique service tiers can transform your project
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-600 font-bold">•</span>
            Exclusive portfolio highlights and case studies
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-600 font-bold">•</span>
            Real client success stories and testimonials
          </li>
        </ul>
        <div className="text-center mb-6">
          <a
            href={`${websiteUrl}/services`}
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded font-semibold"
          >
            Explore Our Services
          </a>
        </div>
        <div className="border-l-4 border-red-600 pl-4 mb-6">
          <p className="text-gray-700 italic">
            "Quality architecture isn't just about buildings—it's about creating
            spaces that enhance lives and communities." - Nathan Amarteifio
          </p>
        </div>
        <p className="text-gray-700">
          Best regards,
          <br />
          <strong>Nathan Amarteifio</strong>
          <br />
          <span className="text-sm text-gray-500">
            Founder & Lead Architect, Amart Consult
          </span>
        </p>
      </div>

      {/* Email Footer */}
      <div className="bg-gray-50 p-6 text-center text-sm text-gray-500 border-t">
        <div className="mb-4">
          <Image
            src={logoUrl}
            alt="Amart Consult"
            width={80}
            height={26}
            className="object-contain mx-auto opacity-60"
          />
        </div>
        <p className="font-semibold text-gray-700">Amart Consult</p>
        <p>Architectural Designs | Bill of Quantities | Construction</p>
        <p>+233 54 354 3356 | amartconsult1@gmail.com</p>
        <div className="mt-4 space-x-4">
          <a href={websiteUrl} className="text-indigo-600 hover:underline">
            Website
          </a>
          <a
            href={`${websiteUrl}/portfolio`}
            className="text-indigo-600 hover:underline"
          >
            Portfolio
          </a>
          <a href="#" className="text-indigo-600 hover:underline">
            Unsubscribe
          </a>
        </div>
      </div>
    </div>
  );
}

export function generateWelcomeEmailHTML({
  firstName = "{{first_name}}",
  websiteUrl = "{{website_url}}",
  logoUrl = "{{logo_url}}",
}: WelcomeEmailProps) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Amart Consult!</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f8fafc; font-family: Arial, sans-serif; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #4F46E5 0%, #DC2626 100%); padding: 40px; text-align: center; }
        .logo-container { background-color: white; display: inline-block; padding: 16px; border-radius: 8px; margin-bottom: 16px; }
        .body { padding: 40px; }
        .footer { background-color: #f9fafb; padding: 24px; text-align: center; font-size: 14px; color: #6b7280; border-top: 1px solid #e5e7eb; }
        .cta-button { background-color: #DC2626; color: white; padding: 16px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; }
        .quote-block { border-left: 4px solid #DC2626; padding-left: 16px; margin: 24px 0; font-style: italic; }
        ul { padding-left: 0; }
        li { list-style: none; margin-bottom: 8px; }
        li:before { content: "•"; color: #DC2626; font-weight: bold; margin-right: 8px; }
        @media only screen and (max-width: 600px) {
            .email-container { width: 100% !important; }
            .header, .body, .footer { padding: 20px !important; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo-container">
                <img src="${logoUrl}" alt="Amart Consult" width="120" height="40" style="display: block; max-width: 100%;">
            </div>
            <h1 style="color: white; font-size: 32px; margin: 0 0 8px 0;">Welcome to Amart Consult!</h1>
            <p style="color: #E0E7FF; margin: 0;">Your journey to exceptional architecture begins here</p>
        </div>
        
        <!-- Body -->
        <div class="body">
            <p style="color: #374151; margin-bottom: 24px;">Hi ${firstName},</p>
            <p style="color: #374151; margin-bottom: 24px;">Welcome to the Amart Consult family! I'm Nathan Amarteifio, founder and lead architect, and I'm thrilled you've joined our community of forward-thinking builders and dreamers.</p>
            <p style="color: #374151; margin-bottom: 24px;">Over the next few days, I'll be sharing insights from my 10+ years of experience in Ghana's construction industry, including:</p>
            
            <ul style="color: #374151; margin-bottom: 24px;">
                <li>How our unique service tiers can transform your project</li>
                <li>Exclusive portfolio highlights and case studies</li>
                <li>Real client success stories and testimonials</li>
            </ul>
            
            <div style="text-align: center; margin: 32px 0;">
                <a href="${websiteUrl}/services" class="cta-button">Explore Our Services</a>
            </div>
            
            <div class="quote-block">
                <p style="color: #374151; margin: 0;">"Quality architecture isn't just about buildings—it's about creating spaces that enhance lives and communities." - Nathan Amarteifio</p>
            </div>
            
            <p style="color: #374151; margin-bottom: 0;">
                Best regards,<br>
                <strong>Nathan Amarteifio</strong><br>
                <span style="font-size: 12px; color: #6b7280;">Founder & Lead Architect, Amart Consult</span>
            </p>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <img src="${logoUrl}" alt="Amart Consult" width="80" height="26" style="opacity: 0.6; margin-bottom: 16px; max-width: 100%;">
            <p style="font-weight: bold; color: #374151; margin: 8px 0;">Amart Consult</p>
            <p style="margin: 4px 0;">Architectural Designs | Bill of Quantities | Construction</p>
            <p style="margin: 4px 0;">+233 54 354 3356 | amartconsult1@gmail.com</p>
            <p style="margin: 16px 0 0 0;">
                <a href="${websiteUrl}" style="color: #4f46e5; margin: 0 8px; text-decoration: none;">Website</a>
                <a href="${websiteUrl}/portfolio" style="color: #4f46e5; margin: 0 8px; text-decoration: none;">Portfolio</a>
                <a href="{{unsubscribe_url}}" style="color: #4f46e5; margin: 0 8px; text-decoration: none;">Unsubscribe</a>
            </p>
        </div>
    </div>
</body>
</html>`;
}

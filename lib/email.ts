// lib/email.ts
import nodemailer from "nodemailer";
import { generateWelcomeEmailHTML } from "@/components/email-templates/WelcomeEmail";
import { generateNewsletterEmailHTML } from "@/components/email-templates/NewsletterEmail";
import { generateProjectUpdateEmailHTML } from "@/components/email-templates/ProjectUpdateEmail";

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

// Create transporter
const transporter = nodemailer.createTransport(emailConfig);

// Verify connection configuration
export const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log("Email server is ready to take our messages");
    return true;
  } catch (error) {
    console.error("Email server connection failed:", error);
    return false;
  }
};

// Base email interface
interface BaseEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

// Send email function
export const sendEmail = async (options: BaseEmailOptions) => {
  try {
    const mailOptions = {
      from: {
        name: "Amart Consult",
        address: process.env.SMTP_USER || "amartconsult1@gmail.com",
      },
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ""), // Strip HTML for text version
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error: error.message };
  }
};

// Welcome email types and function
interface WelcomeEmailData {
  to: string;
  firstName: string;
  websiteUrl?: string;
  logoUrl?: string;
}

export const sendWelcomeEmail = async (data: WelcomeEmailData) => {
  const htmlContent = generateWelcomeEmailHTML({
    firstName: data.firstName,
    websiteUrl:
      data.websiteUrl ||
      process.env.NEXT_PUBLIC_WEBSITE_URL ||
      "https://amartconsult.com",
    logoUrl:
      data.logoUrl ||
      `${
        process.env.NEXT_PUBLIC_WEBSITE_URL || "https://amartconsult.com"
      }/images/amart-logo.png`,
  });

  return await sendEmail({
    to: data.to,
    subject: "Welcome to Amart Consult!",
    html: htmlContent,
  });
};

// Newsletter email types and function
interface NewsletterEmailData {
  to: string | string[];
  month: string;
  year: string;
  featuredProject?: {
    title: string;
    description: string;
    imageUrl?: string;
    projectUrl?: string;
  };
  articles?: Array<{
    title: string;
    excerpt: string;
    url?: string;
  }>;
  tip?: {
    title: string;
    content: string;
  };
  websiteUrl?: string;
  logoUrl?: string;
}

export const sendNewsletterEmail = async (data: NewsletterEmailData) => {
  const htmlContent = generateNewsletterEmailHTML({
    month: data.month,
    year: data.year,
    featuredProject: data.featuredProject,
    articles: data.articles,
    tip: data.tip,
    websiteUrl:
      data.websiteUrl ||
      process.env.NEXT_PUBLIC_WEBSITE_URL ||
      "https://amartconsult.com",
    logoUrl:
      data.logoUrl ||
      `${
        process.env.NEXT_PUBLIC_WEBSITE_URL || "https://amartconsult.com"
      }/images/amart-logo.png`,
  });

  return await sendEmail({
    to: data.to,
    subject: `Amart Consult Monthly Update - ${data.month} ${data.year}`,
    html: htmlContent,
  });
};

// Project update email types and function
interface ProjectUpdateEmailData {
  to: string;
  clientName: string;
  projectName: string;
  weekNumber: number;
  status: "on-track" | "delayed" | "ahead" | "completed";
  progress: number;
  timeRemaining: string;
  updates?: Array<{
    title: string;
    description: string;
    date?: string;
  }>;
  photos?: Array<{
    url: string;
    caption: string;
  }>;
  nextPhase?: {
    title: string;
    description: string;
    startDate?: string;
    duration?: string;
  };
  projectManagerEmail?: string;
  websiteUrl?: string;
  logoUrl?: string;
}

export const sendProjectUpdateEmail = async (data: ProjectUpdateEmailData) => {
  const htmlContent = generateProjectUpdateEmailHTML({
    clientName: data.clientName,
    projectName: data.projectName,
    weekNumber: data.weekNumber,
    status: data.status,
    progress: data.progress,
    timeRemaining: data.timeRemaining,
    updates: data.updates,
    photos: data.photos,
    nextPhase: data.nextPhase,
    projectManagerEmail: data.projectManagerEmail || process.env.SMTP_USER,
    websiteUrl:
      data.websiteUrl ||
      process.env.NEXT_PUBLIC_WEBSITE_URL ||
      "https://amartconsult.com",
    logoUrl:
      data.logoUrl ||
      `${
        process.env.NEXT_PUBLIC_WEBSITE_URL || "https://amartconsult.com"
      }/images/amart-logo.png`,
  });

  return await sendEmail({
    to: data.to,
    subject: `Project Update: ${data.projectName} - Week ${data.weekNumber}`,
    html: htmlContent,
  });
};

// Password reset email
interface PasswordResetEmailData {
  to: string;
  firstName?: string;
  resetUrl: string;
  websiteUrl?: string;
  logoUrl?: string;
}

export const sendPasswordResetEmail = async (data: PasswordResetEmailData) => {
  const websiteUrl =
    data.websiteUrl ||
    process.env.NEXT_PUBLIC_WEBSITE_URL ||
    "https://amartconsult.com";
  const logoUrl = data.logoUrl || `${websiteUrl}/images/amart-logo.png`;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password - Amart Consult</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f8fafc; font-family: Arial, sans-serif; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #4F46E5 0%, #DC2626 100%); padding: 40px; text-align: center; }
        .logo-container { background-color: white; display: inline-block; padding: 16px; border-radius: 8px; margin-bottom: 16px; }
        .body { padding: 40px; }
        .footer { background-color: #f9fafb; padding: 24px; text-align: center; font-size: 14px; color: #6b7280; }
        .reset-button { background-color: #DC2626; color: white; padding: 16px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin: 24px 0; }
        .security-note { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo-container">
                <img src="${logoUrl}" alt="Amart Consult" width="120" height="40">
            </div>
            <h1 style="color: white; margin: 0;">Reset Your Password</h1>
        </div>
        
        <div class="body">
            <p style="color: #374151;">Hi${
              data.firstName ? ` ${data.firstName}` : ""
            },</p>
            <p style="color: #374151; margin-bottom: 24px;">We received a request to reset your password for your Amart Consult client portal account.</p>
            <p style="color: #374151; margin-bottom: 24px;">Click the button below to create a new password:</p>
            
            <div style="text-align: center;">
                <a href="${
                  data.resetUrl
                }" class="reset-button">Reset Password</a>
            </div>
            
            <div class="security-note">
                <p style="margin: 0; color: #92400e; font-size: 14px;"><strong>Security Note:</strong> This link will expire in 24 hours for your security. If you didn't request this password reset, please ignore this email.</p>
            </div>
            
            <p style="color: #374151; font-size: 14px;">If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="color: #4f46e5; font-size: 14px; word-break: break-all;">${
              data.resetUrl
            }</p>
            
            <p style="color: #374151; margin-top: 32px;">
                Best regards,<br>
                <strong>The Amart Consult Team</strong>
            </p>
        </div>
        
        <div class="footer">
            <img src="${logoUrl}" alt="Amart Consult" width="80" height="26" style="opacity: 0.6; margin-bottom: 16px;">
            <p>+233 54 354 3356 | amartconsult1@gmail.com</p>
            <p style="margin-top: 16px; font-size: 12px; color: #9ca3af;">If you have any questions, please contact our support team.</p>
        </div>
    </div>
</body>
</html>`;

  return await sendEmail({
    to: data.to,
    subject: "Reset Your Password - Amart Consult",
    html: htmlContent,
  });
};

// Bulk email function for newsletters
export const sendBulkEmails = async (emails: BaseEmailOptions[]) => {
  const results = [];

  for (const emailOptions of emails) {
    try {
      const result = await sendEmail(emailOptions);
      results.push({ ...result, recipient: emailOptions.to });

      // Add delay between emails to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      results.push({
        success: false,
        error: error.message,
        recipient: emailOptions.to,
      });
    }
  }

  return results;
};

// Email template validation
export const validateEmailTemplate = (html: string): boolean => {
  // Basic validation for email HTML
  const requiredElements = ["<html", "<body", "<head"];
  return requiredElements.every((element) => html.includes(element));
};

// Test email function for development
export const sendTestEmail = async (to: string) => {
  const testHTML = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #4F46E5;">Email Service Test</h1>
      <p>This is a test email from Amart Consult email service.</p>
      <p>If you receive this email, the SMTP configuration is working correctly.</p>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
    </div>
  `;

  return await sendEmail({
    to,
    subject: "Email Service Test - Amart Consult",
    html: testHTML,
  });
};

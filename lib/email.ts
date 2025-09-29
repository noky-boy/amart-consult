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
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// Contact Form Email Interface
interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  location: string;
  budgetRange?: string;
  serviceInterest?: string[];
  message: string;
}

// Generate Contact Form Email HTML
const generateContactFormEmailHTML = (data: ContactFormData): string => {
  const websiteUrl =
    process.env.NEXT_PUBLIC_WEBSITE_URL || "https://amartconsult.com";
  const logoUrl = `${websiteUrl}/images/amart-logo.png`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission - Amart Consult</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f8fafc; font-family: Arial, sans-serif; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #4F46E5 0%, #DC2626 100%); padding: 40px; text-align: center; }
        .logo-container { background-color: white; display: inline-block; padding: 16px; border-radius: 8px; margin-bottom: 16px; }
        .body { padding: 40px; }
        .info-section { background-color: #f9fafb; border-left: 4px solid #4F46E5; padding: 16px; margin: 16px 0; }
        .info-row { margin: 12px 0; }
        .label { font-weight: bold; color: #374151; display: inline-block; width: 150px; }
        .value { color: #6b7280; }
        .message-section { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; }
        .footer { background-color: #f9fafb; padding: 24px; text-align: center; font-size: 14px; color: #6b7280; }
        .services-list { list-style: none; padding: 0; margin: 8px 0; }
        .services-list li { display: inline-block; background-color: #e0e7ff; color: #4F46E5; padding: 4px 12px; border-radius: 12px; margin: 4px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo-container">
                <img src="${logoUrl}" alt="Amart Consult" width="120" height="40">
            </div>
            <h1 style="color: white; margin: 0;">New Contact Form Submission</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0;">You have a new inquiry from your website</p>
        </div>
        
        <div class="body">
            <h2 style="color: #4F46E5; margin-top: 0;">Contact Information</h2>
            <div class="info-section">
                <div class="info-row">
                    <span class="label">Name:</span>
                    <span class="value">${data.name}</span>
                </div>
                <div class="info-row">
                    <span class="label">Email:</span>
                    <span class="value"><a href="mailto:${
                      data.email
                    }" style="color: #4F46E5;">${data.email}</a></span>
                </div>
                <div class="info-row">
                    <span class="label">Phone:</span>
                    <span class="value"><a href="tel:${
                      data.phone
                    }" style="color: #4F46E5;">${data.phone}</a></span>
                </div>
                <div class="info-row">
                    <span class="label">Location:</span>
                    <span class="value">${data.location}</span>
                </div>
            </div>

            <h2 style="color: #4F46E5; margin-top: 32px;">Project Details</h2>
            <div class="info-section">
                <div class="info-row">
                    <span class="label">Project Type:</span>
                    <span class="value">${
                      data.projectType.charAt(0).toUpperCase() +
                      data.projectType.slice(1)
                    }</span>
                </div>
                ${
                  data.budgetRange
                    ? `
                <div class="info-row">
                    <span class="label">Budget Range:</span>
                    <span class="value">${data.budgetRange}</span>
                </div>
                `
                    : ""
                }
                ${
                  data.serviceInterest && data.serviceInterest.length > 0
                    ? `
                <div class="info-row">
                    <span class="label">Services Interested:</span>
                    <ul class="services-list">
                        ${data.serviceInterest
                          .map((service) => `<li>${service}</li>`)
                          .join("")}
                    </ul>
                </div>
                `
                    : ""
                }
            </div>

            <h2 style="color: #4F46E5; margin-top: 32px;">Message</h2>
            <div class="message-section">
                <p style="margin: 0; color: #92400e; white-space: pre-wrap;">${
                  data.message
                }</p>
            </div>

            <div style="margin-top: 32px; padding: 16px; background-color: #dbeafe; border-radius: 8px;">
                <p style="margin: 0; color: #1e40af; font-size: 14px;">
                    <strong>⏰ Quick Action Required:</strong> Please respond to this inquiry within 24 hours to maintain excellent customer service.
                </p>
            </div>

            <div style="margin-top: 24px; text-align: center;">
                <a href="mailto:${
                  data.email
                }?subject=Re: Your Inquiry - Amart Consult" 
                   style="background-color: #DC2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                    Reply to ${data.name}
                </a>
            </div>
        </div>
        
        <div class="footer">
            <img src="${logoUrl}" alt="Amart Consult" width="80" height="26" style="opacity: 0.6; margin-bottom: 16px;">
            <p>This email was sent from your website contact form</p>
            <p style="margin-top: 8px; font-size: 12px; color: #9ca3af;">
                Submitted on: ${new Date().toLocaleString("en-US", {
                  dateStyle: "full",
                  timeStyle: "short",
                  timeZone: "Africa/Accra",
                })}
            </p>
        </div>
    </div>
</body>
</html>`;
};

// Send Contact Form Email
export const sendContactFormEmail = async (data: ContactFormData) => {
  const htmlContent = generateContactFormEmailHTML(data);

  // Send to admin/company email
  const adminEmail = process.env.SMTP_USER || "amartconsult1@gmail.com";

  // Also send confirmation to client
  const clientConfirmationHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You - Amart Consult</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f8fafc; font-family: Arial, sans-serif; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #4F46E5 0%, #DC2626 100%); padding: 40px; text-align: center; }
        .logo-container { background-color: white; display: inline-block; padding: 16px; border-radius: 8px; margin-bottom: 16px; }
        .body { padding: 40px; }
        .footer { background-color: #f9fafb; padding: 24px; text-align: center; font-size: 14px; color: #6b7280; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo-container">
                <img src="${
                  process.env.NEXT_PUBLIC_WEBSITE_URL ||
                  "https://amartconsult.com"
                }/images/amart-logo.png" alt="Amart Consult" width="120" height="40">
            </div>
            <h1 style="color: white; margin: 0;">Thank You for Contacting Us!</h1>
        </div>
        
        <div class="body">
            <p style="color: #374151;">Hi ${data.name},</p>
            <p style="color: #374151;">Thank you for reaching out to Amart Consult. We've received your inquiry about your ${
              data.projectType
            } project in ${data.location}.</p>
            <p style="color: #374151;">Our team will review your message and get back to you within 24 hours with next steps.</p>
            
            <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; margin: 24px 0;">
                <p style="margin: 0; color: #166534;"><strong>What happens next?</strong></p>
                <ul style="color: #166534; margin: 8px 0;">
                    <li>We'll review your project requirements</li>
                    <li>A project consultant will contact you</li>
                    <li>We'll schedule an initial consultation</li>
                    <li>You'll receive a detailed proposal</li>
                </ul>
            </div>
            
            <p style="color: #374151;">If you have any urgent questions, feel free to call us at <strong>+233 54 354 3356</strong>.</p>
            
            <p style="color: #374151; margin-top: 32px;">
                Best regards,<br>
                <strong>The Amart Consult Team</strong>
            </p>
        </div>
        
        <div class="footer">
            <img src="${
              process.env.NEXT_PUBLIC_WEBSITE_URL || "https://amartconsult.com"
            }/images/amart-logo.png" alt="Amart Consult" width="80" height="26" style="opacity: 0.6; margin-bottom: 16px;">
            <p>+233 54 354 3356 | amartconsult1@gmail.com</p>
        </div>
    </div>
</body>
</html>`;

  try {
    // Send email to admin
    const adminResult = await sendEmail({
      to: adminEmail,
      subject: `New Contact Form: ${data.name} - ${data.projectType}`,
      html: htmlContent,
    });

    // Send confirmation to client
    const clientResult = await sendEmail({
      to: data.email,
      subject: "Thank You for Contacting Amart Consult",
      html: clientConfirmationHTML,
    });

    return {
      success: adminResult.success && clientResult.success,
      adminEmail: adminResult,
      clientEmail: clientResult,
    };
  } catch (error) {
    console.error("Failed to send contact form emails:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send emails",
    };
  }
};

// Welcome email types and function
interface WelcomeEmailData {
  to: string;
  firstName: string;
  websiteUrl?: string;
  logoUrl?: string;
}

// Client Welcome Email
interface ClientWelcomeEmailData {
  email: string;
  firstName: string;
  lastName: string;
  projectTitle?: string;
  temporaryPassword: string;
  portalUrl: string;
  customMessage?: string;
}

export const sendClientWelcomeEmail = async (data: ClientWelcomeEmailData) => {
  const websiteUrl =
    process.env.NEXT_PUBLIC_WEBSITE_URL || "https://amartconsult.com";
  const logoUrl = `${websiteUrl}/images/amart-logo.png`;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Amart Consult Client Portal</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f8fafc; font-family: Arial, sans-serif; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #4F46E5 0%, #DC2626 100%); padding: 40px; text-align: center; }
        .logo-container { background-color: white; display: inline-block; padding: 16px; border-radius: 8px; margin-bottom: 16px; }
        .body { padding: 40px; }
        .credentials { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; }
        .button { background-color: #DC2626; color: white; padding: 16px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; margin: 24px 0; }
        .footer { background-color: #f9fafb; padding: 24px; text-align: center; font-size: 14px; color: #6b7280; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo-container">
                <img src="${logoUrl}" alt="Amart Consult" width="120" height="40">
            </div>
            <h1 style="color: white; margin: 0;">Welcome to Your Client Portal</h1>
        </div>
        <div class="body">
            <p>Hi ${data.firstName},</p>
            <p>Welcome to the Amart Consult Client Portal! Your account has been created and you now have access to track your project progress, view documents, and communicate with our team.</p>
            ${
              data.projectTitle
                ? `<p><strong>Project:</strong> ${data.projectTitle}</p>`
                : ""
            }
            ${data.customMessage ? `<p>${data.customMessage}</p>` : ""}
            <div class="credentials">
                <p style="margin: 0; color: #92400e;"><strong>Your Login Credentials:</strong></p>
                <p style="margin: 8px 0 0 0; color: #92400e;">Email: <strong>${
                  data.email
                }</strong></p>
                <p style="margin: 8px 0 0 0; color: #92400e;">Temporary Password: <strong>${
                  data.temporaryPassword
                }</strong></p>
            </div>
            <div style="text-align: center;">
                <a href="${
                  data.portalUrl
                }" class="button">Access Your Portal</a>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-top: 24px;"><strong>Important:</strong> Please change your password after your first login for security.</p>
        </div>
        <div class="footer">
            <img src="${logoUrl}" alt="Amart Consult" width="80" height="26" style="opacity: 0.6; margin-bottom: 16px;">
            <p>+233 54 354 3356 | amartconsult1@gmail.com</p>
        </div>
    </div>
</body>
</html>`;

  const result = await sendEmail({
    to: data.email,
    subject: "Welcome to Amart Consult Client Portal",
    html: htmlContent,
  });

  return result.success;
};

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

// Newsletter subscription
export const addToNewsletterList = async (data: {
  email: string;
  name?: string;
  source?: string;
}) => {
  const websiteUrl =
    process.env.NEXT_PUBLIC_WEBSITE_URL || "https://amartconsult.com";
  const logoUrl = `${websiteUrl}/images/amart-logo.png`;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <style>
        body { margin: 0; padding: 0; background-color: #f8fafc; font-family: Arial, sans-serif; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #4F46E5 0%, #DC2626 100%); padding: 40px; text-align: center; }
        .body { padding: 40px; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1 style="color: white; margin: 0;">Welcome to Amart Consult Newsletter!</h1>
        </div>
        <div class="body">
            <p>Hi${data.name ? ` ${data.name}` : ""},</p>
            <p>Thank you for subscribing to the Amart Consult newsletter. You'll receive updates about our latest projects, design tips, and industry insights.</p>
            <p>Best regards,<br><strong>The Amart Consult Team</strong></p>
        </div>
    </div>
</body>
</html>`;

  const result = await sendEmail({
    to: data.email,
    subject: "Welcome to Amart Consult Newsletter",
    html: htmlContent,
  });

  return result.success;
};

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
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        recipient: emailOptions.to,
      });
    }
  }

  return results;
};
// Quote form email
interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  location: string;
  timeline: string;
  serviceTier: string;
  budgetRange: string;
  requirements: string;
  additionalDetails?: string;
}

export const sendQuoteFormEmail = async (data: QuoteFormData) => {
  const websiteUrl =
    process.env.NEXT_PUBLIC_WEBSITE_URL || "https://amartconsult.com";
  const logoUrl = `${websiteUrl}/images/amart-logo.png`;

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <style>
        body { margin: 0; padding: 0; background-color: #f8fafc; font-family: Arial, sans-serif; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #4F46E5 0%, #DC2626 100%); padding: 40px; text-align: center; }
        .body { padding: 40px; }
        .info-section { background-color: #f9fafb; border-left: 4px solid #4F46E5; padding: 16px; margin: 16px 0; }
        .info-row { margin: 12px 0; }
        .label { font-weight: bold; color: #374151; display: inline-block; width: 150px; }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1 style="color: white; margin: 0;">New Quote Request</h1>
        </div>
        <div class="body">
            <h2 style="color: #4F46E5;">Contact Information</h2>
            <div class="info-section">
                <div class="info-row"><span class="label">Name:</span> ${
                  data.name
                }</div>
                <div class="info-row"><span class="label">Email:</span> ${
                  data.email
                }</div>
                <div class="info-row"><span class="label">Phone:</span> ${
                  data.phone
                }</div>
                <div class="info-row"><span class="label">Location:</span> ${
                  data.location
                }</div>
            </div>
            <h2 style="color: #4F46E5;">Project Details</h2>
            <div class="info-section">
                <div class="info-row"><span class="label">Project Type:</span> ${
                  data.projectType
                }</div>
                <div class="info-row"><span class="label">Timeline:</span> ${
                  data.timeline
                }</div>
                <div class="info-row"><span class="label">Service Tier:</span> ${
                  data.serviceTier
                }</div>
                <div class="info-row"><span class="label">Budget Range:</span> ${
                  data.budgetRange
                }</div>
            </div>
            <h2 style="color: #4F46E5;">Requirements</h2>
            <p style="white-space: pre-wrap;">${data.requirements}</p>
            ${
              data.additionalDetails
                ? `<h2 style="color: #4F46E5;">Additional Details</h2><p style="white-space: pre-wrap;">${data.additionalDetails}</p>`
                : ""
            }
        </div>
    </div>
</body>
</html>`;

  const adminEmail = process.env.SMTP_USER || "amartconsult1@gmail.com";

  const result = await sendEmail({
    to: adminEmail,
    subject: `New Quote Request from ${data.name}`,
    html: htmlContent,
  });

  return result.success;
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

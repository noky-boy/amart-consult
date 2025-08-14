import nodemailer from "nodemailer"

interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

interface EmailData {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
  replyTo?: string
}

interface ContactFormData {
  name: string
  email: string
  phone: string
  projectType: string
  location: string
  budgetRange?: string
  serviceInterest: string[]
  message: string
}

interface QuoteFormData {
  name: string
  email: string
  phone: string
  projectType: string
  location: string
  timeline: string
  serviceTier: string
  budgetRange: string
  requirements: string
  additionalDetails?: string
}

interface NewsletterData {
  email: string
  name?: string
  source?: string
}

// Email configuration
const emailConfig: EmailConfig = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "projects@amartconsult.com",
    pass: process.env.SMTP_PASS || "",
  },
}

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter(emailConfig)
}

// Generic email sender
export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: emailData.from || `"Amart Consult" <${emailConfig.auth.user}>`,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
      replyTo: emailData.replyTo,
    }

    await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error("Email sending failed:", error)
    return false
  }
}

// Contact form email templates
export const sendContactFormEmail = async (data: ContactFormData): Promise<boolean> => {
  const adminEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0A2463 0%, #CC7357 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
      </div>
      
      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #0A2463; margin-bottom: 20px;">Contact Details</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background: white;">
            <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; color: #0A2463;">Name:</td>
            <td style="padding: 12px; border: 1px solid #ddd;">${data.name}</td>
          </tr>
          <tr style="background: #f8f8f8;">
            <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; color: #0A2463;">Email:</td>
            <td style="padding: 12px; border: 1px solid #ddd;">${data.email}</td>
          </tr>
          <tr style="background: white;">
            <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; color: #0A2463;">Phone:</td>
            <td style="padding: 12px; border: 1px solid #ddd;">${data.phone}</td>
          </tr>
          <tr style="background: #f8f8f8;">
            <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; color: #0A2463;">Project Type:</td>
            <td style="padding: 12px; border: 1px solid #ddd;">${data.projectType}</td>
          </tr>
          <tr style="background: white;">
            <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; color: #0A2463;">Location:</td>
            <td style="padding: 12px; border: 1px solid #ddd;">${data.location}</td>
          </tr>
          ${
            data.budgetRange
              ? `
          <tr style="background: #f8f8f8;">
            <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; color: #0A2463;">Budget Range:</td>
            <td style="padding: 12px; border: 1px solid #ddd;">${data.budgetRange}</td>
          </tr>
          `
              : ""
          }
          ${
            data.serviceInterest.length > 0
              ? `
          <tr style="background: white;">
            <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold; color: #0A2463;">Service Interest:</td>
            <td style="padding: 12px; border: 1px solid #ddd;">${data.serviceInterest.join(", ")}</td>
          </tr>
          `
              : ""
          }
        </table>

        <h3 style="color: #0A2463; margin-bottom: 10px;">Message:</h3>
        <div style="background: white; padding: 15px; border: 1px solid #ddd; border-radius: 5px;">
          ${data.message.replace(/\n/g, "<br>")}
        </div>

        <div style="margin-top: 30px; padding: 20px; background: #0A2463; color: white; border-radius: 5px; text-align: center;">
          <p style="margin: 0; font-size: 14px;">
            <strong>Next Steps:</strong> Please respond to this inquiry within 24 hours to maintain our service standards.
          </p>
        </div>
      </div>
    </div>
  `

  const clientEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0A2463 0%, #CC7357 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Thank You for Contacting Amart Consult</h1>
      </div>
      
      <div style="padding: 30px;">
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Dear ${data.name},</p>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          Thank you for reaching out to Amart Consult. We have received your inquiry about your ${data.projectType.toLowerCase()} project in ${data.location}.
        </p>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0A2463; margin-top: 0;">What happens next?</h3>
          <ul style="color: #666; line-height: 1.8; padding-left: 20px;">
            <li>Our team will review your project details within 24 hours</li>
            <li>We'll contact you to discuss your vision and requirements</li>
            <li>Schedule a consultation to explore your project in detail</li>
            <li>Provide you with a customized proposal and timeline</li>
          </ul>
        </div>

        <div style="background: #0A2463; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
          <h3 style="margin-top: 0; color: white;">Need immediate assistance?</h3>
          <p style="margin: 10px 0;">Call us directly at <strong>+233 54 354 3356</strong></p>
          <p style="margin: 10px 0;">Or email us at <strong>amartconsult1@gmail.com</strong></p>
        </div>

        <p style="color: #666; line-height: 1.6;">
          We're excited to help bring your architectural vision to life!
        </p>

        <p style="color: #666; margin-top: 30px;">
          Best regards,<br>
          <strong style="color: #0A2463;">Nathan Amarkwei</strong><br>
          Project Manager<br>
          Amart Consult
        </p>
      </div>
    </div>
  `

  try {
    // Send email to admin
    await sendEmail({
      to: "projects@amartconsult.com",
      subject: `New Contact Form Submission - ${data.projectType} Project`,
      html: adminEmailHtml,
      replyTo: data.email,
    })

    // Send confirmation email to client
    await sendEmail({
      to: data.email,
      subject: "Thank you for contacting Amart Consult - We'll be in touch soon!",
      html: clientEmailHtml,
    })

    return true
  } catch (error) {
    console.error("Failed to send contact form emails:", error)
    return false
  }
}

// Quote form email templates
export const sendQuoteFormEmail = async (data: QuoteFormData): Promise<boolean> => {
  const adminEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0A2463 0%, #CC7357 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">New Quote Request</h1>
      </div>
      
      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #0A2463; margin-bottom: 20px;">Quote Request Details</h2>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #0A2463; margin-top: 0;">Project Information</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; color: #0A2463;">Project Type:</td><td>${data.projectType}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #0A2463;">Location:</td><td>${data.location}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #0A2463;">Timeline:</td><td>${data.timeline}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #0A2463;">Service Tier:</td><td>${data.serviceTier}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #0A2463;">Budget Range:</td><td>${data.budgetRange}</td></tr>
          </table>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #0A2463; margin-top: 0;">Contact Information</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; color: #0A2463;">Name:</td><td>${data.name}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #0A2463;">Email:</td><td>${data.email}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #0A2463;">Phone:</td><td>${data.phone}</td></tr>
          </table>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #0A2463; margin-top: 0;">Project Requirements</h3>
          <p style="line-height: 1.6; color: #333;">${data.requirements.replace(/\n/g, "<br>")}</p>
          
          ${
            data.additionalDetails
              ? `
          <h4 style="color: #0A2463; margin-top: 20px;">Additional Details</h4>
          <p style="line-height: 1.6; color: #333;">${data.additionalDetails.replace(/\n/g, "<br>")}</p>
          `
              : ""
          }
        </div>

        <div style="background: #CC7357; color: white; padding: 20px; border-radius: 8px; text-align: center;">
          <p style="margin: 0; font-weight: bold;">High Priority Quote Request</p>
          <p style="margin: 5px 0 0 0; font-size: 14px;">Please prepare detailed quote within 48 hours</p>
        </div>
      </div>
    </div>
  `

  const clientEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0A2463 0%, #CC7357 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Quote Request Received</h1>
      </div>
      
      <div style="padding: 30px;">
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Dear ${data.name},</p>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          Thank you for requesting a quote for your ${data.projectType.toLowerCase()} project. We have received all your project details and our team is already reviewing your requirements.
        </p>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0A2463; margin-top: 0;">Your Quote Request Summary</h3>
          <ul style="color: #666; line-height: 1.8; padding-left: 20px; list-style: none;">
            <li><strong>Project:</strong> ${data.projectType}</li>
            <li><strong>Location:</strong> ${data.location}</li>
            <li><strong>Timeline:</strong> ${data.timeline}</li>
            <li><strong>Service Package:</strong> ${data.serviceTier}</li>
            <li><strong>Budget Range:</strong> ${data.budgetRange}</li>
          </ul>
        </div>

        <div style="background: #0A2463; color: white; padding: 20px; border-radius: 8px; margin: 30px 0;">
          <h3 style="margin-top: 0; color: white;">What's Next?</h3>
          <div style="text-align: left;">
            <p style="margin: 10px 0;">✓ Our team reviews your project requirements (24 hours)</p>
            <p style="margin: 10px 0;">✓ We prepare a detailed, customized quote (48 hours)</p>
            <p style="margin: 10px 0;">✓ Schedule a consultation to discuss the proposal</p>
            <p style="margin: 10px 0;">✓ Finalize project scope and timeline</p>
          </div>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <p style="color: #666; margin-bottom: 15px;">Questions about your quote?</p>
          <p style="margin: 5px 0;"><strong>Call:</strong> +233 54 354 3356</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> amartconsult1@gmail.com</p>
        </div>

        <p style="color: #666; margin-top: 30px;">
          Best regards,<br>
          <strong style="color: #0A2463;">Nathan Amarkwei</strong><br>
          Project Manager<br>
          Amart Consult
        </p>
      </div>
    </div>
  `

  try {
    // Send email to admin
    await sendEmail({
      to: "projects@amartconsult.com",
      subject: `Quote Request - ${data.projectType} Project (${data.serviceTier})`,
      html: adminEmailHtml,
      replyTo: data.email,
    })

    // Send confirmation email to client
    await sendEmail({
      to: data.email,
      subject: "Your Quote Request is Being Processed - Amart Consult",
      html: clientEmailHtml,
    })

    return true
  } catch (error) {
    console.error("Failed to send quote form emails:", error)
    return false
  }
}

// Newsletter signup email
export const sendNewsletterWelcomeEmail = async (data: NewsletterData): Promise<boolean> => {
  const welcomeEmailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0A2463 0%, #CC7357 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to Amart Consult Newsletter!</h1>
      </div>
      
      <div style="padding: 30px;">
        <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
          ${data.name ? `Dear ${data.name},` : "Hello!"}
        </p>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
          Thank you for subscribing to the Amart Consult newsletter! You're now part of our community of architecture enthusiasts and potential clients.
        </p>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0A2463; margin-top: 0;">What to expect:</h3>
          <ul style="color: #666; line-height: 1.8; padding-left: 20px;">
            <li>Monthly project showcases and case studies</li>
            <li>Architecture trends and design insights</li>
            <li>Building tips and cost-saving strategies</li>
            <li>Exclusive offers and early access to services</li>
            <li>Behind-the-scenes content from our projects</li>
          </ul>
        </div>

        <div style="background: #0A2463; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
          <h3 style="margin-top: 0; color: white;">Free Resource</h3>
          <p style="margin: 10px 0;">Download our Ghana Building Cost Calculator & Guide</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/lead-magnet/ghana-building-calculator" 
             style="display: inline-block; background: #CC7357; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">
            Download Free Guide
          </a>
        </div>

        <p style="color: #666; line-height: 1.6;">
          Ready to start your architectural project? We're here to help bring your vision to life.
        </p>

        <p style="color: #666; margin-top: 30px;">
          Best regards,<br>
          <strong style="color: #0A2463;">The Amart Consult Team</strong>
        </p>

        <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; text-align: center;">
          <p style="color: #999; font-size: 12px;">
            You received this email because you subscribed to our newsletter.
            <a href="#" style="color: #CC7357;">Unsubscribe</a> | 
            <a href="#" style="color: #CC7357;">Update preferences</a>
          </p>
        </div>
      </div>
    </div>
  `

  try {
    await sendEmail({
      to: data.email,
      subject: "Welcome to Amart Consult Newsletter + Free Building Guide",
      html: welcomeEmailHtml,
    })

    return true
  } catch (error) {
    console.error("Failed to send newsletter welcome email:", error)
    return false
  }
}

// Add subscriber to newsletter list (this would integrate with your email service provider)
export const addToNewsletterList = async (data: NewsletterData): Promise<boolean> => {
  try {
    // This would typically integrate with services like Mailchimp, ConvertKit, etc.
    // For now, we'll just send a welcome email and log the subscription

    console.log("New newsletter subscriber:", data)

    // Send welcome email
    await sendNewsletterWelcomeEmail(data)

    // In production, you would also:
    // - Add to your email service provider's list
    // - Store in database
    // - Set up automation sequences

    return true
  } catch (error) {
    console.error("Failed to add subscriber to newsletter:", error)
    return false
  }
}

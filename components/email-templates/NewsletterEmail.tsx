// components/email-templates/NewsletterEmail.tsx
import Image from "next/image";

interface NewsletterEmailProps {
  month?: string;
  year?: string;
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

export function NewsletterEmailPreview({
  month = "March",
  year = "2024",
  featuredProject = {
    title: "Modern Residential Complex - Accra",
    description:
      "This month, we're showcasing our latest residential project in East Legon, featuring sustainable design principles and modern Ghanaian architecture.",
    projectUrl: "#",
  },
  articles = [
    {
      title: "Building Costs in Ghana: 2024 Update",
      excerpt: "Latest material prices and labor costs across major cities...",
      url: "#",
    },
    {
      title: "Sustainable Architecture in West Africa",
      excerpt: "How to incorporate eco-friendly design in tropical climates...",
      url: "#",
    },
  ],
  tip = {
    title: "Rainy Season Preparation",
    content:
      "With the rainy season approaching, ensure your construction site has proper drainage and waterproofing measures in place.",
  },
  websiteUrl = "#",
  logoUrl = "/images/amart-logo.png",
}: NewsletterEmailProps) {
  return (
    <div className="bg-white max-w-2xl mx-auto shadow-lg">
      {/* Newsletter Header */}
      <div className="bg-indigo-900 p-6 text-center">
        <Image
          src={logoUrl}
          alt="Amart Consult"
          width={120}
          height={40}
          className="object-contain mx-auto mb-4 brightness-0 invert"
        />
        <h1 className="text-2xl font-bold text-white mb-1">
          Monthly Newsletter
        </h1>
        <p className="text-indigo-200">
          {month} {year}
        </p>
      </div>

      {/* Featured Project */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-indigo-900 mb-4">
          Featured Project Spotlight
        </h2>
        <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-48 rounded-lg mb-4 flex items-center justify-center">
          {featuredProject.imageUrl ? (
            <Image
              src={featuredProject.imageUrl}
              alt={featuredProject.title}
              width={400}
              height={192}
              className="object-cover w-full h-full rounded-lg"
            />
          ) : (
            <span className="text-gray-600">Project Image</span>
          )}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {featuredProject.title}
        </h3>
        <p className="text-gray-700 mb-4">{featuredProject.description}</p>
        <a
          href={featuredProject.projectUrl}
          className="inline-block border border-red-600 text-red-600 px-4 py-2 rounded hover:bg-red-50"
        >
          View Full Project
        </a>
      </div>

      {/* Blog Highlights */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-indigo-900 mb-4">
          Latest Insights
        </h2>
        <div className="space-y-4">
          {articles.map((article, index) => (
            <div key={index} className="flex gap-4">
              <div className="bg-red-200 w-16 h-16 rounded flex-shrink-0 flex items-center justify-center">
                <span className="text-red-700 text-xs font-semibold">
                  Article
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 hover:text-indigo-600">
                  <a href={article.url}>{article.title}</a>
                </h4>
                <p className="text-sm text-gray-600">{article.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Building Tips */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-indigo-900 mb-4">
          This Month's Building Tip
        </h2>
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="font-semibold text-red-900 mb-2">{tip.title}</h4>
          <p className="text-red-800">{tip.content}</p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="p-6 text-center bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Ready to Start Your Project?
        </h3>
        <p className="text-gray-600 mb-4">
          Get a free consultation with our team of experts
        </p>
        <a
          href={`${websiteUrl}/contact`}
          className="inline-block bg-red-600 text-white px-6 py-3 rounded font-semibold hover:bg-red-700"
        >
          Schedule Consultation
        </a>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 p-6 text-center text-sm text-gray-500 border-t">
        <Image
          src={logoUrl}
          alt="Amart Consult"
          width={80}
          height={26}
          className="object-contain mx-auto opacity-60 mb-4"
        />
        <p className="font-semibold text-gray-700">Amart Consult</p>
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

export function generateNewsletterEmailHTML({
  month = "{{month}}",
  year = "{{year}}",
  featuredProject = {
    title: "{{featured_project_title}}",
    description: "{{featured_project_description}}",
    imageUrl: "{{featured_project_image}}",
    projectUrl: "{{featured_project_url}}",
  },
  websiteUrl = "{{website_url}}",
  logoUrl = "{{logo_url}}",
}: NewsletterEmailProps) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Amart Consult Monthly Newsletter</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f8fafc; font-family: Arial, sans-serif; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background-color: #1e3a8a; padding: 24px; text-align: center; color: white; }
        .section { padding: 24px; border-bottom: 1px solid #e5e7eb; }
        .featured-project img { width: 100%; max-width: 400px; height: 200px; object-fit: cover; border-radius: 8px; }
        .article-item { display: flex; gap: 16px; margin-bottom: 16px; }
        .article-icon { width: 64px; height: 64px; background-color: #fecaca; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .tip-box { background-color: #fef2f2; padding: 16px; border-radius: 8px; }
        .cta-section { background-color: #f9fafb; padding: 24px; text-align: center; }
        .cta-button { background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; }
        .footer { background-color: #f9fafb; padding: 24px; text-align: center; font-size: 14px; color: #6b7280; border-top: 1px solid #e5e7eb; }
        @media only screen and (max-width: 600px) {
            .section { padding: 16px; }
            .article-item { flex-direction: column; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <img src="${logoUrl}" alt="Amart Consult" width="120" height="40" style="filter: brightness(0) invert(1); margin-bottom: 16px;">
            <h1 style="margin: 0 0 8px 0; font-size: 24px;">Monthly Newsletter</h1>
            <p style="margin: 0; color: #c7d2fe;">${month} ${year}</p>
        </div>
        
        <!-- Featured Project -->
        <div class="section">
            <h2 style="color: #1e3a8a; margin: 0 0 16px 0;">Featured Project Spotlight</h2>
            <div class="featured-project">
                <img src="${featuredProject.imageUrl}" alt="${featuredProject.title}" style="margin-bottom: 16px;">
                <h3 style="color: #111827; margin: 0 0 8px 0;">${featuredProject.title}</h3>
                <p style="color: #374151; margin: 0 0 16px 0; line-height: 1.5;">${featuredProject.description}</p>
                <a href="${featuredProject.projectUrl}" style="color: #dc2626; text-decoration: none; border: 1px solid #dc2626; padding: 8px 16px; border-radius: 4px; display: inline-block;">View Full Project</a>
            </div>
        </div>
        
        <!-- Articles -->
        <div class="section">
            <h2 style="color: #1e3a8a; margin: 0 0 16px 0;">Latest Insights</h2>
            <div class="article-item">
                <div class="article-icon">
                    <span style="color: #b91c1c; font-size: 12px; font-weight: bold;">Article</span>
                </div>
                <div>
                    <h4 style="color: #111827; margin: 0 0 4px 0;">Building Costs in Ghana: 2024 Update</h4>
                    <p style="color: #6b7280; margin: 0; font-size: 14px;">Latest material prices and labor costs across major cities...</p>
                </div>
            </div>
            <div class="article-item">
                <div class="article-icon">
                    <span style="color: #b91c1c; font-size: 12px; font-weight: bold;">Article</span>
                </div>
                <div>
                    <h4 style="color: #111827; margin: 0 0 4px 0;">Sustainable Architecture in West Africa</h4>
                    <p style="color: #6b7280; margin: 0; font-size: 14px;">How to incorporate eco-friendly design in tropical climates...</p>
                </div>
            </div>
        </div>
        
        <!-- Building Tip -->
        <div class="section">
            <h2 style="color: #1e3a8a; margin: 0 0 16px 0;">This Month's Building Tip</h2>
            <div class="tip-box">
                <h4 style="color: #991b1b; margin: 0 0 8px 0;">{{tip_title}}</h4>
                <p style="color: #b91c1c; margin: 0;">{{tip_content}}</p>
            </div>
        </div>
        
        <!-- CTA Section -->
        <div class="cta-section">
            <h3 style="color: #111827; margin: 0 0 8px 0;">Ready to Start Your Project?</h3>
            <p style="color: #6b7280; margin: 0 0 16px 0;">Get a free consultation with our team of experts</p>
            <a href="${websiteUrl}/contact" class="cta-button">Schedule Consultation</a>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <img src="${logoUrl}" alt="Amart Consult" width="80" height="26" style="opacity: 0.6; margin-bottom: 16px;">
            <p style="font-weight: bold; color: #374151; margin: 8px 0;">Amart Consult</p>
            <p style="margin: 4px 0;">+233 54 354 3356 | amartconsult1@gmail.com</p>
            <p style="margin: 16px 0 0 0;">
                <a href="${websiteUrl}" style="color: #4f46e5; margin: 0 8px;">Website</a>
                <a href="${websiteUrl}/portfolio" style="color: #4f46e5; margin: 0 8px;">Portfolio</a>
                <a href="{{unsubscribe_url}}" style="color: #4f46e5; margin: 0 8px;">Unsubscribe</a>
            </p>
        </div>
    </div>
</body>
</html>`;
}

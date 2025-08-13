"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Eye, Code } from "lucide-react"

const emailTemplates = [
  {
    id: "welcome-series",
    name: "Welcome Email Series",
    description: "5-email onboarding sequence for new subscribers",
    emails: [
      { subject: "Welcome to Amart Consult!", type: "Welcome + Introduction" },
      { subject: "Our Service Tiers Explained", type: "Service Overview" },
      { subject: "Portfolio Showcase", type: "Project Highlights" },
      { subject: "Client Success Stories", type: "Testimonials" },
      { subject: "Your Free Consultation Awaits", type: "CTA Offer" },
    ],
  },
  {
    id: "monthly-newsletter",
    name: "Monthly Newsletter",
    description: "Regular newsletter with project updates and insights",
    emails: [{ subject: "Amart Consult Monthly Update", type: "Newsletter" }],
  },
  {
    id: "project-updates",
    name: "Project Update Template",
    description: "Client project progress notifications",
    emails: [{ subject: "Your Project Progress Update", type: "Project Status" }],
  },
]

export default function EmailTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("welcome-1")
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview")

  const getEmailContent = (templateId: string) => {
    switch (templateId) {
      case "welcome-1":
        return {
          subject: "Welcome to Amart Consult!",
          preview: (
            <div className="bg-white max-w-2xl mx-auto">
              {/* Email Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-terracotta-600 p-8 text-center">
                <div className="bg-white inline-block p-3 rounded-lg mb-4">
                  <div className="text-2xl font-bold text-indigo-900">AC</div>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Welcome to Amart Consult!</h1>
                <p className="text-indigo-100">Your journey to exceptional architecture begins here</p>
              </div>

              {/* Email Body */}
              <div className="p-8">
                <p className="text-gray-700 mb-6">Hi [First Name],</p>
                <p className="text-gray-700 mb-6">
                  Welcome to the Amart Consult family! I'm Nathan Amarkwei, founder and lead architect, and I'm thrilled
                  you've joined our community of forward-thinking builders and dreamers.
                </p>
                <p className="text-gray-700 mb-6">
                  Over the next few days, I'll be sharing insights from my 10+ years of experience in Ghana's
                  construction industry, including:
                </p>
                <ul className="text-gray-700 mb-6 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-terracotta-600">•</span>
                    How our unique service tiers can transform your project
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terracotta-600">•</span>
                    Exclusive portfolio highlights and case studies
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-terracotta-600">•</span>
                    Real client success stories and testimonials
                  </li>
                </ul>
                <div className="text-center mb-6">
                  <Button className="bg-terracotta-600 hover:bg-terracotta-700 text-white px-8 py-3">
                    Explore Our Services
                  </Button>
                </div>
                <p className="text-gray-700">
                  Best regards,
                  <br />
                  Nathan Amarkwei
                  <br />
                  <span className="text-sm text-gray-500">Founder & Lead Architect, Amart Consult</span>
                </p>
              </div>

              {/* Email Footer */}
              <div className="bg-gray-50 p-6 text-center text-sm text-gray-500">
                <p>Amart Consult | Architectural Designs | Bill of Quantities | Construction</p>
                <p>+233 54 354 3356 | amartconsult1@gmail.com</p>
                <p className="mt-2">
                  <a href="#" className="text-indigo-600 hover:underline">
                    Unsubscribe
                  </a>{" "}
                  |
                  <a href="#" className="text-indigo-600 hover:underline ml-2">
                    Update Preferences
                  </a>
                </p>
              </div>
            </div>
          ),
          code: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Amart Consult!</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc;">
        <tr>
            <td align="center" style="padding: 20px;">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 8px; overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0A2463 0%, #CC7357 100%); padding: 40px; text-align: center;">
                            <div style="background-color: white; display: inline-block; padding: 12px; border-radius: 8px; margin-bottom: 16px;">
                                <div style="font-size: 24px; font-weight: bold; color: #0A2463;">AC</div>
                            </div>
                            <h1 style="color: white; font-size: 32px; margin: 0 0 8px 0;">Welcome to Amart Consult!</h1>
                            <p style="color: #E0E7FF; margin: 0;">Your journey to exceptional architecture begins here</p>
                        </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px;">
                            <p style="color: #374151; margin-bottom: 24px;">Hi {{first_name}},</p>
                            <p style="color: #374151; margin-bottom: 24px;">Welcome to the Amart Consult family! I'm Nathan Amarkwei, founder and lead architect, and I'm thrilled you've joined our community of forward-thinking builders and dreamers.</p>
                            <!-- CTA Button -->
                            <div style="text-align: center; margin: 32px 0;">
                                <a href="{{website_url}}/services" style="background-color: #CC7357; color: white; padding: 16px 32px; text-decoration: none; border-radius: 6px; font-weight: bold;">Explore Our Services</a>
                            </div>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 24px; text-align: center; font-size: 14px; color: #6b7280;">
                            <p>Amart Consult | Architectural Designs | Bill of Quantities | Construction</p>
                            <p>+233 54 354 3356 | amartconsult1@gmail.com</p>
                            <p><a href="{{unsubscribe_url}}" style="color: #4f46e5;">Unsubscribe</a></p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`,
        }
      case "monthly-newsletter":
        return {
          subject: "Amart Consult Monthly Update",
          preview: (
            <div className="bg-white max-w-2xl mx-auto">
              {/* Newsletter Header */}
              <div className="bg-indigo-900 p-6 text-center">
                <div className="text-2xl font-bold text-white mb-2">AMART CONSULT</div>
                <p className="text-indigo-200">Monthly Newsletter - [Month Year]</p>
              </div>

              {/* Featured Project */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-indigo-900 mb-4">Featured Project Spotlight</h2>
                <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-500">Project Image</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Modern Residential Complex - Accra</h3>
                <p className="text-gray-700 mb-4">
                  This month, we're showcasing our latest residential project in East Legon, featuring sustainable
                  design principles and modern Ghanaian architecture.
                </p>
                <Button variant="outline" className="border-terracotta-600 text-terracotta-600 bg-transparent">
                  View Full Project
                </Button>
              </div>

              {/* Blog Highlights */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-indigo-900 mb-4">Latest Blog Posts</h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="bg-gray-200 w-16 h-16 rounded flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Building Costs in Ghana: 2024 Update</h4>
                      <p className="text-sm text-gray-600">
                        Latest material prices and labor costs across major cities...
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-gray-200 w-16 h-16 rounded flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Sustainable Architecture in West Africa</h4>
                      <p className="text-sm text-gray-600">
                        How to incorporate eco-friendly design in tropical climates...
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Building Tips */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-indigo-900 mb-4">This Month's Building Tip</h2>
                <div className="bg-terracotta-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-terracotta-900 mb-2">Rainy Season Preparation</h4>
                  <p className="text-terracotta-800">
                    With the rainy season approaching, ensure your construction site has proper drainage and
                    waterproofing measures in place.
                  </p>
                </div>
              </div>
            </div>
          ),
          code: `<!-- Monthly Newsletter HTML Template -->`,
        }
      case "project-update":
        return {
          subject: "Your Project Progress Update",
          preview: (
            <div className="bg-white max-w-2xl mx-auto">
              {/* Project Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-terracotta-600 p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">Project Progress Update</h1>
                <p className="text-indigo-100">[Project Name] - Week [X]</p>
              </div>

              {/* Progress Summary */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-indigo-900 mb-4">Progress Summary</h2>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-semibold text-green-800">On Track</span>
                  </div>
                  <p className="text-green-700">
                    Foundation work completed successfully. Moving to structural phase next week.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-900">65%</div>
                    <div className="text-sm text-gray-600">Complete</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-indigo-900">3 weeks</div>
                    <div className="text-sm text-gray-600">Remaining</div>
                  </div>
                </div>
              </div>

              {/* Photo Updates */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-indigo-900 mb-4">Latest Photos</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Progress Photo 1</span>
                  </div>
                  <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Progress Photo 2</span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-indigo-900 mb-4">Next Phase</h2>
                <p className="text-gray-700 mb-4">
                  Starting Monday, we'll begin the structural framework installation. This phase is expected to take 2
                  weeks.
                </p>
                <div className="text-center">
                  <Button className="bg-terracotta-600 hover:bg-terracotta-700 text-white">
                    Contact Project Manager
                  </Button>
                </div>
              </div>
            </div>
          ),
          code: `<!-- Project Update HTML Template -->`,
        }
      default:
        return { subject: "", preview: null, code: "" }
    }
  }

  const currentTemplate = getEmailContent(selectedTemplate)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">Email Templates</h1>
          <p className="text-gray-600">Professional email templates for Amart Consult's marketing automation</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Template List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {emailTemplates.map((template) => (
                  <div key={template.id} className="space-y-2">
                    <h3 className="font-semibold text-indigo-900">{template.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                    {template.emails.map((email, index) => (
                      <button
                        key={`${template.id}-${index}`}
                        onClick={() => setSelectedTemplate(`${template.id.split("-")[0]}-${index + 1}`)}
                        className={`w-full text-left p-2 rounded text-sm transition-colors ${
                          selectedTemplate === `${template.id.split("-")[0]}-${index + 1}`
                            ? "bg-indigo-100 text-indigo-900"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {email.subject}
                      </button>
                    ))}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Template Preview */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-indigo-600" />
                    <CardTitle>{currentTemplate.subject}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === "preview" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("preview")}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button
                      variant={viewMode === "code" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("code")}
                    >
                      <Code className="h-4 w-4 mr-1" />
                      HTML
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {viewMode === "preview" ? (
                  <div className="border rounded-lg p-4 bg-gray-50 max-h-[800px] overflow-y-auto">
                    {currentTemplate.preview}
                  </div>
                ) : (
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg max-h-[800px] overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap">{currentTemplate.code}</pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

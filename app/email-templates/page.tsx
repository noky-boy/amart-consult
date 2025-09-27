// app/email-templates/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Mail,
  Eye,
  Code,
  Download,
  Copy,
  Send,
  TestTube,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Import email components
import {
  WelcomeEmailPreview,
  generateWelcomeEmailHTML,
} from "@/components/email-templates/WelcomeEmail";
import {
  NewsletterEmailPreview,
  generateNewsletterEmailHTML,
} from "@/components/email-templates/NewsletterEmail";
import {
  ProjectUpdateEmailPreview,
  generateProjectUpdateEmailHTML,
} from "@/components/email-templates/ProjectUpdateEmail";

// Email templates configuration
const emailTemplates = {
  "welcome-1": {
    name: "Welcome Email",
    category: "Onboarding",
    description: "Welcome new subscribers to Amart Consult",
    component: WelcomeEmailPreview,
    generateHTML: generateWelcomeEmailHTML,
    defaultProps: {
      firstName: "John",
      websiteUrl: "https://amartconsult.com",
      logoUrl: "/images/amart-logo.png",
    },
  },
  "newsletter-1": {
    name: "Monthly Newsletter",
    category: "Marketing",
    description: "Regular newsletter with project updates and insights",
    component: NewsletterEmailPreview,
    generateHTML: generateNewsletterEmailHTML,
    defaultProps: {
      month: "March",
      year: "2024",
      featuredProject: {
        title: "Modern Residential Complex - Accra",
        description:
          "Showcasing our latest residential project in East Legon, featuring sustainable design principles.",
        projectUrl: "https://amartconsult.com/projects/modern-residential",
      },
    },
  },
  "project-1": {
    name: "Project Update",
    category: "Client Communication",
    description: "Weekly project progress updates for clients",
    component: ProjectUpdateEmailPreview,
    generateHTML: generateProjectUpdateEmailHTML,
    defaultProps: {
      clientName: "Mr. Johnson",
      projectName: "Modern Villa Project",
      weekNumber: 8,
      status: "on-track",
      progress: 65,
      timeRemaining: "3 weeks",
    },
  },
};

export default function EmailTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("welcome-1");
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [testEmail, setTestEmail] = useState("");
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const currentTemplate =
    emailTemplates[selectedTemplate as keyof typeof emailTemplates];

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setTestResult({
        success: true,
        message: "HTML code copied to clipboard!",
      });
      setTimeout(() => setTestResult(null), 3000);
    } catch (err) {
      setTestResult({ success: false, message: "Failed to copy to clipboard" });
      setTimeout(() => setTestResult(null), 3000);
    }
  };

  const downloadHTML = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sendTestEmail = async () => {
    if (!testEmail) {
      setTestResult({
        success: false,
        message: "Please enter an email address",
      });
      return;
    }

    setIsTestingEmail(true);
    try {
      const response = await fetch("/api/email/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: testEmail,
          template: selectedTemplate,
          props: currentTemplate.defaultProps,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setTestResult({
          success: true,
          message: "Test email sent successfully!",
        });
        setTestEmail("");
      } else {
        setTestResult({
          success: false,
          message: result.error || "Failed to send test email",
        });
      }
    } catch (error) {
      setTestResult({ success: false, message: "Network error occurred" });
    } finally {
      setIsTestingEmail(false);
      setTimeout(() => setTestResult(null), 5000);
    }
  };

  const htmlContent = currentTemplate.generateHTML(
    currentTemplate.defaultProps
  );
  const PreviewComponent = currentTemplate.component;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-indigo-900 mb-2">
            Email Templates
          </h1>
          <p className="text-gray-600">
            Professional email templates for Amart Consult's marketing and
            client communication
          </p>
        </div>

        {/* Test Result Alert */}
        {testResult && (
          <Alert
            className={`mb-6 ${
              testResult.success
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            {testResult.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription
              className={testResult.success ? "text-green-700" : "text-red-700"}
            >
              {testResult.message}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Template List & Test Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Template Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(emailTemplates).map(([key, template]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTemplate(key)}
                    className={`w-full text-left p-3 rounded-lg text-sm transition-all border ${
                      selectedTemplate === key
                        ? "bg-indigo-100 text-indigo-900 border-indigo-200 shadow-sm"
                        : "hover:bg-gray-100 border-gray-200"
                    }`}
                  >
                    <div className="font-semibold">{template.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {template.category}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {template.description}
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Test Email Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Test Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="test-email" className="text-sm font-medium">
                    Send test to:
                  </Label>
                  <Input
                    id="test-email"
                    type="email"
                    placeholder="your@email.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button
                  onClick={sendTestEmail}
                  disabled={isTestingEmail || !testEmail}
                  className="w-full"
                  size="sm"
                >
                  {isTestingEmail ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Test
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500">
                  Test emails use default sample data and are sent via your
                  configured SMTP server.
                </p>
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
                    <CardTitle>{currentTemplate.name}</CardTitle>
                    <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {currentTemplate.category}
                    </span>
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
                    {viewMode === "code" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(htmlContent)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            downloadHTML(htmlContent, selectedTemplate)
                          }
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {viewMode === "preview" ? (
                  <div className="border rounded-lg p-4 bg-gray-50 max-h-[800px] overflow-y-auto">
                    <PreviewComponent {...currentTemplate.defaultProps} />
                  </div>
                ) : (
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg max-h-[800px] overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap font-mono leading-relaxed">
                      {htmlContent}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Usage Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Usage Instructions</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Email Service Integration
              </h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  • Import the email service:{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    import &#123; sendWelcomeEmail &#125; from '@/lib/email'
                  </code>
                </p>
                <p>• Use in your API routes or server actions</p>
                <p>
                  • SMTP configuration is already set up in your environment
                </p>
                <p>
                  • Templates include proper logo integration and responsive
                  design
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">
                Template Customization
              </h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  • Components are located in{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    /components/email-templates/
                  </code>
                </p>
                <p>• Each template supports dynamic content via props</p>
                <p>• HTML versions include email-safe inline CSS</p>
                <p>
                  • Variables use mustache syntax:{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    &#123;&#123;variable_name&#125;&#125;
                  </code>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

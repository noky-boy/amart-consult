// components/email-templates/ProjectUpdateEmail.tsx
import Image from "next/image";

interface ProjectUpdateEmailProps {
  clientName?: string;
  projectName?: string;
  weekNumber?: number;
  status?: "on-track" | "delayed" | "ahead" | "completed";
  progress?: number;
  timeRemaining?: string;
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

export function ProjectUpdateEmailPreview({
  clientName = "Mr. Johnson",
  projectName = "Modern Villa Project",
  weekNumber = 8,
  status = "on-track",
  progress = 65,
  timeRemaining = "3 weeks",
  updates = [
    {
      title: "Foundation Completed",
      description:
        "All foundation work has been completed successfully. Quality checks passed.",
      date: "March 15, 2024",
    },
    {
      title: "Material Delivery",
      description:
        "Next batch of construction materials delivered on schedule.",
      date: "March 18, 2024",
    },
  ],
  photos = [
    {
      url: "/images/project-photo-1.jpg",
      caption: "Foundation work completed",
    },
    {
      url: "/images/project-photo-2.jpg",
      caption: "Site preparation for next phase",
    },
  ],
  nextPhase = {
    title: "Structural Framework",
    description:
      "Starting Monday, we'll begin the structural framework installation. This phase is expected to take 2 weeks.",
    startDate: "March 25, 2024",
    duration: "2 weeks",
  },
  projectManagerEmail = "project@amartconsult.com",
  websiteUrl = "#",
  logoUrl = "/images/amart-logo.png",
}: ProjectUpdateEmailProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track":
        return "text-green-800 bg-green-50 border-green-200";
      case "ahead":
        return "text-blue-800 bg-blue-50 border-blue-200";
      case "delayed":
        return "text-orange-800 bg-orange-50 border-orange-200";
      case "completed":
        return "text-purple-800 bg-purple-50 border-purple-200";
      default:
        return "text-gray-800 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "on-track":
        return "✓";
      case "ahead":
        return "⬆";
      case "delayed":
        return "⚠";
      case "completed":
        return "✓";
      default:
        return "•";
    }
  };

  return (
    <div className="bg-white max-w-2xl mx-auto shadow-lg">
      {/* Project Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-red-600 p-6 text-white text-center">
        <div className="bg-white inline-block p-3 rounded-lg mb-4">
          <Image
            src={logoUrl}
            alt="Amart Consult"
            width={100}
            height={33}
            className="object-contain"
          />
        </div>
        <h1 className="text-2xl font-bold mb-2">Project Progress Update</h1>
        <p className="text-indigo-100">
          {projectName} - Week {weekNumber}
        </p>
      </div>

      {/* Greeting */}
      <div className="p-6 border-b border-gray-200">
        <p className="text-gray-700">Dear {clientName},</p>
        <p className="text-gray-700 mt-2">
          Here's your weekly update on the progress of your {projectName}. We're
          excited to share the latest developments with you.
        </p>
      </div>

      {/* Progress Summary */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-indigo-900 mb-4">
          Progress Summary
        </h2>
        <div className={`border rounded-lg p-4 mb-4 ${getStatusColor(status)}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{getStatusIcon(status)}</span>
            <span className="font-semibold capitalize">
              {status.replace("-", " ")}
            </span>
          </div>
          <p className="text-sm">
            {status === "on-track" &&
              "Your project is progressing according to schedule."}
            {status === "ahead" && "Great news! We're ahead of schedule."}
            {status === "delayed" &&
              "We're experiencing minor delays but working to get back on track."}
            {status === "completed" &&
              "Congratulations! Your project has been completed."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <div className="text-3xl font-bold text-indigo-900">
              {progress}%
            </div>
            <div className="text-sm text-indigo-600">Complete</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-indigo-600 h-2 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-3xl font-bold text-red-900">
              {timeRemaining}
            </div>
            <div className="text-sm text-red-600">Remaining</div>
          </div>
        </div>
      </div>

      {/* Recent Updates */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-indigo-900 mb-4">
          Recent Updates
        </h2>
        <div className="space-y-3">
          {updates.map((update, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-900">{update.title}</h4>
              <p className="text-gray-600 text-sm">{update.description}</p>
              {update.date && (
                <p className="text-xs text-gray-500 mt-1">{update.date}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Progress Photos */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-indigo-900 mb-4">
          Latest Progress Photos
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="space-y-2">
              <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-sm">{photo.caption}</span>
              </div>
              <p className="text-xs text-gray-600 text-center">
                {photo.caption}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Next Phase */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-indigo-900 mb-4">Next Phase</h2>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">
            {nextPhase.title}
          </h4>
          <p className="text-blue-800 mb-3">{nextPhase.description}</p>
          <div className="flex gap-4 text-sm">
            {nextPhase.startDate && (
              <div>
                <span className="font-medium text-blue-700">Start Date:</span>
                <span className="text-blue-600 ml-1">
                  {nextPhase.startDate}
                </span>
              </div>
            )}
            {nextPhase.duration && (
              <div>
                <span className="font-medium text-blue-700">Duration:</span>
                <span className="text-blue-600 ml-1">{nextPhase.duration}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="p-6 text-center bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Questions or Concerns?
        </h3>
        <p className="text-gray-600 mb-4">
          Our project manager is here to help
        </p>
        <a
          href={`mailto:${projectManagerEmail}`}
          className="inline-block bg-red-600 text-white px-6 py-3 rounded font-semibold hover:bg-red-700"
        >
          Contact Project Manager
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
        <p>Building Excellence, One Project at a Time</p>
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
        </div>
      </div>
    </div>
  );
}

export function generateProjectUpdateEmailHTML({
  clientName = "{{client_name}}",
  projectName = "{{project_name}}",
  weekNumber = "{{week_number}}",
  status = "{{status}}",
  progress = "{{progress_percentage}}",
  timeRemaining = "{{time_remaining}}",
  nextPhase = {
    title: "{{next_phase_title}}",
    description: "{{next_phase_description}}",
    startDate: "{{next_phase_start_date}}",
    duration: "{{next_phase_duration}}",
  },
  projectManagerEmail = "{{project_manager_email}}",
  websiteUrl = "{{website_url}}",
  logoUrl = "{{logo_url}}",
}: ProjectUpdateEmailProps) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Update - ${projectName}</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f8fafc; font-family: Arial, sans-serif; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #4F46E5 0%, #DC2626 100%); padding: 24px; text-align: center; color: white; }
        .logo-container { background-color: white; display: inline-block; padding: 12px; border-radius: 8px; margin-bottom: 16px; }
        .section { padding: 24px; border-bottom: 1px solid #e5e7eb; }
        .status-box { border: 1px solid; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
        .status-on-track { background-color: #f0fdf4; border-color: #bbf7d0; color: #166534; }
        .status-ahead { background-color: #eff6ff; border-color: #bfdbfe; color: #1e40af; }
        .status-delayed { background-color: #fff7ed; border-color: #fed7aa; color: #9a3412; }
        .progress-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .progress-card { text-align: center; padding: 16px; border-radius: 8px; }
        .progress-complete { background-color: #eef2ff; }
        .progress-remaining { background-color: #fef2f2; }
        .update-item { border-left: 4px solid #3b82f6; padding-left: 16px; margin-bottom: 12px; }
        .photo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .photo-placeholder { height: 120px; background-color: #e5e7eb; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
        .next-phase-box { background-color: #eff6ff; padding: 16px; border-radius: 8px; }
        .cta-section { background-color: #f9fafb; padding: 24px; text-align: center; }
        .cta-button { background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; }
        .footer { background-color: #f9fafb; padding: 24px; text-align: center; font-size: 14px; color: #6b7280; border-top: 1px solid #e5e7eb; }
        @media only screen and (max-width: 600px) {
            .section { padding: 16px; }
            .progress-grid, .photo-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo-container">
                <img src="${logoUrl}" alt="Amart Consult" width="100" height="33">
            </div>
            <h1 style="margin: 0 0 8px 0;">Project Progress Update</h1>
            <p style="margin: 0; color: #e0e7ff;">${projectName} - Week ${weekNumber}</p>
        </div>
        
        <!-- Greeting -->
        <div class="section">
            <p style="margin: 0 0 12px 0; color: #374151;">Dear ${clientName},</p>
            <p style="margin: 0; color: #374151;">Here's your weekly update on the progress of your ${projectName}. We're excited to share the latest developments with you.</p>
        </div>
        
        <!-- Progress Summary -->
        <div class="section">
            <h2 style="color: #1e3a8a; margin: 0 0 16px 0;">Progress Summary</h2>
            <div class="status-box status-{{status_class}}">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <span style="font-size: 18px;">{{status_icon}}</span>
                    <span style="font-weight: bold; text-transform: capitalize;">{{status_text}}</span>
                </div>
                <p style="margin: 0; font-size: 14px;">{{status_message}}</p>
            </div>
            <div class="progress-grid">
                <div class="progress-card progress-complete">
                    <div style="font-size: 28px; font-weight: bold; color: #1e3a8a; margin-bottom: 4px;">${progress}%</div>
                    <div style="font-size: 14px; color: #4f46e5;">Complete</div>
                </div>
                <div class="progress-card progress-remaining">
                    <div style="font-size: 28px; font-weight: bold; color: #991b1b; margin-bottom: 4px;">${timeRemaining}</div>
                    <div style="font-size: 14px; color: #dc2626;">Remaining</div>
                </div>
            </div>
        </div>
        
        <!-- Recent Updates -->
        <div class="section">
            <h2 style="color: #1e3a8a; margin: 0 0 16px 0;">Recent Updates</h2>
            <div class="update-item">
                <h4 style="margin: 0 0 4px 0; color: #111827;">{{update_title_1}}</h4>
                <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">{{update_description_1}}</p>
                <p style="margin: 0; color: #9ca3af; font-size: 12px;">{{update_date_1}}</p>
            </div>
        </div>
        
        <!-- Progress Photos -->
        <div class="section">
            <h2 style="color: #1e3a8a; margin: 0 0 16px 0;">Latest Progress Photos</h2>
            <div class="photo-grid">
                <div>
                    <div class="photo-placeholder">
                        <span style="color: #6b7280; font-size: 14px;">Progress Photo 1</span>
                    </div>
                    <p style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280; text-align: center;">{{photo_caption_1}}</p>
                </div>
                <div>
                    <div class="photo-placeholder">
                        <span style="color: #6b7280; font-size: 14px;">Progress Photo 2</span>
                    </div>
                    <p style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280; text-align: center;">{{photo_caption_2}}</p>
                </div>
            </div>
        </div>
        
        <!-- Next Phase -->
        <div class="section">
            <h2 style="color: #1e3a8a; margin: 0 0 16px 0;">Next Phase</h2>
            <div class="next-phase-box">
                <h4 style="color: #1e40af; margin: 0 0 8px 0;">${nextPhase.title}</h4>
                <p style="color: #1e40af; margin: 0 0 12px 0;">${nextPhase.description}</p>
                <div style="display: flex; gap: 16px; font-size: 14px;">
                    <div><span style="font-weight: 500; color: #1d4ed8;">Start Date:</span> <span style="color: #2563eb;">${nextPhase.startDate}</span></div>
                    <div><span style="font-weight: 500; color: #1d4ed8;">Duration:</span> <span style="color: #2563eb;">${nextPhase.duration}</span></div>
                </div>
            </div>
        </div>
        
        <!-- Contact Section -->
        <div class="cta-section">
            <h3 style="color: #111827; margin: 0 0 8px 0;">Questions or Concerns?</h3>
            <p style="color: #6b7280; margin: 0 0 16px 0;">Our project manager is here to help</p>
            <a href="mailto:${projectManagerEmail}" class="cta-button">Contact Project Manager</a>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <img src="${logoUrl}" alt="Amart Consult" width="80" height="26" style="opacity: 0.6; margin-bottom: 16px;">
            <p style="font-weight: bold; color: #374151; margin: 8px 0;">Amart Consult</p>
            <p style="margin: 4px 0;">Building Excellence, One Project at a Time</p>
            <p style="margin: 4px 0;">+233 54 354 3356 | amartconsult1@gmail.com</p>
            <p style="margin: 16px 0 0 0;">
                <a href="${websiteUrl}" style="color: #4f46e5; margin: 0 8px;">Website</a>
                <a href="${websiteUrl}/portfolio" style="color: #4f46e5; margin: 0 8px;">Portfolio</a>
            </p>
        </div>
    </div>
</body>
</html>`;
}

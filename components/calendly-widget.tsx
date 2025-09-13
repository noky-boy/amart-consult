"use client"

import { useEffect } from "react"
import { Calendar, Clock, User } from "@/components/ui/icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CalendlyWidgetProps {
  url?: string
  prefill?: {
    name?: string
    email?: string
    customAnswers?: Record<string, string>
  }
  utm?: {
    utmCampaign?: string
    utmSource?: string
    utmMedium?: string
    utmContent?: string
    utmTerm?: string
  }
}

export default function CalendlyWidget({
  url = "https://calendly.com/amartconsult/30min",
  prefill,
  utm,
}: CalendlyWidgetProps) {
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://assets.calendly.com/assets/external/widget.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const openCalendlyPopup = () => {
    // @ts-ignore
    if (window.Calendly) {
      const options: any = {
        url,
      }

      if (prefill) {
        options.prefill = prefill
      }

      if (utm) {
        options.utm = utm
      }

      // @ts-ignore
      window.Calendly.initPopupWidget(options)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-indigo-deep/5 to-terracotta/5 border-indigo-deep/20">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-deep to-indigo-deep/80 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-xl font-serif text-indigo-deep">Schedule a Consultation</CardTitle>
        <p className="text-gray-600">Book a free 30-minute project discussion with our team</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-terracotta" />
            <span>30 minutes • Free consultation</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <User className="w-4 h-4 text-terracotta" />
            <span>Meet with Nathan Amarkwei, Project Manager</span>
          </div>
        </div>

        <div className="bg-white/50 rounded-lg p-4 border border-sand/30">
          <h4 className="font-semibold text-indigo-deep mb-2">What we'll discuss:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Your project vision and requirements</li>
            <li>• Timeline and budget considerations</li>
            <li>• Service options and next steps</li>
            <li>• Q&A about our process</li>
          </ul>
        </div>

        <Button onClick={openCalendlyPopup} className="w-full bg-indigo-deep hover:bg-indigo-deep/90 text-white py-3">
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Your Consultation
        </Button>
      </CardContent>
    </Card>
  )
}

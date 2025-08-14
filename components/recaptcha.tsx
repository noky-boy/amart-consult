"use client"

import { useEffect, useRef } from "react"

interface RecaptchaProps {
  siteKey: string // Added siteKey as a required prop instead of accessing env var directly
  onVerify: (token: string) => void
  onExpire?: () => void
  onError?: () => void
  size?: "compact" | "normal" | "invisible"
  theme?: "light" | "dark"
  className?: string
}

declare global {
  interface Window {
    grecaptcha: any
    onRecaptchaLoad: () => void
  }
}

export default function Recaptcha({
  siteKey, // Using siteKey prop instead of environment variable
  onVerify,
  onExpire,
  onError,
  size = "normal",
  theme = "light",
  className = "",
}: RecaptchaProps) {
  const recaptchaRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<number | null>(null)

  useEffect(() => {
    const loadRecaptcha = () => {
      if (window.grecaptcha && recaptchaRef.current) {
        widgetId.current = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: siteKey, // Using prop instead of process.env
          callback: onVerify,
          "expired-callback": onExpire,
          "error-callback": onError,
          size,
          theme,
        })
      }
    }

    if (window.grecaptcha) {
      loadRecaptcha()
    } else {
      window.onRecaptchaLoad = loadRecaptcha

      // Load reCAPTCHA script if not already loaded
      if (!document.querySelector('script[src*="recaptcha"]')) {
        const script = document.createElement("script")
        script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit`
        script.async = true
        script.defer = true
        document.head.appendChild(script)
      }
    }

    return () => {
      if (widgetId.current !== null && window.grecaptcha) {
        window.grecaptcha.reset(widgetId.current)
      }
    }
  }, [siteKey, onVerify, onExpire, onError, size, theme]) // Added siteKey to dependency array

  const reset = () => {
    if (widgetId.current !== null && window.grecaptcha) {
      window.grecaptcha.reset(widgetId.current)
    }
  }

  const execute = () => {
    if (widgetId.current !== null && window.grecaptcha) {
      window.grecaptcha.execute(widgetId.current)
    }
  }

  return (
    <div className={className}>
      <div ref={recaptchaRef} />
    </div>
  )
}

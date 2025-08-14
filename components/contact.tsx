"use client"
import CalendlyWidget from "./calendly-widget"

const Contact = () => {
  const activeTab = "contact" // Declare activeTab variable
  const contactForm = { name: "John Doe", email: "john@example.com", projectType: "Residential", location: "New York" } // Declare contactForm variable
  const quoteForm = {
    name: "Jane Smith",
    email: "jane@example.com",
    projectType: "Commercial",
    location: "Los Angeles",
  } // Declare quoteForm variable

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-sand-beige/20 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-indigo-deep mb-4">Let's Build Your Vision Together</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to start your architectural journey? Get in touch with us for a consultation or request a detailed
            quote for your project.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">{/* ... existing contact cards ... */}</div>

        <div className="max-w-md mx-auto mb-12">
          <CalendlyWidget
            prefill={{
              name: activeTab === "contact" ? contactForm.name : quoteForm.name,
              email: activeTab === "contact" ? contactForm.email : quoteForm.email,
              customAnswers: {
                a1: activeTab === "contact" ? contactForm.projectType : quoteForm.projectType,
                a2: activeTab === "contact" ? contactForm.location : quoteForm.location,
              },
            }}
            utm={{
              utmSource: "website",
              utmMedium: "contact-form",
              utmCampaign: "consultation-booking",
            }}
          />
        </div>

        {/* Form Tabs */}
        <div className="max-w-4xl mx-auto">{/* ... existing form code ... */}</div>
      </div>
    </section>
  )
}

export default Contact

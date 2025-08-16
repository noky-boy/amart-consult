import { client } from "../sanity/lib/client"

// Static services data from components/services.tsx
const servicesData = [
  {
    _type: "package",
    name: "Concept & Design Package",
    slug: { current: "concept-design-package" },
    description:
      "Perfect for clients who want to explore design possibilities and understand project feasibility before committing to full development.",
    price: 5000,
    currency: "GHS",
    features: [
      "Site visit and analysis",
      "2D floor plans",
      "Building elevations",
      "Feasibility study",
      "Initial concept sketches",
    ],
    popular: false,
    category: "residential",
  },
  {
    _type: "package",
    name: "Design & Visualization Package",
    slug: { current: "design-visualization-package" },
    description:
      "Our most comprehensive design package that provides everything needed to visualize and plan your project in detail.",
    price: 20000,
    currency: "GHS",
    features: [
      "Construction-ready drawings",
      "Detailed 3D renderings",
      "Material specifications",
      "Interior design guidance",
      "Structural planning",
      "MEP coordination",
    ],
    popular: true,
    category: "residential",
  },
  {
    _type: "package",
    name: "Full Design-to-Build Package",
    slug: { current: "full-design-build-package" },
    description:
      "End-to-end project management from initial design through final construction handover, ensuring seamless execution.",
    price: null, // Percentage-based pricing
    currency: "GHS",
    features: [
      "Complete project management",
      "Design to construction handover",
      "Contractor coordination",
      "Quality control supervision",
      "Timeline management",
      "Budget oversight",
      "Final project handover",
    ],
    popular: false,
    category: "residential",
  },
]

// Static portfolio data from components/portfolio.tsx
const portfolioData = [
  {
    _type: "portfolio",
    title: "Modern Villa, East Legon",
    slug: { current: "modern-villa-east-legon" },
    description: "Contemporary luxury villa featuring sustainable design elements and smart home integration.",
    category: "residential",
    location: "East Legon, Accra",
    completionDate: "2024-01-01",
    projectValue: 500000,
    currency: "GHS",
    featured: true,
    images: [
      {
        _type: "image",
        alt: "Modern Villa East Legon exterior view",
        caption: "Contemporary luxury villa with sustainable design",
      },
    ],
  },
  {
    _type: "portfolio",
    title: "Beachfront Renovation, Ada",
    slug: { current: "beachfront-renovation-ada" },
    description: "Complete transformation of a beachfront property into a modern coastal retreat.",
    category: "renovation",
    location: "Ada Foah, Greater Accra",
    completionDate: "2023-01-01",
    projectValue: 300000,
    currency: "GHS",
    featured: true,
    images: [
      {
        _type: "image",
        alt: "Beachfront renovation Ada after transformation",
        caption: "Modern coastal retreat transformation",
      },
    ],
  },
  {
    _type: "portfolio",
    title: "Office Complex, Kumasi",
    slug: { current: "office-complex-kumasi" },
    description: "Multi-story office complex designed for maximum efficiency and employee wellness.",
    category: "commercial",
    location: "Kumasi, Ashanti Region",
    completionDate: "2024-01-01",
    projectValue: 1200000,
    currency: "GHS",
    featured: true,
    images: [
      {
        _type: "image",
        alt: "Office complex Kumasi exterior",
        caption: "Multi-story office complex with wellness focus",
      },
    ],
  },
  {
    _type: "portfolio",
    title: "Luxury Apartment Interior",
    slug: { current: "luxury-apartment-interior" },
    description: "Sophisticated interior design for a high-end apartment with custom furnishings.",
    category: "residential",
    location: "Airport Hills, Accra",
    completionDate: "2023-01-01",
    projectValue: 150000,
    currency: "GHS",
    featured: false,
    images: [
      {
        _type: "image",
        alt: "Luxury apartment interior design",
        caption: "Sophisticated interior with custom furnishings",
      },
    ],
  },
  {
    _type: "portfolio",
    title: "Executive Residence, Airport Hills",
    slug: { current: "executive-residence-airport-hills" },
    description: "Grand executive residence combining classical elegance with modern amenities.",
    category: "residential",
    location: "Airport Hills, Accra",
    completionDate: "2024-01-01",
    projectValue: 800000,
    currency: "GHS",
    featured: true,
    images: [
      {
        _type: "image",
        alt: "Executive residence Airport Hills",
        caption: "Grand executive residence with classical elegance",
      },
    ],
  },
  {
    _type: "portfolio",
    title: "Retail Shop Design, Tema",
    slug: { current: "retail-shop-design-tema" },
    description: "Contemporary retail space designed to enhance customer experience and product visibility.",
    category: "commercial",
    location: "Tema, Greater Accra",
    completionDate: "2023-01-01",
    projectValue: 80000,
    currency: "GHS",
    featured: false,
    images: [
      {
        _type: "image",
        alt: "Retail shop design Tema interior",
        caption: "Contemporary retail space design",
      },
    ],
  },
]

// Core services data for individual service pages
const coreServicesData = [
  {
    _type: "service",
    title: "Architectural Designs",
    slug: { current: "architectural-designs" },
    description: "Comprehensive architectural design services from concept to construction-ready drawings.",
    icon: "Building2",
    features: [
      "Conceptual design development",
      "Detailed architectural drawings",
      "3D visualization and renderings",
      "Building permit documentation",
      "Construction administration",
    ],
    process: [
      {
        title: "Initial Consultation",
        description: "Understanding your vision, requirements, and site constraints",
      },
      {
        title: "Concept Development",
        description: "Creating initial design concepts and spatial arrangements",
      },
      {
        title: "Design Development",
        description: "Refining designs with detailed drawings and specifications",
      },
      {
        title: "Construction Documents",
        description: "Preparing final drawings for permits and construction",
      },
    ],
    seo: {
      metaTitle: "Architectural Design Services in Ghana | Amart Consult",
      metaDescription:
        "Professional architectural design services in Ghana. From concept to construction-ready drawings for residential and commercial projects.",
    },
  },
  {
    _type: "service",
    title: "Bill of Quantities",
    slug: { current: "bill-of-quantities" },
    description: "Accurate cost estimation and quantity surveying services for construction projects.",
    icon: "Calculator",
    features: [
      "Detailed material quantification",
      "Labor cost estimation",
      "Market rate analysis",
      "Cost optimization strategies",
      "Budget monitoring and control",
    ],
    process: [
      {
        title: "Project Analysis",
        description: "Reviewing architectural drawings and specifications",
      },
      {
        title: "Quantity Take-off",
        description: "Measuring and calculating material quantities",
      },
      {
        title: "Cost Estimation",
        description: "Applying current market rates and labor costs",
      },
      {
        title: "Report Delivery",
        description: "Providing detailed BOQ with cost breakdowns",
      },
    ],
    seo: {
      metaTitle: "Bill of Quantities Services Ghana | Construction Cost Estimation",
      metaDescription:
        "Professional bill of quantities and cost estimation services in Ghana. Accurate construction cost analysis for your building projects.",
    },
  },
  {
    _type: "service",
    title: "Construction Management",
    slug: { current: "construction-management" },
    description: "End-to-end construction management ensuring quality, timeline, and budget compliance.",
    icon: "Users",
    features: [
      "Project planning and scheduling",
      "Quality control and assurance",
      "Contractor coordination",
      "Progress monitoring and reporting",
      "Budget management and cost control",
    ],
    process: [
      {
        title: "Project Planning",
        description: "Developing comprehensive project schedules and resource allocation",
      },
      {
        title: "Team Coordination",
        description: "Managing contractors, suppliers, and project stakeholders",
      },
      {
        title: "Quality Oversight",
        description: "Ensuring construction meets design specifications and standards",
      },
      {
        title: "Project Delivery",
        description: "Final inspections and handover to client",
      },
    ],
    seo: {
      metaTitle: "Construction Management Services Ghana | Project Management",
      metaDescription:
        "Professional construction management services in Ghana. Expert project management for residential and commercial construction projects.",
    },
  },
  {
    _type: "service",
    title: "Project Consultation",
    slug: { current: "project-consultation" },
    description: "Expert consultation services for all phases of your construction and design projects.",
    icon: "MessageCircle",
    features: [
      "Feasibility studies and analysis",
      "Design review and optimization",
      "Regulatory compliance guidance",
      "Value engineering solutions",
      "Risk assessment and mitigation",
    ],
    process: [
      {
        title: "Initial Assessment",
        description: "Evaluating project requirements and constraints",
      },
      {
        title: "Analysis and Research",
        description: "Conducting feasibility studies and market analysis",
      },
      {
        title: "Recommendations",
        description: "Providing expert advice and optimization strategies",
      },
      {
        title: "Implementation Support",
        description: "Ongoing consultation throughout project execution",
      },
    ],
    seo: {
      metaTitle: "Construction Project Consultation Ghana | Expert Advisory Services",
      metaDescription:
        "Expert construction and design consultation services in Ghana. Professional advisory for successful project planning and execution.",
    },
  },
]

// Sample blog posts
const blogPostsData = [
  {
    _type: "blogPost",
    title: "Modern Architecture Trends in Ghana 2024",
    slug: { current: "modern-architecture-trends-ghana-2024" },
    excerpt:
      "Explore the latest architectural trends shaping Ghana's built environment, from sustainable design to smart home integration.",
    author: {
      name: "Amart Consult Team",
      bio: "Professional architects and designers with over 10 years of experience in Ghana's construction industry.",
    },
    publishedAt: "2024-01-15T10:00:00Z",
    featuredImage: {
      alt: "Modern architecture trends in Ghana",
    },
    category: "architecture",
    tags: ["trends", "modern design", "Ghana", "architecture"],
    featured: true,
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Ghana's architectural landscape is evolving rapidly, with new trends emerging that blend traditional elements with contemporary design principles.",
          },
        ],
      },
    ],
    seo: {
      metaTitle: "Modern Architecture Trends in Ghana 2024 | Amart Consult",
      metaDescription:
        "Discover the latest architectural trends in Ghana for 2024. From sustainable design to smart homes, explore what's shaping modern construction.",
    },
  },
  {
    _type: "blogPost",
    title: "Sustainable Building Materials in West Africa",
    slug: { current: "sustainable-building-materials-west-africa" },
    excerpt:
      "A comprehensive guide to eco-friendly building materials available in West Africa and their benefits for construction projects.",
    author: {
      name: "Amart Consult Team",
      bio: "Professional architects and designers with over 10 years of experience in Ghana's construction industry.",
    },
    publishedAt: "2024-01-10T10:00:00Z",
    featuredImage: {
      alt: "Sustainable building materials West Africa",
    },
    category: "construction",
    tags: ["sustainability", "materials", "eco-friendly", "construction"],
    featured: false,
    content: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Sustainable construction is becoming increasingly important in West Africa as we face environmental challenges and resource constraints.",
          },
        ],
      },
    ],
    seo: {
      metaTitle: "Sustainable Building Materials West Africa | Eco-Friendly Construction",
      metaDescription:
        "Guide to sustainable building materials in West Africa. Discover eco-friendly construction options for your building projects.",
    },
  },
]

// Sample testimonials
const testimonialsData = [
  {
    _type: "testimonial",
    name: "Kwame Asante",
    company: "Asante Holdings",
    position: "CEO",
    content:
      "Amart Consult delivered exceptional architectural services for our office complex. Their attention to detail and innovative design solutions exceeded our expectations.",
    rating: 5,
    featured: true,
    date: "2024-01-01",
  },
  {
    _type: "testimonial",
    name: "Akosua Mensah",
    company: "Private Client",
    position: "Homeowner",
    content:
      "The team at Amart Consult transformed our vision into reality. Our new home is everything we dreamed of and more. Highly recommended!",
    rating: 5,
    featured: true,
    date: "2023-12-15",
  },
  {
    _type: "testimonial",
    name: "Dr. Emmanuel Osei",
    company: "Osei Medical Center",
    position: "Director",
    content:
      "Professional, reliable, and creative. Amart Consult designed our medical facility with both functionality and aesthetics in mind.",
    rating: 5,
    featured: false,
    date: "2023-11-20",
  },
]

// Sample FAQs
const faqsData = [
  {
    _type: "faq",
    question: "What services does Amart Consult offer?",
    answer: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "We offer comprehensive architectural services including design, construction management, bill of quantities, and project consultation for residential and commercial projects.",
          },
        ],
      },
    ],
    category: "services",
    order: 1,
    featured: true,
  },
  {
    _type: "faq",
    question: "How long does the design process typically take?",
    answer: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "The design process varies depending on project complexity. Concept design typically takes 2-4 weeks, while complete design and visualization can take 4-8 weeks.",
          },
        ],
      },
    ],
    category: "process",
    order: 2,
    featured: true,
  },
  {
    _type: "faq",
    question: "Do you provide construction services?",
    answer: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "We provide construction management and oversight services. We work with trusted contractors and manage the entire construction process to ensure quality and timeline compliance.",
          },
        ],
      },
    ],
    category: "services",
    order: 3,
    featured: false,
  },
  {
    _type: "faq",
    question: "What are your pricing structures?",
    answer: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Our pricing varies by service and project scope. We offer package deals starting from GHS 5,000 for concept design, with full design-to-build services typically 10-15% of construction cost.",
          },
        ],
      },
    ],
    category: "pricing",
    order: 4,
    featured: true,
  },
]

// Migration functions
async function migrateServices() {
  console.log("Migrating services data...")
  for (const service of coreServicesData) {
    try {
      await client.create(service)
      console.log(`✓ Created service: ${service.title}`)
    } catch (error) {
      console.error(`✗ Failed to create service ${service.title}:`, error)
    }
  }
}

async function migratePackages() {
  console.log("Migrating service packages...")
  for (const pkg of servicesData) {
    try {
      await client.create(pkg)
      console.log(`✓ Created package: ${pkg.name}`)
    } catch (error) {
      console.error(`✗ Failed to create package ${pkg.name}:`, error)
    }
  }
}

async function migratePortfolio() {
  console.log("Migrating portfolio data...")
  for (const project of portfolioData) {
    try {
      await client.create(project)
      console.log(`✓ Created portfolio item: ${project.title}`)
    } catch (error) {
      console.error(`✗ Failed to create portfolio item ${project.title}:`, error)
    }
  }
}

async function migrateBlogPosts() {
  console.log("Migrating blog posts...")
  for (const post of blogPostsData) {
    try {
      await client.create(post)
      console.log(`✓ Created blog post: ${post.title}`)
    } catch (error) {
      console.error(`✗ Failed to create blog post ${post.title}:`, error)
    }
  }
}

async function migrateTestimonials() {
  console.log("Migrating testimonials...")
  for (const testimonial of testimonialsData) {
    try {
      await client.create(testimonial)
      console.log(`✓ Created testimonial: ${testimonial.name}`)
    } catch (error) {
      console.error(`✗ Failed to create testimonial ${testimonial.name}:`, error)
    }
  }
}

async function migrateFAQs() {
  console.log("Migrating FAQs...")
  for (const faq of faqsData) {
    try {
      await client.create(faq)
      console.log(`✓ Created FAQ: ${faq.question}`)
    } catch (error) {
      console.error(`✗ Failed to create FAQ ${faq.question}:`, error)
    }
  }
}

// Main migration function
async function migrateAllContent() {
  console.log("Starting content migration to Sanity CMS...")

  try {
    await migrateServices()
    await migratePackages()
    await migratePortfolio()
    await migrateBlogPosts()
    await migrateTestimonials()
    await migrateFAQs()

    console.log("✅ Content migration completed successfully!")
  } catch (error) {
    console.error("❌ Migration failed:", error)
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateAllContent()
}

export { migrateAllContent }

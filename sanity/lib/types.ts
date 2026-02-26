export interface Service {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  icon?: string;
  features?: string[];
  process?: Array<{
    title: string;
    description: string;
  }>;
  image?: any;
  content?: any[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

export interface ServicePackage {
  _id: string;
  name: string;
  slug: { current: string };
  description: string;
  price?: number;
  currency: string;
  features?: string[];
  popular: boolean;
  category?: string;
}

// ─── Media types ────────────────────────────────────────────────────────────

export interface MediaImage {
  _type: "imageItem";
  image: {
    asset: { _ref: string; url?: string };
    hotspot?: any;
    crop?: any;
  };
  alt?: string;
  caption?: string;
}

export interface MediaVideo {
  _type: "videoItem";
  videoType: "file" | "url";
  /** Present when videoType === "file" */
  videoFile?: {
    asset: { url: string };
  };
  /** Present when videoType === "url" */
  videoUrl?: string;
  posterImage?: {
    asset: { _ref: string; url?: string };
  };
  title?: string;
  caption?: string;
}

export type MediaItem = MediaImage | MediaVideo;

// ─── Portfolio ───────────────────────────────────────────────────────────────

export interface Portfolio {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  category: string;
  location?: string;
  /** "ongoing" | "completed"  — replaces bare completionDate check */
  projectStatus: "ongoing" | "completed";
  completionDate?: string;
  client?: string;
  projectValue?: number;
  currency: string;
  /** New mixed-media array */
  media?: MediaItem[];
  /** Legacy images array – still present on old docs */
  images?: Array<{
    asset: any;
    alt?: string;
    caption?: string;
  }>;
  featured: boolean;
  services?: Service[];
  content?: any[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

export interface BlogPost {
  _updatedAt: string;
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  author?: {
    name: string;
    image?: string;
    bio?: string;
  };
  publishedAt: string;
  featuredImage: {
    url: string;
    alt?: string;
  };
  category?: string;
  tags?: string[];
  content: any[];
  featured: boolean;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

export interface Testimonial {
  _id: string;
  name: string;
  company?: string;
  position?: string;
  content: string;
  rating: number;
  image?: any;
  project?: Portfolio;
  featured: boolean;
  date: string;
}

export interface FAQ {
  _id: string;
  question: string;
  answer: any[];
  category: string;
  order: number;
  featured: boolean;
}

export interface Material {
  _id: string;
  name: string;
  slug: { current: string };
  category:
    | "structural"
    | "finishing"
    | "fixtures"
    | "roofing"
    | "electrical-plumbing";
  description: string;
  image: string;
  imageAlt?: string;
  applications: string[];
  priceRange: {
    min?: number;
    max?: number;
    unit: string;
    currency: "GHS" | "USD";
    note?: string;
  };
  specifications?: Array<{ label: string; value: string }>;
  featured: boolean;
  order?: number;
}

// ─── About Page ──────────────────────────────────────────────────────────────

export interface ProcessStep {
  _id: string;
  title: string;
  description: string;
  stepNumber: number;
  image?: string;
  imageAlt?: string;
}

export interface Credential {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt?: string;
  order: number;
}

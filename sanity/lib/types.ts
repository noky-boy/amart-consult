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

export interface Portfolio {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  category: string;
  location?: string;
  completionDate?: string;
  client?: string;
  projectValue?: number;
  currency: string;
  images: Array<{
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
    image?: string; // Changed from 'any' to 'string' since query returns URL
    bio?: string;
  };
  publishedAt: string;
  featuredImage: {
    url: string; // Changed from 'asset: any' to 'url: string'
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

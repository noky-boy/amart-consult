import { MetadataRoute } from "next";
import { getSitemapData } from "@/sanity/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://amart-consult.vercel.app";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/architectural-designs`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/services/bill-of-quantities`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/services/construction-management`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/services/project-consultation`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/lead-magnet/ghana-building-calculator`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  try {
    const sitemapData = await getSitemapData();
    const dynamicPages: MetadataRoute.Sitemap = [];

    // Add blog posts
    if (sitemapData.blogPosts && Array.isArray(sitemapData.blogPosts)) {
      sitemapData.blogPosts.forEach((post: any) => {
        if (post.slug) {
          dynamicPages.push({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(
              post._updatedAt || post.publishedAt || new Date()
            ),
            changeFrequency: "monthly",
            priority: 0.7,
          });
        }
      });
    }

    // Add portfolio projects
    if (sitemapData.portfolio && Array.isArray(sitemapData.portfolio)) {
      sitemapData.portfolio.forEach((project: any) => {
        if (project.slug) {
          dynamicPages.push({
            url: `${baseUrl}/portfolio/${project.slug}`,
            lastModified: new Date(project._updatedAt || new Date()),
            changeFrequency: "monthly",
            priority: 0.8,
          });
        }
      });
    }

    // Add services (from Sanity CMS)
    if (sitemapData.services && Array.isArray(sitemapData.services)) {
      sitemapData.services.forEach((service: any) => {
        if (service.slug) {
          dynamicPages.push({
            url: `${baseUrl}/services/${service.slug}`,
            lastModified: new Date(service._updatedAt || new Date()),
            changeFrequency: "monthly",
            priority: 0.85,
          });
        }
      });
    }

    return [...staticPages, ...dynamicPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticPages;
  }
}

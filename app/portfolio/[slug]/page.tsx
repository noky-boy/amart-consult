import { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import ProjectPageClient from "./project-client";

interface ProjectData {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  category: string;
  location?: string;
  completionDate?: string;
  client?: string;
  projectValue?: number;
  currency?: string;
  images: Array<{
    asset: { _ref: string; url?: string };
    alt?: string;
    caption?: string;
  }>;
  featured: boolean;
  services: Array<{
    _id: string;
    title: string;
  }>;
  content?: any;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  _updatedAt?: string;
}

// Update the query to include image URLs
async function getProject(slug: string): Promise<ProjectData | null> {
  try {
    const project = await client.fetch(
      `
      *[_type == "portfolio" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        description,
        category,
        location,
        completionDate,
        client,
        projectValue,
        currency,
        images[] {
          asset-> {
            _ref,
            url
          },
          alt,
          caption
        },
        featured,
        "services": services[]-> {
          _id,
          title
        },
        content,
        seo,
        _updatedAt
      }
    `,
      { slug }
    );

    return project;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

async function getRelatedProjects(
  category: string,
  currentId: string
): Promise<ProjectData[]> {
  try {
    const projects = await client.fetch(
      `
      *[_type == "portfolio" && category == $category && _id != $currentId] | order(completionDate desc) [0...2] {
        _id,
        title,
        slug,
        description,
        category,
        completionDate,
        images[0] {
          asset-> {
            _ref,
            url
          },
          alt
        }
      }
    `,
      { category, currentId }
    );

    return projects || [];
  } catch (error) {
    console.error("Error fetching related projects:", error);
    return [];
  }
}

type Props = {
  params: Promise<{ slug: string }>; // 🔥 CHANGE: params is now a Promise
};

// 🔥 CHANGE: await params in generateMetadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; // 🔥 ADD: await params
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const mainImage = project.images?.[0]?.asset?.url;

  return {
    title: `${project.title} - Portfolio | Amart Consult`,
    description:
      project.seo?.metaDescription ||
      project.description ||
      `View ${project.title}, a ${project.category} project by Amart Consult in ${project.location}`,
    keywords: [
      project.category,
      project.location || "",
      "architectural project Ghana",
      "construction project",
      ...(project.services?.map((s) => s.title) || []),
    ],
    openGraph: {
      title: project.title,
      description: project.seo?.metaDescription || project.description,
      type: "website",
      url: `https://amart-consult.vercel.app/portfolio/${slug}`,
      images: mainImage
        ? [
            {
              url: mainImage,
              width: 1200,
              height: 630,
              alt: project.images?.[0]?.alt || project.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.seo?.metaDescription || project.description,
      images: mainImage ? [mainImage] : [],
    },
  };
}

// 🔥 CHANGE: await params in the component
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params; // 🔥 ADD: await params
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const relatedProjects = await getRelatedProjects(
    project.category,
    project._id
  );

  // Structured data
  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    image:
      project.images?.map((img: any) => img.asset?.url).filter(Boolean) || [],
    creator: {
      "@type": "Organization",
      name: "Amart Consult",
    },
    dateCreated: project.completionDate,
    locationCreated: project.location
      ? {
          "@type": "Place",
          name: project.location,
          address: {
            "@type": "PostalAddress",
            addressLocality: project.location,
            addressCountry: "GH",
          },
        }
      : undefined,
    category: project.category,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      <ProjectPageClient project={project} relatedProjects={relatedProjects} />
    </>
  );
}

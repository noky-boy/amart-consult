import { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import ProjectPageClient from "./project-client";
import type { MediaItem } from "@/sanity/lib/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProjectData {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  category: string;
  location?: string;
  projectStatus?: "ongoing" | "completed";
  completionDate?: string;
  client?: string;
  projectValue?: number;
  currency?: string;
  media?: MediaItem[];
  images?: Array<{
    asset: { _ref: string; url?: string };
    alt?: string;
    caption?: string;
  }>;
  featured: boolean;
  services: Array<{ _id: string; title: string }>;
  content?: any;
  seo?: { metaTitle?: string; metaDescription?: string };
  _updatedAt?: string;
}

// ─── Data Fetching ────────────────────────────────────────────────────────────

async function getProject(slug: string): Promise<ProjectData | null> {
  try {
    return await client.fetch(
      `
      *[_type == "portfolio" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        description,
        category,
        location,
        projectStatus,
        completionDate,
        client,
        projectValue,
        currency,
        // New mixed-media array
        "media": media[]{
          _type,
          _type == "imageItem" => {
            "url": image.asset->url,
            "alt": alt,
            "caption": caption,
            "image": {
              "asset": {
                "_ref": image.asset._ref,
                "url": image.asset->url
              }
            }
          },
          _type == "videoItem" => {
            videoType,
            "videoUrl": select(
              videoType == "file" => videoFile.asset->url,
              videoType == "url"  => videoUrl
            ),
            "posterImage": {
              "asset": {
                "_ref": posterImage.asset._ref,
                "url": posterImage.asset->url
              }
            },
            title,
            caption
          }
        },
        // Legacy fallback
        images[] {
          asset-> { _ref, url },
          alt,
          caption
        },
        featured,
        "services": services[]->{ _id, title },
        content,
        seo,
        _updatedAt
      }
    `,
      { slug },
    );
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

async function getRelatedProjects(
  category: string,
  currentId: string,
): Promise<ProjectData[]> {
  try {
    return (
      (await client.fetch(
        `
      *[_type == "portfolio" && category == $category && _id != $currentId]
      | order(completionDate desc) [0...2] {
        _id,
        title,
        slug,
        description,
        category,
        projectStatus,
        completionDate,
        "media": media[0]{
          _type,
          _type == "imageItem" => {
            "url": image.asset->url,
            "alt": alt,
            "image": { "asset": { "_ref": image.asset._ref, "url": image.asset->url } }
          },
          _type == "videoItem" => {
            "posterImage": { "asset": { "url": posterImage.asset->url } }
          }
        },
        "images": images[0]{ asset->{ _ref, url }, alt }
      }
    `,
        { category, currentId },
      )) ?? []
    );
  } catch (error) {
    console.error("Error fetching related projects:", error);
    return [];
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  // First image URL — from media or legacy images
  let mainImageUrl: string | undefined;
  if (project.media && project.media.length > 0) {
    const first = project.media[0];
    if (first._type === "imageItem") {
      mainImageUrl = (first as any).url ?? first.image?.asset?.url;
    } else if (first._type === "videoItem") {
      mainImageUrl = first.posterImage?.asset?.url;
    }
  } else {
    mainImageUrl = project.images?.[0]?.asset?.url;
  }

  return {
    title:
      project.seo?.metaTitle ?? `${project.title} - Portfolio | Amart Consult`,
    description:
      project.seo?.metaDescription ??
      project.description ??
      `View ${project.title}, a ${project.category} project by Amart Consult${project.location ? ` in ${project.location}` : ""}`,
    keywords: [
      project.category,
      project.location ?? "",
      "architectural project Ghana",
      "construction project",
      ...(project.services?.map((s) => s.title) ?? []),
    ],
    openGraph: {
      title: project.title,
      description: project.seo?.metaDescription ?? project.description,
      type: "website",
      url: `https://amart-consult.vercel.app/portfolio/${slug}`,
      ...(mainImageUrl
        ? {
            images: [
              {
                url: mainImageUrl,
                width: 1200,
                height: 630,
                alt: project.title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.seo?.metaDescription ?? project.description,
      ...(mainImageUrl ? { images: [mainImageUrl] } : {}),
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const relatedProjects = await getRelatedProjects(
    project.category,
    project._id,
  );

  // Schema.org structured data
  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    creator: { "@type": "Organization", name: "Amart Consult" },
    dateCreated: project.completionDate,
    ...(project.location
      ? {
          locationCreated: {
            "@type": "Place",
            name: project.location,
            address: {
              "@type": "PostalAddress",
              addressLocality: project.location,
              addressCountry: "GH",
            },
          },
        }
      : {}),
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

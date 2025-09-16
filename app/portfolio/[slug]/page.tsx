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
    asset: { _ref: string };
    alt?: string;
    caption?: string;
  }>;
  featured: boolean;
  services: Array<{
    _id: string;
    title: string;
  }>;
  content?: any; // PortableText content
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

// Fetch individual project from Sanity
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
          asset,
          alt,
          caption
        },
        featured,
        "services": services[]-> {
          _id,
          title
        },
        content,
        seo
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

// Fetch related projects (same category, different project)
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
          asset,
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

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProject(params.slug);

  if (!project) {
    notFound();
  }

  const relatedProjects = await getRelatedProjects(
    project.category,
    project._id
  );

  return (
    <ProjectPageClient project={project} relatedProjects={relatedProjects} />
  );
}

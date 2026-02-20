import { defineField, defineType } from "sanity";

export const portfolio = defineType({
  name: "portfolio",
  title: "Portfolio Item",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Project Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Residential", value: "residential" },
          { title: "Commercial", value: "commercial" },
          { title: "Industrial", value: "industrial" },
          { title: "Renovation", value: "renovation" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),

    // ─── Part 1: Ongoing / Completed toggle ─────────────────────────────────
    defineField({
      name: "projectStatus",
      title: "Project Status",
      type: "string",
      options: {
        list: [
          { title: "Ongoing", value: "ongoing" },
          { title: "Completed", value: "completed" },
        ],
        layout: "radio", // renders as two radio buttons in the Studio
      },
      initialValue: "completed",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "completionDate",
      title: "Completion Date",
      type: "date",
      // Only relevant when projectStatus === "completed"
      hidden: ({ document }) => document?.projectStatus !== "completed",
      options: {
        dateFormat: "MMMM YYYY",
      },
    }),
    // ─────────────────────────────────────────────────────────────────────────

    defineField({
      name: "client",
      title: "Client",
      type: "string",
    }),
    defineField({
      name: "projectValue",
      title: "Project Value",
      type: "number",
    }),
    defineField({
      name: "currency",
      title: "Currency",
      type: "string",
      options: {
        list: [
          { title: "USD", value: "USD" },
          { title: "GHS", value: "GHS" },
          { title: "EUR", value: "EUR" },
        ],
      },
      initialValue: "GHS",
    }),

    // ─── Part 1: Mixed media array (images + videos) ─────────────────────────
    defineField({
      name: "media",
      title: "Project Media (Images & Videos)",
      type: "array",
      description:
        "Add images and/or videos. The first item is used as the cover thumbnail.",
      of: [
        // ── Image item ──
        {
          type: "object",
          name: "imageItem",
          title: "Image",
          icon: () => "🖼️",
          fields: [
            {
              name: "image",
              type: "image",
              title: "Image",
              options: { hotspot: true },
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: "alt",
              type: "string",
              title: "Alt Text",
              description: "Describe the image for accessibility and SEO",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
          preview: {
            select: {
              title: "alt",
              media: "image",
            },
            prepare({ title, media }: any) {
              return {
                title: title || "Image",
                media,
              };
            },
          },
        },

        // ── Video item ──
        {
          type: "object",
          name: "videoItem",
          title: "Video",
          icon: () => "🎬",
          fields: [
            {
              name: "videoType",
              type: "string",
              title: "Video Source",
              options: {
                list: [
                  { title: "Upload to Sanity", value: "file" },
                  {
                    title: "External URL (YouTube / Vimeo / MP4)",
                    value: "url",
                  },
                ],
                layout: "radio",
              },
              initialValue: "file",
              validation: (Rule: any) => Rule.required(),
            },
            // Sanity-hosted file
            {
              name: "videoFile",
              type: "file",
              title: "Video File",
              description: "Recommended: MP4 H.264, max 50 MB",
              options: {
                accept: "video/*",
              },
              hidden: ({ parent }: any) => parent?.videoType !== "file",
            },
            // External URL (YouTube, Vimeo, or direct .mp4 link)
            {
              name: "videoUrl",
              type: "url",
              title: "Video URL",
              description: "Paste a YouTube, Vimeo, or direct MP4 / WebM link",
              hidden: ({ parent }: any) => parent?.videoType !== "url",
            },
            // Optional poster image (thumbnail shown before play)
            {
              name: "posterImage",
              type: "image",
              title: "Poster / Thumbnail",
              description:
                "Optional: displayed before the video plays and in the gallery grid",
              options: { hotspot: true },
            },
            {
              name: "title",
              type: "string",
              title: "Video Title",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
          preview: {
            select: {
              title: "title",
              media: "posterImage",
              videoType: "videoType",
            },
            prepare({ title, media, videoType }: any) {
              return {
                title: title || "Video",
                subtitle:
                  videoType === "file" ? "Sanity upload" : "External URL",
                media,
              };
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
    // ─────────────────────────────────────────────────────────────────────────

    // Keep legacy `images` field so existing documents don't break.
    // You can migrate data and remove it later.
    defineField({
      name: "images",
      title: "Images (Legacy — use Media instead)",
      type: "array",
      hidden: true, // hidden in Studio UI but data is preserved
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", type: "string", title: "Alternative Text" },
            { name: "caption", type: "string", title: "Caption" },
          ],
        },
      ],
    }),

    defineField({
      name: "featured",
      title: "Featured Project",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "services",
      title: "Services Provided",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }],
    }),
    defineField({
      name: "content",
      title: "Project Details",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        { name: "metaTitle", type: "string", title: "Meta Title" },
        { name: "metaDescription", type: "text", title: "Meta Description" },
      ],
    }),
  ],

  // ── Studio preview ──────────────────────────────────────────────────────────
  preview: {
    select: {
      title: "title",
      status: "projectStatus",
      media: "media.0.image",
    },
    prepare({ title, status, media }: any) {
      return {
        title,
        subtitle: status === "ongoing" ? "🔄 Ongoing" : "✅ Completed",
        media,
      };
    },
  },
});

import { defineField, defineType } from "sanity"

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Client Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "company",
      title: "Company",
      type: "string",
    }),
    defineField({
      name: "position",
      title: "Position",
      type: "string",
    }),
    defineField({
      name: "content",
      title: "Testimonial Content",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "rating",
      title: "Rating",
      type: "number",
      options: {
        list: [
          { title: "5 Stars", value: 5 },
          { title: "4 Stars", value: 4 },
          { title: "3 Stars", value: 3 },
          { title: "2 Stars", value: 2 },
          { title: "1 Star", value: 1 },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Client Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "project",
      title: "Related Project",
      type: "reference",
      to: [{ type: "portfolio" }],
    }),
    defineField({
      name: "featured",
      title: "Featured Testimonial",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
  ],
})

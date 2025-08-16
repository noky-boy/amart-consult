import { defineField, defineType } from "sanity"

export const servicePackage = defineType({
  name: "package",
  title: "Service Package",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Package Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
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
      name: "price",
      title: "Price",
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
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "popular",
      title: "Popular Package",
      type: "boolean",
      initialValue: false,
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
        ],
      },
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "description",
      popular: "popular",
    },
    prepare(selection) {
      const { title, subtitle, popular } = selection
      return {
        title: popular ? `⭐ ${title}` : title,
        subtitle,
      }
    },
  },
})

export const pkg = servicePackage
export { servicePackage as package }

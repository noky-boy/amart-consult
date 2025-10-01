import { defineType, defineField } from "sanity";

export default defineType({
  name: "material",
  title: "Construction Material",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Material Name",
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
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Structural Materials", value: "structural" },
          { title: "Finishing Materials", value: "finishing" },
          { title: "Fixtures & Fittings", value: "fixtures" },
          { title: "Roofing Materials", value: "roofing" },
          { title: "Electrical & Plumbing", value: "electrical-plumbing" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    {
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (Rule: any) => Rule.required().min(50).max(300),
    },
    {
      name: "image",
      title: "Material Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    },
    {
      name: "applications",
      title: "Typical Applications/Use Cases",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule: any) => Rule.required().min(2).max(6),
    },
    {
      name: "priceRange",
      title: "Price Range",
      type: "object",
      fields: [
        {
          name: "min",
          title: "Minimum Price",
          type: "number",
        },
        {
          name: "max",
          title: "Maximum Price",
          type: "number",
        },
        {
          name: "unit",
          title: "Unit",
          type: "string",
          options: {
            list: [
              { title: "Per Bag", value: "bag" },
              { title: "Per Piece", value: "piece" },
              { title: "Per Square Meter", value: "sqm" },
              { title: "Per Cubic Meter", value: "m3" },
              { title: "Per Meter", value: "meter" },
              { title: "Per Liter", value: "liter" },
              { title: "Per Ton", value: "ton" },
            ],
          },
        },
        {
          name: "currency",
          title: "Currency",
          type: "string",
          initialValue: "GHS",
          options: {
            list: [
              { title: "GHS (Ghanaian Cedi)", value: "GHS" },
              { title: "USD (US Dollar)", value: "USD" },
            ],
          },
        },
        {
          name: "note",
          title: "Price Note",
          type: "string",
          description:
            "Optional note about pricing (e.g., 'Prices vary by supplier')",
        },
      ],
    },
    {
      name: "specifications",
      title: "Technical Specifications (Optional)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Specification Label" },
            { name: "value", type: "string", title: "Specification Value" },
          ],
        },
      ],
    },
    defineField({
      name: "featured",
      title: "Featured Material",
      type: "boolean",
      initialValue: false,
      description:
        "Featured materials will be highlighted on the resources page",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first",
    }),
  ],
  preview: {
    select: {
      title: "name",
      category: "category",
      media: "image",
    },
    prepare(selection) {
      const { title, category, media } = selection;
      return {
        title,
        subtitle: category,
        media,
      };
    },
  },
});

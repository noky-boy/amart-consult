import { defineField, defineType } from "sanity";

export const processStep = defineType({
  name: "processStep",
  title: "Process Step",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Step Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "stepNumber",
      title: "Step Number",
      type: "number",
      description:
        "Controls the display order and the number shown on the card",
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: "image",
      title: "Step Image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt Text" }],
      description: "Optional image illustrating this step",
    }),
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      initialValue: true,
      description: "Uncheck to hide without deleting",
    }),
  ],
  preview: {
    select: {
      title: "title",
      stepNumber: "stepNumber",
      media: "image",
    },
    prepare({ title, stepNumber, media }: any) {
      return {
        title: `${stepNumber}. ${title}`,
        media,
      };
    },
  },
});

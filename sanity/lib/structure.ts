import type { StructureBuilder } from "sanity/structure"

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Content Management")
    .items([
      // Services Section
      S.listItem()
        .title("Services")
        .child(
          S.list()
            .title("Services Management")
            .items([
              S.listItem().title("All Services").child(S.documentTypeList("service").title("All Services")),
              S.listItem().title("Service Packages").child(S.documentTypeList("package").title("Service Packages")),
            ]),
        ),

      // Portfolio Section
      S.listItem()
        .title("Portfolio")
        .child(
          S.list()
            .title("Portfolio Management")
            .items([
              S.listItem().title("All Projects").child(S.documentTypeList("portfolio").title("All Projects")),
              S.listItem()
                .title("Featured Projects")
                .child(S.documentTypeList("portfolio").title("Featured Projects").filter("featured == true")),
              S.listItem()
                .title("By Category")
                .child(
                  S.list()
                    .title("Projects by Category")
                    .items([
                      S.listItem()
                        .title("Residential")
                        .child(
                          S.documentTypeList("portfolio")
                            .title("Residential Projects")
                            .filter('category == "residential"'),
                        ),
                      S.listItem()
                        .title("Commercial")
                        .child(
                          S.documentTypeList("portfolio")
                            .title("Commercial Projects")
                            .filter('category == "commercial"'),
                        ),
                      S.listItem()
                        .title("Industrial")
                        .child(
                          S.documentTypeList("portfolio")
                            .title("Industrial Projects")
                            .filter('category == "industrial"'),
                        ),
                    ]),
                ),
            ]),
        ),

      // Blog Section
      S.listItem()
        .title("Blog")
        .child(
          S.list()
            .title("Blog Management")
            .items([
              S.listItem().title("All Posts").child(S.documentTypeList("blogPost").title("All Blog Posts")),
              S.listItem()
                .title("Featured Posts")
                .child(S.documentTypeList("blogPost").title("Featured Posts").filter("featured == true")),
              S.listItem()
                .title("Published Posts")
                .child(S.documentTypeList("blogPost").title("Published Posts").filter("publishedAt < now()")),
              S.listItem()
                .title("Draft Posts")
                .child(
                  S.documentTypeList("blogPost")
                    .title("Draft Posts")
                    .filter("publishedAt > now() || !defined(publishedAt)"),
                ),
            ]),
        ),

      // Client Feedback Section
      S.listItem()
        .title("Client Feedback")
        .child(
          S.list()
            .title("Testimonials & FAQs")
            .items([
              S.listItem().title("All Testimonials").child(S.documentTypeList("testimonial").title("All Testimonials")),
              S.listItem()
                .title("Featured Testimonials")
                .child(S.documentTypeList("testimonial").title("Featured Testimonials").filter("featured == true")),
              S.listItem().title("FAQs").child(S.documentTypeList("faq").title("Frequently Asked Questions")),
            ]),
        ),

      // Divider
      S.divider(),

      // Settings (if needed in future)
      S.listItem()
        .title("Site Settings")
        .child(
          S.list().title("Settings").items([
            // Placeholder for future settings
          ]),
        ),
    ])

import { service } from "./service";
import { servicePackage } from "./package";
import { portfolio } from "./portfolio";
import { blogPost } from "./blogPost";
import { testimonial } from "./testimonial";
import material from "./material";
import { faq } from "./faq";
import { credential } from "./credential";
import { processStep } from "./processStep";

export const schemaTypes = [
  service,
  servicePackage,
  portfolio,
  blogPost,
  testimonial,
  material,
  faq,
  credential, // ← add
  processStep, // ← add
];

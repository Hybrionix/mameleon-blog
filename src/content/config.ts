import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.string(),
    heroImage: z.string(),
    lang: z.enum(["nl", "en"]), // <-- Add this line!
  }),
});

export const collections = { blog };
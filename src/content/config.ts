// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const exhibitsCollection = defineCollection({
  type: 'content',
  // 我们将schema的定义，改回了函数形式，并使用了image()助手
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    // 这，才是处理图片的最正确、最健壮的方式
    cover: image().optional(), 
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  'exhibits': exhibitsCollection,
};
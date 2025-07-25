import { z } from "zod";

export const PostSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  tags: z.array(z.string()),
  reactions: z.object({
    likes: z.number(),
    dislikes: z.number(),
  }),
  views: z.number(),
  userId: z.number(),
});

export const ArrayPostSchema = z.array(PostSchema);

export type PostType = z.infer<typeof PostSchema>;

export const ResponseGetPostSchema = z.object({
  posts: z.array(PostSchema),
  total: z.number(),
  limit: z.number(),
  skip: z.number(),
});

export type ResponseGetPostType = z.infer<typeof ResponseGetPostSchema>;

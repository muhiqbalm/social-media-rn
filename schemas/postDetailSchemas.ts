// schemas/postDetailSchema.ts
import { z } from "zod";

// Single Post Detail Schema
export const PostDetailSchema = z.object({
    id: z.number(),
    title: z.string(),
    body: z.string(),
    tags: z.array(z.string()),
    reactions: z.object({
        likes: z.number(),
        dislikes: z.number(),
    }),
    userId: z.number(),
    views: z.number(),
});

// Comment User Schema
export const CommentUserSchema = z.object({
    id: z.number(),
    username: z.string(),
    fullName: z.string(),
});

// Comment Schema
export const CommentSchema = z.object({
    id: z.number(),
    body: z.string(),
    postId: z.number(),
    likes: z.number(),
    user: CommentUserSchema,
});

// Comments Response Schema (for GET /comments/post/{id})
export const CommentsResponseSchema = z.object({
    comments: z.array(CommentSchema),
    total: z.number(),
    skip: z.number(),
    limit: z.number(),
});

// Add Comment Request Schema
export const AddCommentRequestSchema = z.object({
    body: z.string(),
    postId: z.number(),
    userId: z.number(),
});

// Add Comment Response Schema (what DummyJSON returns)
export const AddCommentResponseSchema = z.object({
    id: z.number(),
    body: z.string(),
    postId: z.number(),
    likes: z.number().default(0),
    user: z.object({
        id: z.number(),
        username: z.string(),
        fullName: z.string().optional(),
    }),
});

// Type exports
export type PostDetailType = z.infer<typeof PostDetailSchema>;
export type CommentType = z.infer<typeof CommentSchema>;
export type CommentUserType = z.infer<typeof CommentUserSchema>;
export type CommentsResponseType = z.infer<typeof CommentsResponseSchema>;
export type AddCommentRequestType = z.infer<typeof AddCommentRequestSchema>;
export type AddCommentResponseType = z.infer<typeof AddCommentResponseSchema>;
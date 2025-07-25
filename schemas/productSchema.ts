import { z } from "zod";

export const ProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  price: z.number(),
  discountPercentage: z.number(),
  rating: z.number(),
  stock: z.number(),
  tags: z.array(z.string()),
  brand: z.string().optional(),
  sku: z.string(),
  weight: z.number(),
  dimensions: z.object({
    width: z.number(),
    height: z.number(),
    depth: z.number(),
  }),
  warrantyInformation: z.string(),
  shippingInformation: z.string(),
  availabilityStatus: z.string(),
  reviews: z.array(
    z.object({
      rating: z.number(),
      comment: z.string(),
      date: z.string().datetime(),
      reviewerName: z.string(),
      reviewerEmail: z.string().email(),
    })
  ),
  returnPolicy: z.string(),
  minimumOrderQuantity: z.number(),
  meta: z.object({
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    barcode: z.string(),
    qrCode: z.string().url(),
  }),
  images: z.array(z.string().url()),
  thumbnail: z.string().url(),
});

export type ProductType = z.infer<typeof ProductSchema>;

export const ResponseGetProductSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number(),
  limit: z.number(),
  skip: z.number(),
});

export type ResponseGetPostType = z.infer<typeof ResponseGetProductSchema>;

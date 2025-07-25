import { z } from "zod";

export const UserDetailSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  maidenName: z.string(),
  age: z.number().nullable(),
  gender: z.string(),
  email: z.string(),
  phone: z.string(),
  username: z.string(),
  password: z.string(),
  birthDate: z.string(),
  image: z.string(),
  bloodGroup: z.string(),
  height: z.number().nullable(),
  weight: z.number().nullable(),
  eyeColor: z.string(),
  hair: z.object({
    color: z.string(),
    type: z.string(),
  }),
  domain: z.string().optional(),
  ip: z.string(),
  address: z.object({
    address: z.string(),
    city: z.string(),
    coordinates: z.object({
      lat: z.number().nullable(),
      lng: z.number().nullable(),
    }),
    postalCode: z.string(),
    state: z.string(),
  }),
  macAddress: z.string(),
  university: z.string(),
  bank: z.object({
    cardExpire: z.string(),
    cardNumber: z.string(),
    cardType: z.string(),
    currency: z.string(),
    iban: z.string(),
  }),
  company: z.object({
    address: z.object({
      address: z.string(),
      city: z.string(),
      coordinates: z.object({
        lat: z.number().nullable(),
        lng: z.number().nullable(),
      }),
      postalCode: z.string(),
      state: z.string(),
    }),
    department: z.string(),
    name: z.string(),
    title: z.string(),
  }),
  ein: z.string(),
  ssn: z.string(),
  userAgent: z.string(),
});

export type UserDetailType = z.infer<typeof UserDetailSchema>;

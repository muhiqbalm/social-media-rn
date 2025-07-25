import { z } from "zod";

export const ProfileSchema = z.object({
  username: z
    .string({ message: "Username is required" })
    .min(3, { message: "Username must be at least 3 characters" }),
  email: z.string({ message: "Email is required" }).email("Invalid email"),
  password: z
    .string({ message: "Password is required" })
    .min(8, { message: "Password is too short" })
    .max(20, { message: "Password is too long" })
    .regex(/[A-Z]/, { message: "Must contain uppercase" })
    .regex(/[a-z]/, { message: "Must contain lowercase" })
    .regex(/[0-9]/, { message: "Must contain number" })
    .regex(/[$&+,:;=?@#|'<>.^*()%!-]/, {
      message: "Must contain special character",
    }),
  phone_number: z
    .string({ message: "Phone number is required" })
    .regex(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/, {
      message: "Invalid phone number",
    }),
  address: z
    .string({ message: "Address is required" })
    .max(255, { message: "Address is too long" }),
  bio: z.string().max(255, { message: "Bio is too long" }),
});

export type ProfileFormData = z.infer<typeof ProfileSchema>;

export const DefaultProfileData: ProfileFormData = {
  username: "",
  email: "",
  password: "",
  phone_number: "",
  address: "",
  bio: "",
};

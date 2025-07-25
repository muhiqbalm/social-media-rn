import { z } from "zod";

export const RegisterSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .refine((username) => !username.includes(" "), {
        message: "Username cannot contain spaces",
      }),
    firstName: z
      .string()
      .min(1, { message: "First name is required" })
      .max(20, { message: "First name maximum length is 20 characters" }),
    lastName: z
      .string()
      .min(1, { message: "Last name is required" })
      .max(20, { message: "Last name maximum length is 20 characters" }),
    email: z
      .email("Invalid email format")
      .min(1, { message: "Email is required" }),
    password: z
      .string({ message: "Password is required" })
      .min(8, { message: "Password minimum length is 8 characters" })
      .max(20, { message: "Password maximum length is 20 characters" })
      .regex(/[A-Z]/, { message: "Password must contain uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain lowercase letter" })
      .regex(/[0-9]/, { message: "Password contain number" })
      .regex(/[$&+,:;=?@#|'<>.^*()%!-]/, {
        message: "Password must contain special character",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
    agree: z.boolean().refine((val) => val === true, {
      message: "You must agree to the rules and policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type RegisterDataType = z.infer<typeof RegisterSchema>;

export const DefaultRegisterData: RegisterDataType = {
  username: "",
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  confirmPassword: "",
  agree: false,
};

export const PayloadRegisterSchema = RegisterSchema.omit({
  confirmPassword: true,
  agree: true,
});

export type PayloadRegisterType = z.infer<typeof PayloadRegisterSchema>;

import { z } from "zod";

export const LoginSchema = z.object({
  username: z.string().min(1, { message: "Username is required." }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

export const DefaultLoginData: LoginFormData = {
  username: "",
  password: "",
};

export const ResponseLoginSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  gender: z.string(),
  image: z.string(),
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type ResponseLoginType = z.infer<typeof ResponseLoginSchema>;

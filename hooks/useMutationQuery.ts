import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import z from "zod";

/**
 * Hook untuk mutation (POST/PUT/DELETE) menggunakan react-query dan validasi dengan Zod.
 *
 * @param mutationFn - Fungsi async yang menerima variables dan mengembalikan response data
 * @param schema - Skema Zod untuk validasi response
 * @param options - Opsi tambahan useMutation (onSuccess, onError, dll)
 */
export default function useMutationQuery<
  TData = unknown,
  TVariables = void,
  TContext = unknown
>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
  schema: z.ZodType<TData>,
  options?: UseMutationOptions<TData, Error, TVariables, TContext>
): UseMutationResult<TData, Error, TVariables, TContext> {
  const validatedMutationFn = async (variables: TVariables): Promise<TData> => {
    try {
      const result = await mutationFn(variables);
      return schema.parse(result);
    } catch (err: any) {
      throw new Error(err.message || "Client Side Error!");
    }
  };

  return useMutation<TData, Error, TVariables, TContext>({
    mutationFn: validatedMutationFn,
    retry: false,
    ...options,
  });
}

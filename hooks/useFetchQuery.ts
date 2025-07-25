import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import axios from "axios";
import z from "zod";

/**
 * Hook untuk melakukan fetch data dengan react-query menggunakan Axios
 * @param key - Key untuk query
 * @param baseUrl - URL endpoint
 * @param schema - Zod schema untuk validasi data
 * @param config - Optional configuration object
 * @returns hasil dari useQuery
 */
type FetchQueryConfig<T> = {
  params?: Record<string, string | number | boolean>;
  options?: UseQueryOptions<T, Error>;
};

export default function useFetchQuery<T = any>(
  key: string | Array<string | number>,
  baseUrl: string,
  schema: z.ZodType<T>,
  config: FetchQueryConfig<T> = {}
): UseQueryResult<T, Error> {
  const { params = {}, options = {} } = config;

  const fetchData = async (): Promise<T> => {
    try {
      const response = await axios.get(baseUrl, {
        params,
      });

      return schema.parse(response.data);
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Client Side Error!";
      throw new Error(message);
    }
  };

  return useQuery<T, Error>({
    queryKey: [key, params],
    queryFn: fetchData,
    retry: false,
    ...options,
  });
}

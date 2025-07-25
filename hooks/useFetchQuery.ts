import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import z from "zod";

/**
 * Hook untuk melakukan fetch data dengan react-query
 * @param key - Key untuk query
 * @param baseUrl - URL endpoint
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

  const fetchData = async () => {
    try {
      const searchParams = new URLSearchParams(
        Object.entries(params).reduce((acc, [k, v]) => {
          acc[k] = String(v);
          return acc;
        }, {} as Record<string, string>)
      ).toString();

      const fullUrl = `${baseUrl}${searchParams ? `?${searchParams}` : ""}`;
      const response = await fetch(fullUrl);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      return schema ? schema.parse(data) : data;
    } catch (err: any) {
      throw new Error(err.message || "Client Side Error!");
    }
  };

  return useQuery<T, Error>({
    queryKey: [key, params],
    queryFn: fetchData,
    retry: false,
    ...options,
  });
}

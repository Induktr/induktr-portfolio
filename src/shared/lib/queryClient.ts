import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }
}

const getBaseUrl = () => {
  // Use NEXT_PUBLIC_API_URL if defined, otherwise use current origin for relative paths
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) return apiUrl;
  return "";
};

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const baseUrl = getBaseUrl();
  const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;

  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) options.body = JSON.stringify(data);

  const res = await fetch(fullUrl, options);
  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const [url] = queryKey as [string];
    const baseUrl = getBaseUrl();
    const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;
    
    const res = await fetch(fullUrl);

    if (!res.ok) {
      if (res.status === 401 && unauthorizedBehavior === "returnNull") {
        return null;
      }
      await throwIfResNotOk(res);
    }

    return res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

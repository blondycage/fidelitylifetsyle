import { ApiResponse } from "@/types/api";

interface ApiHook {
  get: <T>(endpoint: string, params?: Record<string, any>) => Promise<ApiResponse<T>>;
  post: <T>(endpoint: string, body?: any, headers?: Record<string, string>, query?: Record<string, any>) => Promise<ApiResponse<T>>;
  put: <T>(endpoint: string, body?: any, headers?: Record<string, string>) => Promise<ApiResponse<T>>;
  delete: <T>(endpoint: string, headers?: Record<string, string>) => Promise<ApiResponse<T>>;
}

export const useApi = (baseURL: string): ApiHook => {
  const buildUrl = (endpoint: string, query?: Record<string, any>) => {
    const url = new URL(endpoint, baseURL);
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        url.searchParams.append(key, value.toString());
      });
    }
    return url.toString();
  };

  const request = async <T>(
    url: string,
    options: RequestInit
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(`API request failed: ${error}`);
    }
  };

  return {
    get: <T>(endpoint: string, params?: Record<string, any>) =>
      request<T>(buildUrl(endpoint, params), { method: 'GET' }),

    post: <T>(endpoint: string, body?: any, headers?: Record<string, string>, query?: Record<string, any>) =>
      request<T>(buildUrl(endpoint, query), {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
        headers,
      }),

    put: <T>(endpoint: string, body?: any, headers?: Record<string, string>) =>
      request<T>(buildUrl(endpoint), {
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined,
        headers,
      }),

    delete: <T>(endpoint: string, headers?: Record<string, string>) =>
      request<T>(buildUrl(endpoint), {
        method: 'DELETE',
        headers,
      }),
  };
};
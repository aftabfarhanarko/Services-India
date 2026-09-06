import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '@/lib/token';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.rajseba.in";

// Background ping to keep Render backend warm and eliminate 50s cold-start delays
if (typeof window !== "undefined") {
  const pingBackend = () => {
    fetch(`${API_BASE_URL}/category`, { method: "GET", mode: "cors" }).catch(() => { });
  };
  pingBackend();
  setInterval(pingBackend, 4 * 60 * 1000); // Ping every 4 minutes to prevent Render free instance spin-down
}

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = getAccessToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
  timeout: 15000,
});

const isProtectedRoute = (pathname: string): boolean => {
  const cleanPath = pathname.replace(/\/$/, "");
  return cleanPath === "/profile" || cleanPath.startsWith("/dashbord");
};

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      // attempt to refresh token
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh-token',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // save new tokens
        const data = refreshResult.data as any;
        const tokenContainer = data.data || data;
        const accessToken = tokenContainer.accessToken || tokenContainer.access_token;
        const newRefreshToken = tokenContainer.refreshToken || tokenContainer.refresh_token || refreshToken;

        if (accessToken) {
          setTokens(accessToken, newRefreshToken);
          // retry the original query
          result = await baseQuery(args, api, extraOptions);
        } else {
          clearTokens();
          if (typeof window !== 'undefined' && isProtectedRoute(window.location.pathname)) {
            window.location.href = '/login';
          }
        }
      } else {
        clearTokens();
        if (typeof window !== 'undefined' && isProtectedRoute(window.location.pathname)) {
          window.location.href = '/login';
        }
      }
    } else {
      clearTokens();
      if (typeof window !== 'undefined' && isProtectedRoute(window.location.pathname)) {
        window.location.href = '/login';
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  keepUnusedDataFor: 300, // Retain query cache for 5 minutes across page navigations
  refetchOnFocus: false, // Disable automatic background refetch on tab focus for lightning speed
  endpoints: () => ({}),
  tagTypes: ['Admin', 'Landing', 'Agent', 'Client', 'Vendor', 'Category', 'Service', 'NestedService', 'SubService', 'Package', 'Profile', 'Withdraw', 'Booking', 'Coupon', 'Devision', 'District', 'Area', 'Chat', 'Getways', 'Notification', 'Hero', 'CustomShifting', 'Help', 'Blog', 'Branding'],
});

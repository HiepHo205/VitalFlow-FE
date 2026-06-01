import axios from "axios";

import type {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import type { ApiResource } from "@/types/api";
import type { AuthToken } from "@/types/auth";

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshRequest: Promise<string> | null = null;

const refreshAccessToken = async () => {
  const token =
    localStorage.getItem(
      "access_token"
    );

  if (!token) {
    throw new Error(
      "No access token available for refresh."
    );
  }

  const refreshResponse =
    await axios.post<ApiResource<AuthToken>>(
      `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  const newToken =
    refreshResponse.data.data
      .access_token;

  localStorage.setItem(
    "access_token",
    newToken
  );

  return newToken;
};

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL,

  headers: {
    "Content-Type":
      "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "access_token"
      );

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }
);

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as
        | RetryableRequestConfig
        | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        refreshRequest ??=
          refreshAccessToken().finally(
            () => {
              refreshRequest = null;
            }
          );

        const newToken =
          await refreshRequest;

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem(
          "access_token"
        );

        window.location.href =
          "/login";

        return Promise.reject(
          refreshError
        );
      }
    }

    return Promise.reject(error);
  }
);

export default api;

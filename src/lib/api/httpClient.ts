import axios, { AxiosError } from "axios";
import { ERROR_CODES } from "@/lib/utils/errorCodes";

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string)?.replace(/\/$/, "") || "";

if (!API_BASE_URL) {
  console.error(
    "⚠️ VITE_API_URL n'est pas définie. Veuillez configurer cette variable dans votre fichier .env"
  );
}

const AUTH_STORAGE_KEY = "_auth_shop";

export function getAuthToken(): string | null {
  try {
    const token = localStorage.getItem(AUTH_STORAGE_KEY);
    return token ? token.trim() : null;
  } catch {
    return null;
  }
}

export function setAuthToken(token: string): void {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, token);
  } catch {
    // ignore
  }
}

export function removeAuthToken(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(`${AUTH_STORAGE_KEY}_type`);
    localStorage.removeItem(`${AUTH_STORAGE_KEY}_state`);
  } catch {
    // ignore
  }
}

function getAcceptLanguage(): string {
  try {
    const stored =
      localStorage.getItem("i18nextLng") || localStorage.getItem("locale");
    if (stored) {
      const lang = stored.split("-")[0].toLowerCase();
      return lang === "fr" ? "fr" : "en";
    }

    const browserLang = navigator.language || "en";
    const langCode = browserLang.split("-")[0].toLowerCase();

    return langCode === "fr" ? "fr" : "en";
  } catch {
    return "en";
  }
}

function handleLogout(reason?: string): void {
  window.dispatchEvent(
    new CustomEvent("auth:logout", {
      detail: { reason },
    })
  );
}

function handleAuthError(): void {
  removeAuthToken();
}

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": getAcceptLanguage(),
  },
});

httpClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.headers) {
      config.headers["Accept-Language"] = getAcceptLanguage();
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error?.response?.status;
    const url = error?.config?.url;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorCode = (error?.response?.data as any)?.message;

    const isLoginEndpoint = url === "/login" || url?.endsWith("/login");
    const isLogoutEndpoint =
      url === "/token/invalidate" || url?.endsWith("/token/invalidate");

    if (status === 401 && !isLoginEndpoint && !isLogoutEndpoint) {
      if (errorCode) {
        switch (errorCode) {
          case ERROR_CODES.JWT.EXPIRED_TOKEN:
            handleLogout("expired");
            break;
          case ERROR_CODES.JWT.INVALID_TOKEN:
            handleLogout("invalid");
            break;
          case ERROR_CODES.JWT.MISSING_TOKEN:
            handleLogout("missing");
            break;
          default:
            handleAuthError();
            break;
        }
      } else {
        handleAuthError();
      }
    } else if (!error.response) {
      handleLogout("others");
    }

    return Promise.reject(error);
  }
);

export default httpClient;

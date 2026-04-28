// tests/utils/axiosHelper.ts
import { Violation } from "@/lib/utils/axiosErrorHandler";
import { AxiosError, AxiosHeaders, AxiosResponse } from "axios";

// --- helpers internes sûrs pour axios v1 ---
type HeaderInit = Record<string, string | number> | AxiosHeaders | undefined;
const buildHeaders = (h?: HeaderInit) =>
  h instanceof AxiosHeaders ? h : new AxiosHeaders(h ?? {});

// axios v1 attend InternalAxiosRequestConfig (non exporté) -> on met un stub
const RESPONSE_CONFIG_STUB = Object.freeze({
  headers: new AxiosHeaders(),
}) satisfies { headers: AxiosHeaders };

// --- builders publics ---

export const makeAxiosResponse = <T>(
  data: T,
  status = 200,
  statusText = "OK",
  headers?: HeaderInit
): AxiosResponse<T> =>
  ({
    data,
    status,
    statusText,
    headers: buildHeaders(headers),
    config: RESPONSE_CONFIG_STUB,
  }) as AxiosResponse<T>;

export const AxiosResponseOK = <T>(data: T): AxiosResponse<T> =>
  makeAxiosResponse<T>(data, 200, "OK");

/** Générique pour créer un AxiosError */
export const makeAxiosError = (
  status: number,
  statusText: string,
  data: unknown,
  message = `Request failed with status code ${status}`,
  code = "ERR_BAD_REQUEST",
  headers?: HeaderInit
): AxiosError => {
  const response = makeAxiosResponse(data, status, statusText, headers);
  return new AxiosError(message, code, RESPONSE_CONFIG_STUB, null, response);
};

/** 422 Unprocessable Entity avec violations */
export const makeValidationError422 = (violations: Violation[]): AxiosError =>
  makeAxiosError(
    422,
    "Unprocessable Entity",
    { violations },
    "Request failed with status code 422",
    "ERR_BAD_REQUEST"
  );

/** 429 Too Many Requests (rate limit) avec header Retry-After optionnel */
export const makeRateLimitError429 = (
  message = "Too many requests",
  retryAfterSeconds?: number
): AxiosError =>
  makeAxiosError(
    429,
    "Too Many Requests",
    { message },
    message,
    "ERR_BAD_REQUEST",
    retryAfterSeconds != null
      ? { "Retry-After": String(retryAfterSeconds) }
      : undefined
  );

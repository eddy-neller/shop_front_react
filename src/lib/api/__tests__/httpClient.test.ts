import { describe, expect, it, afterEach } from "vitest";
import { AxiosHeaders, type AxiosAdapter, type AxiosRequestConfig } from "axios";
import httpClient, {
  getAuthToken,
  removeAuthToken,
  setAuthToken,
} from "@/lib/api/httpClient";

const captureHeadersAdapter = (onConfig: (config: AxiosRequestConfig) => void) =>
  (async (config) => {
    onConfig(config);

    return {
      data: {},
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  }) satisfies AxiosAdapter;

describe("httpClient", () => {
  afterEach(() => {
    localStorage.clear();
  });

  it("reads the token from react-auth-kit storage", () => {
    localStorage.setItem("_auth_shop", "jwt-token");

    expect(getAuthToken()).toBe("jwt-token");
  });

  it("sends the bearer token when a user is authenticated", async () => {
    setAuthToken("jwt-token");
    let authorization: string | undefined;

    await httpClient.get("/users/me", {
      adapter: captureHeadersAdapter((config) => {
        authorization =
          config.headers instanceof AxiosHeaders
            ? config.headers.get("Authorization")?.toString()
            : config.headers?.Authorization?.toString();
      }),
    });

    expect(authorization).toBe("Bearer jwt-token");
  });

  it("removes auth-kit storage keys when clearing the token", () => {
    localStorage.setItem("_auth_shop", "jwt-token");
    localStorage.setItem("_auth_shop_type", "Bearer");
    localStorage.setItem("_auth_shop_state", JSON.stringify({ id: "1" }));

    removeAuthToken();

    expect(localStorage.getItem("_auth_shop")).toBeNull();
    expect(localStorage.getItem("_auth_shop_type")).toBeNull();
    expect(localStorage.getItem("_auth_shop_state")).toBeNull();
  });
});

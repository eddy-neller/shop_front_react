import {
  getStaticBaseUrl,
  resolveStaticUrl,
  trimTrailingSlashes,
} from "@/lib/utils/url";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("url utils", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("trims trailing slashes", () => {
    expect(trimTrailingSlashes("http://localhost:20900///")).toBe(
      "http://localhost:20900"
    );
  });

  it("uses VITE_STATIC_URL as the static base URL", () => {
    vi.stubEnv("VITE_STATIC_URL", "http://localhost:20900/");
    vi.stubEnv("VITE_API_URL", "/api");

    expect(getStaticBaseUrl()).toBe("http://localhost:20900");
  });

  it("returns no static base URL when only a relative API URL is configured", () => {
    vi.stubEnv("VITE_STATIC_URL", "");
    vi.stubEnv("VITE_API_URL", "/api");

    expect(getStaticBaseUrl()).toBe("");
  });

  it("uses the API origin as a static base URL fallback when it is absolute", () => {
    vi.stubEnv("VITE_STATIC_URL", "");
    vi.stubEnv("VITE_API_URL", "http://localhost:20900/api");

    expect(getStaticBaseUrl()).toBe("http://localhost:20900");
  });

  it("resolves relative static paths with VITE_STATIC_URL", () => {
    vi.stubEnv("VITE_STATIC_URL", "http://localhost:20900/");
    vi.stubEnv("VITE_API_URL", "/api");

    expect(resolveStaticUrl("/uploads/avatar.png")).toBe(
      "http://localhost:20900/uploads/avatar.png"
    );
  });

  it("keeps relative static paths unchanged when there is no static base URL", () => {
    vi.stubEnv("VITE_STATIC_URL", "");
    vi.stubEnv("VITE_API_URL", "/api");

    expect(resolveStaticUrl("/uploads/avatar.png")).toBe(
      "/uploads/avatar.png"
    );
  });

  it("does not rewrite absolute static URLs", () => {
    vi.stubEnv("VITE_STATIC_URL", "http://localhost:20900");

    expect(resolveStaticUrl("https://cdn.example.com/avatar.png")).toBe(
      "https://cdn.example.com/avatar.png"
    );
  });
});

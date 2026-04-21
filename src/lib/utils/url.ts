const PROTOCOL_URL_REGEX = /^[a-z][a-z\d+\-.]*:/i;

export function trimTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, "");
}

export function getStaticBaseUrl(): string {
  const configuredStaticUrl = trimTrailingSlashes(
    (import.meta.env.VITE_STATIC_URL as string | undefined)?.trim() || ""
  );

  if (configuredStaticUrl) {
    return configuredStaticUrl;
  }

  const apiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();

  if (!apiUrl || apiUrl.startsWith("/")) {
    return "";
  }

  try {
    return new URL(apiUrl).origin;
  } catch {
    return "";
  }
}

export function resolveStaticUrl(path?: string): string | undefined {
  const normalizedPath = path?.trim();

  if (!normalizedPath) {
    return undefined;
  }

  if (
    PROTOCOL_URL_REGEX.test(normalizedPath) ||
    normalizedPath.startsWith("//")
  ) {
    return normalizedPath;
  }

  const staticBaseUrl = getStaticBaseUrl();

  if (!staticBaseUrl) {
    return normalizedPath;
  }

  return `${staticBaseUrl}/${normalizedPath.replace(/^\/+/, "")}`;
}

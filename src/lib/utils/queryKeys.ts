/**
 * Clés de requête centralisées pour TanStack Query
 */

// ===== QUERY KEYS FACTORIES =====

export const userKeys = {
  all: ["user"] as const,
  me: () => [...userKeys.all, "me"] as const,
  detail: (id: string | undefined) => [...userKeys.all, "detail", id] as const,
  others: (id: string) => [...userKeys.all, "others", id] as const,
} as const;

export const shopKeys = {
  all: ["shop"] as const,
  products: (params: unknown) => [...shopKeys.all, "products", params] as const,
  product: (id: string | undefined) =>
    [...shopKeys.all, "product", id] as const,
  categories: (params: unknown) =>
    [...shopKeys.all, "categories", params] as const,
  category: (id: string | undefined) =>
    [...shopKeys.all, "category", id] as const,
} as const;

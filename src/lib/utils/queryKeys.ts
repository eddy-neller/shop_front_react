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
  addresses: (userId: string | undefined) =>
    [...shopKeys.all, "addresses", userId] as const,
  address: (userId: string | undefined, id: string | undefined) =>
    [...shopKeys.all, "address", userId, id] as const,
} as const;

export const cartKeys = {
  all: ["shop", "cart"] as const,
  mine: (userId: string | undefined) =>
    [...cartKeys.all, "mine", userId] as const,
} as const;

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

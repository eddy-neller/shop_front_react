import { vi } from "vitest";

export const signIn = vi.fn();
export const signOut = vi.fn();

vi.mock("react-auth-kit/hooks/useIsAuthenticated", () => ({
  default: vi.fn(),
}));
vi.mock("react-auth-kit/hooks/useAuthHeader", () => ({
  default: vi.fn(),
}));
vi.mock("react-auth-kit/hooks/useAuthUser", () => ({
  default: vi.fn(),
}));
vi.mock("react-auth-kit/hooks/useSignIn", () => ({
  default: () => signIn,
}));
vi.mock("react-auth-kit/hooks/useSignOut", () => ({
  default: () => signOut,
}));

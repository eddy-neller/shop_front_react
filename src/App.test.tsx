import { render, screen } from "@testing-library/react";
import { Route } from "react-router-dom";
import App from "@/App";
import { vi } from "vitest";

vi.mock("react-auth-kit/createStore", () => ({
  default: vi.fn(() => ({})),
}));
vi.mock("react-auth-kit/hooks/useIsAuthenticated", () => ({
  default: vi.fn(() => false),
}));
vi.mock("react-auth-kit/hooks/useAuthUser", () => ({
  default: vi.fn(() => null),
}));
vi.mock("react-auth-kit/hooks/useSignOut", () => ({
  default: vi.fn(() => vi.fn()),
}));
vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQueryClient: vi.fn(() => ({
      removeQueries: vi.fn(),
      invalidateQueries: vi.fn(),
      setQueryData: vi.fn(),
      getQueryData: vi.fn(),
    })),
  };
});
vi.mock("react-helmet-async", () => ({
  HelmetProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="helmet-provider">{children}</div>
  ),
  Helmet: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
}));
vi.mock("@/contexts/BreadcrumbContext", () => ({
  BreadcrumbProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="breadcrumb-provider">{children}</div>
  ),
  useBreadcrumb: vi.fn(() => ({
    breadcrumbItems: [],
    setBreadcrumbItems: vi.fn(),
  })),
  BreadcrumbContext: {
    Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Consumer: null,
    displayName: "BreadcrumbContext",
  },
}));
vi.mock("react-auth-kit", () => {
  const AuthContext = {
    Provider: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="auth-provider">{children}</div>
    ),
    Consumer: null,
  };

  return {
    default: ({ children }: { children: React.ReactNode }) => (
      <AuthContext.Provider>{children}</AuthContext.Provider>
    ),
    AuthContext,
  };
});
vi.mock("@/contexts/AbilityContext", () => ({
  AbilityProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="ability-provider">{children}</div>
  ),
  useAbility: vi.fn(() => ({
    can: vi.fn(),
    cannot: vi.fn(),
    update: vi.fn(),
    rules: [],
  })),
  Can: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  AbilityContext: {
    Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Consumer: null,
    displayName: "AbilityContext",
  },
}));
vi.mock("@/routes", () => ({
  default: (
    <Route>
      <Route path="/" element={<div data-testid="home-page">Home Page</div>} />
      <Route
        path="/about"
        element={<div data-testid="about-page">About Page</div>}
      />
    </Route>
  ),
}));

describe("App", () => {
  const setup = () => {
    render(<App />);
  };

  it("should render without crashing", () => {
    setup();

    expect(screen.getByTestId("auth-provider")).toBeInTheDocument();
    expect(screen.getByTestId("ability-provider")).toBeInTheDocument();
  });

  it("should render routes content", () => {
    setup();

    expect(screen.getByTestId("home-page")).toBeInTheDocument();
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });
});

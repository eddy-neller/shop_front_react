import { screen } from "@testing-library/react";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import UserDashboard from "@/features/User/components/UserDashboard";

vi.mock("react-auth-kit/hooks/useAuthUser", () => ({
  default: () => ({
    id: "1",
    username: "venom",
    email: "venom@example.com",
    roles: ["ROLE_ADMIN"],
  }),
}));

describe("UserDashboard", () => {
  it("renders the dashboard for an authenticated user", () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });

    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <UserDashboard />
        </QueryClientProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/administrateur/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /voir le profil/i })).toHaveAttribute("href", "/user/profile");
  });
});

import { screen, render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import UserHomePage from "@/features/User/pages/UserHomePage";

vi.mock("react-auth-kit/hooks/useAuthUser", () => ({
  default: () => ({
    id: "1",
    username: "venom",
    email: "venom@example.com",
    roles: ["ROLE_USER"],
  }),
}));

describe("UserHomePage", () => {
  it("renders the user dashboard", () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });

    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <UserHomePage />
        </QueryClientProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/venom/i)).toBeInTheDocument();
  });
});

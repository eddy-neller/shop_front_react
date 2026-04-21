import "@/utils/tests/mocks/mockRouterHelper";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserNav from "@/features/User/components/UserNav";
import { renderComponentQuery } from "@/utils/tests/renderComponent";

const logoutSpy = vi.fn();

vi.mock("react-auth-kit/hooks/useAuthUser", () => ({
  default: () => ({
    id: "1",
    username: "anna",
    email: "anna@example.com",
    roles: ["ROLE_USER"],
  }),
}));

vi.mock("@/features/Auth/hooks/useLogout", () => ({
  useLogout: () => ({ logout: logoutSpy }),
}));

describe("UserNav", () => {
  it("opens the user menu", async () => {
    renderComponentQuery(<UserNav />);

    await userEvent.click(screen.getByRole("button", { name: /anna/i }));

    expect(screen.getByRole("link", { name: /tableau de bord/i })).toHaveAttribute("href", "/user");
    expect(screen.getByRole("button", { name: /déconnexion/i })).toBeInTheDocument();
  });

  it("calls logout from the menu", async () => {
    renderComponentQuery(<UserNav />);

    await userEvent.click(screen.getByRole("button", { name: /anna/i }));
    await userEvent.click(screen.getByRole("button", { name: /déconnexion/i }));

    expect(logoutSpy).toHaveBeenCalled();
  });
});

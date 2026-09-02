import "@/lib/utils/tests/mocks/mockRouterHelper";
import "@/lib/utils/tests/mocks/mockAuthHelper";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthUser } from "@/features/User/types/user";
import UserNav from "@/features/User/components/UserNav";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { renderComponentQuery } from "@/lib/utils/tests/renderComponent";
import { Mock, vi } from "vitest";

const logoutSpy = vi.fn();
const mockAuthUser = useAuthUser as Mock;

vi.mock("@/features/Auth/hooks/useLogout", () => ({
  useLogout: () => ({ logout: logoutSpy }),
}));

describe("UserNav", () => {
  const setup = () => {
    renderComponentQuery(<UserNav />);
  };

  it("renders nothing when user is not authenticated", () => {
    mockAuthUser.mockReturnValue(null);

    const { container } = renderComponentQuery(<UserNav />);

    expect(container).toBeEmptyDOMElement();
  });

  describe("when user is authenticated", () => {
    const authUser: AuthUser = {
      id: "1",
      roles: ["user"],
    };

    beforeEach(() => {
      mockAuthUser.mockReturnValue(authUser);
    });

    it("renders user dropdown trigger", () => {
      setup();

      expect(
        screen.getByRole("button", { name: /user menu/i })
      ).toBeInTheDocument();
    });

    it("shows user dropdown menu when clicked", async () => {
      setup();

      const userDropdown = screen.getByRole("button", {
        name: /user menu/i,
      });
      await userEvent.click(userDropdown);

      await waitFor(() => {
        expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/profile/i)).toBeInTheDocument();
        expect(screen.getByText(/addresses/i)).toBeInTheDocument();
        expect(screen.getByText(/avatar/i)).toBeInTheDocument();
        expect(screen.getByText(/password/i)).toBeInTheDocument();
        expect(screen.getByText(/logout/i)).toBeInTheDocument();
      });
    });

    it.each([
      [/dashboard/i],
      [/profile/i],
      [/addresses/i],
      [/avatar/i],
      [/password/i],
    ])(
      "closes user dropdown menu when clicking %s link",
      async (linkName) => {
        setup();

        const userDropdown = screen.getByRole("button", {
          name: /user menu/i,
        });
        await userEvent.click(userDropdown);

        expect(userDropdown).toHaveAttribute("aria-expanded", "true");

        await userEvent.click(screen.getByRole("link", { name: linkName }));

        await waitFor(() => {
          expect(userDropdown).toHaveAttribute("aria-expanded", "false");
        });
      }
    );

    it("has proper ARIA attributes for user dropdowns", () => {
      setup();

      const userDropdown = screen.getByRole("button", {
        name: /user menu/i,
      });
      expect(userDropdown).toHaveAttribute("aria-haspopup", "menu");
      expect(userDropdown).toHaveAttribute("aria-expanded", "false");
    });

    it("calls logout from the menu", async () => {
      setup();

      await userEvent.click(
        screen.getByRole("button", { name: /user menu/i })
      );
      await userEvent.click(screen.getByRole("button", { name: /logout/i }));

      expect(logoutSpy).toHaveBeenCalled();
    });
  });
});

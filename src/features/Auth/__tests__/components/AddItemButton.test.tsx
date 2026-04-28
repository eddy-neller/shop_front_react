import "@/lib/utils/tests/mocks/mockAuthHelper";
import "@/lib/utils/tests/mocks/mockRouterHelper";
import { screen } from "@testing-library/react";
import AddItemButton from "@/features/Auth/components/AddItemButton";
import { SubjectType } from "@/lib/utils/ability";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { renderComponentAbility } from "@/lib/utils/tests/renderComponent";
import { UserType } from "@/lib/utils/tests/userTypes";
import { Mock } from "vitest";

const mockUseIsAuthenticated = useIsAuthenticated as Mock;

describe("AddItemButton", () => {
  const setup = ({
    typeUser,
    isAuthenticated,
    permission,
    to = "/add-item",
    buttonText = "Add item",
    message = "to add an item.",
  }: {
    typeUser?: UserType;
    isAuthenticated: boolean;
    permission: SubjectType;
    to?: string;
    buttonText?: string;
    message?: string;
  }) => {
    mockUseIsAuthenticated.mockReturnValue(isAuthenticated);

    renderComponentAbility(
      <AddItemButton
        permission={permission}
        to={to}
        buttonText={buttonText}
        message={message}
      />,
      typeUser
    );
  };

  describe("Unauthenticated user", () => {
    it("should show the login paragraph", () => {
      setup({ isAuthenticated: false, permission: SubjectType.ADMIN_CONTENT });

      expect(screen.getByText(/you must be/i)).toBeInTheDocument();
    });

    it("should show a 'logged in' link pointing to /login", () => {
      setup({ isAuthenticated: false, permission: SubjectType.ADMIN_CONTENT });

      const loginLink = screen.getByRole("link", { name: /logged in/i });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute("href", "/login");
    });

    it("should show the message prop in the paragraph", () => {
      setup({
        isAuthenticated: false,
        permission: SubjectType.ADMIN_CONTENT,
        message: "to manage this content.",
      });

      expect(screen.getByText(/to manage this content\./i)).toBeInTheDocument();
    });

    it("should NOT show the add item button", () => {
      setup({
        isAuthenticated: false,
        permission: SubjectType.ADMIN_CONTENT,
        to: "/admin/add",
      });

      expect(
        screen.queryByRole("link", { name: /add item/i })
      ).not.toBeInTheDocument();
    });
  });

  describe("Authenticated admin with ADMIN_CONTENT permission", () => {
    it("should show the add button link with correct href", () => {
      setup({
        isAuthenticated: true,
        typeUser: "UserAdmin",
        permission: SubjectType.ADMIN_CONTENT,
        to: "/admin/add",
        buttonText: "Add admin item",
      });

      const button = screen.getByRole("link", { name: /add admin item/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("href", "/admin/add");
    });

    it("should NOT show the login paragraph", () => {
      setup({
        isAuthenticated: true,
        typeUser: "UserAdmin",
        permission: SubjectType.ADMIN_CONTENT,
      });

      expect(screen.queryByText(/you must be/i)).not.toBeInTheDocument();
      expect(
        screen.queryByRole("link", { name: /logged in/i })
      ).not.toBeInTheDocument();
    });

    it("should also show button for MODERATOR_CONTENT (role inheritance)", () => {
      setup({
        isAuthenticated: true,
        typeUser: "UserAdmin",
        permission: SubjectType.MODERATOR_CONTENT,
        buttonText: "Add moderator item",
      });

      expect(
        screen.getByRole("link", { name: /add moderator item/i })
      ).toBeInTheDocument();
    });

    it("should also show button for MEMBER_CONTENT (role inheritance)", () => {
      setup({
        isAuthenticated: true,
        typeUser: "UserAdmin",
        permission: SubjectType.MEMBER_CONTENT,
        buttonText: "Add member item",
      });

      expect(
        screen.getByRole("link", { name: /add member item/i })
      ).toBeInTheDocument();
    });
  });

  describe("Authenticated moderator", () => {
    it("should show the add button for MODERATOR_CONTENT", () => {
      setup({
        isAuthenticated: true,
        typeUser: "UserModer",
        permission: SubjectType.MODERATOR_CONTENT,
        to: "/moder/add",
        buttonText: "Add moderator item",
      });

      const button = screen.getByRole("link", { name: /add moderator item/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("href", "/moder/add");
    });

    it("should show the add button for MEMBER_CONTENT (role inheritance)", () => {
      setup({
        isAuthenticated: true,
        typeUser: "UserModer",
        permission: SubjectType.MEMBER_CONTENT,
        buttonText: "Add member item",
      });

      expect(
        screen.getByRole("link", { name: /add member item/i })
      ).toBeInTheDocument();
    });

    it("should NOT show the button for ADMIN_CONTENT", () => {
      setup({
        isAuthenticated: true,
        typeUser: "UserModer",
        permission: SubjectType.ADMIN_CONTENT,
        buttonText: "Add admin item",
      });

      expect(
        screen.queryByRole("link", { name: /add admin item/i })
      ).not.toBeInTheDocument();
    });

    it("should NOT show the login paragraph when authenticated without permission", () => {
      setup({
        isAuthenticated: true,
        typeUser: "UserModer",
        permission: SubjectType.ADMIN_CONTENT,
      });

      expect(screen.queryByText(/you must be/i)).not.toBeInTheDocument();
    });
  });

  describe("Authenticated member", () => {
    it("should show the add button for MEMBER_CONTENT", () => {
      setup({
        isAuthenticated: true,
        typeUser: "UserMember",
        permission: SubjectType.MEMBER_CONTENT,
        to: "/member/add",
        buttonText: "Add member item",
      });

      const button = screen.getByRole("link", { name: /add member item/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("href", "/member/add");
    });

    it("should NOT show the button for ADMIN_CONTENT", () => {
      setup({
        isAuthenticated: true,
        typeUser: "UserMember",
        permission: SubjectType.ADMIN_CONTENT,
        buttonText: "Add admin item",
      });

      expect(
        screen.queryByRole("link", { name: /add admin item/i })
      ).not.toBeInTheDocument();
    });

    it("should NOT show the button for MODERATOR_CONTENT", () => {
      setup({
        isAuthenticated: true,
        typeUser: "UserMember",
        permission: SubjectType.MODERATOR_CONTENT,
        buttonText: "Add moderator item",
      });

      expect(
        screen.queryByRole("link", { name: /add moderator item/i })
      ).not.toBeInTheDocument();
    });
  });
});

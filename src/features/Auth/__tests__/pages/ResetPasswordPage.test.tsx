import { screen, waitFor, within } from "@testing-library/react";
import { renderPage } from "@/lib/utils/tests/renderPage";
import { checkPasswordResetToken } from "@/features/Auth/lib/api/auth";
import { vi, type Mock } from "vitest";

vi.mock("@/features/Auth/lib/api/auth", () => ({
  checkPasswordResetToken: vi.fn(),
}));

const mockCheckPasswordResetToken = checkPasswordResetToken as Mock;

describe("ResetPasswordPage", () => {
  const setup = (token = "valid-token-123") => {
    const params = new URLSearchParams();
    if (token) params.set("token", token);
    const queryString = params.toString();
    renderPage(`/forgot-password/reset${queryString ? `?${queryString}` : ""}`);
  };

  it("should render the page title in the Helmet for valid token", async () => {
    mockCheckPasswordResetToken.mockResolvedValue(undefined);

    setup();

    await waitFor(() => {
      expect(document.title).toBe("E.N Shop - Reset password");
    });
  });

  it("should set the breadcrumb correctly", async () => {
    mockCheckPasswordResetToken.mockImplementation(() => new Promise(() => {}));

    setup();

    const breadcrumbNav = await screen.findByRole("navigation", {
      name: /breadcrumb/i,
    });
    expect(breadcrumbNav).toBeInTheDocument();

    const breadcrumbList = within(breadcrumbNav).getByRole("list");
    expect(breadcrumbList).toBeInTheDocument();

    expect(within(breadcrumbList).getAllByRole("listitem")).toHaveLength(3);

    const forgotPasswordLink = within(breadcrumbList).getByRole("link", {
      name: "Forgot password",
    });
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink).toHaveAttribute("href", "/forgot-password");

    const activeItem = within(breadcrumbList).getByRole("link", {
      name: "Reset password",
    });
    expect(activeItem).toBeInTheDocument();
    expect(activeItem).toHaveAttribute("aria-current", "page");
  });

  it("should show loading state while verifying token", async () => {
    mockCheckPasswordResetToken.mockImplementation(() => new Promise(() => {}));

    setup();

    await waitFor(() => {
      expect(document.title).toBe("E.N Shop - Verifying Reset Link");
      expect(
        screen.getByText(/verifying your reset link/i)
      ).toBeInTheDocument();
    });
  });

  it("should handle missing token gracefully", () => {
    setup("");

    expect(
      screen.getByText(/this password reset link is invalid or has expired/i)
    ).toBeInTheDocument();
  });

  it("should show error state for invalid token", async () => {
    mockCheckPasswordResetToken.mockRejectedValue(new Error("Invalid token"));

    setup();

    await waitFor(() => {
      expect(document.title).toBe("E.N Shop - Invalid Reset Link");
      expect(
        screen.getByText(/invalid or expired link/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/this password reset link is invalid or has expired/i)
      ).toBeInTheDocument();
    });
  });

  it("should render the request new link button for invalid token", async () => {
    mockCheckPasswordResetToken.mockRejectedValue(new Error("Invalid token"));

    setup();

    await waitFor(() => {
      const requestLink = screen.getByRole("link", {
        name: /request a new link/i,
      });
      expect(requestLink).toBeInTheDocument();
      expect(requestLink).toHaveAttribute("href", "/forgot-password");
    });
  });

  it("should call checkPasswordResetToken with the correct token", async () => {
    mockCheckPasswordResetToken.mockResolvedValue(undefined);

    const token = "test-token-456";
    setup(token);

    await waitFor(() => {
      expect(mockCheckPasswordResetToken).toHaveBeenCalledWith({ token });
    });
  });

  it("should show reset form heading for valid token", async () => {
    mockCheckPasswordResetToken.mockResolvedValue(undefined);

    setup();

    await waitFor(() => {
      expect(document.title).toBe("E.N Shop - Reset password");
      expect(
        screen.getByRole("heading", { name: "Set your new password" })
      ).toBeInTheDocument();
    });
  });

  it("should render the password reset form for valid token", async () => {
    mockCheckPasswordResetToken.mockResolvedValue(undefined);

    setup();

    await waitFor(() => {
      expect(
        screen.getByPlaceholderText(/choose a new password/i)
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/confirm your new password/i)
      ).toBeInTheDocument();
    });
  });

  it("should render the security note for valid token", async () => {
    mockCheckPasswordResetToken.mockResolvedValue(undefined);

    setup();

    await waitFor(() => {
      expect(screen.getByText(/security note:/i)).toBeInTheDocument();
      expect(
        screen.getByText(/this link will expire after use/i)
      ).toBeInTheDocument();
    });
  });

  it("should render the password requirements section for valid token", async () => {
    mockCheckPasswordResetToken.mockResolvedValue(undefined);

    setup();

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Password Requirements" })
      ).toBeInTheDocument();
      expect(screen.getByText("8-30 characters long")).toBeInTheDocument();
      expect(
        screen.getByText("At least 1 uppercase letter")
      ).toBeInTheDocument();
      expect(screen.getByText("At least 1 number")).toBeInTheDocument();
      expect(
        screen.getByText("At least 1 special character: ()!@#$%^&*_-")
      ).toBeInTheDocument();
    });
  });

  it("should render the security tip for valid token", async () => {
    mockCheckPasswordResetToken.mockResolvedValue(undefined);

    setup();

    await waitFor(() => {
      expect(screen.getByText(/tip:/i)).toBeInTheDocument();
      expect(
        screen.getByText(/use a unique password that you don't use elsewhere/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          /consider using a password manager for better security/i
        )
      ).toBeInTheDocument();
    });
  });
});

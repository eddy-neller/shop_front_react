import { screen, waitFor, within } from "@testing-library/react";
import { renderPage } from "@/lib/utils/tests/renderPage";
import { validateActivation } from "@/features/Auth/lib/api/auth";
import { vi, type Mock } from "vitest";

vi.mock("@/features/Auth/lib/api/auth", () => ({
  validateActivation: vi.fn(),
}));

const mockValidateActivation = validateActivation as Mock;

describe("RegisterValidationPage", () => {
  const setup = (token = "valid-token-123") => {
    const params = new URLSearchParams();
    if (token) params.set("token", token);
    const queryString = params.toString();
    renderPage(`/register/validation${queryString ? `?${queryString}` : ""}`);
  };

  it("should render the page title in the Helmet after successful validation", async () => {
    mockValidateActivation.mockResolvedValue(undefined);

    setup();

    await waitFor(() => {
      expect(document.title).toBe("E.N Shop - Activation success");
    });
  });

  it("should set the breadcrumb correctly", async () => {
    mockValidateActivation.mockImplementation(() => new Promise(() => {}));

    setup();

    const breadcrumbNav = await screen.findByRole("navigation", {
      name: /breadcrumb/i,
    });
    expect(breadcrumbNav).toBeInTheDocument();

    const breadcrumbList = within(breadcrumbNav).getByRole("list");
    expect(breadcrumbList).toBeInTheDocument();

    expect(within(breadcrumbList).getAllByRole("listitem")).toHaveLength(3);

    const registerLink = within(breadcrumbList).getByRole("link", {
      name: "Register",
    });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute("href", "/register");

    const activeItem = within(breadcrumbList).getByRole("link", {
      name: "Validate account",
    });
    expect(activeItem).toBeInTheDocument();
    expect(activeItem).toHaveAttribute("aria-current", "page");
  });

  it("should show loading state while validating", () => {
    mockValidateActivation.mockImplementation(() => new Promise(() => {}));

    setup();

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(
      screen.getByText("Validating your activation link…")
    ).toBeInTheDocument();
  });

  it("should handle missing token gracefully", () => {
    setup("");

    expect(
      screen.getByText(/this activation link is invalid or has expired/i)
    ).toBeInTheDocument();
  });

  it("should show error state when validation fails", async () => {
    mockValidateActivation.mockRejectedValue(new Error("Invalid token"));

    setup();

    await waitFor(() => {
      expect(screen.getByText("Activation failed")).toBeInTheDocument();
      expect(
        screen.getByText(/this activation link is invalid or has expired/i)
      ).toBeInTheDocument();
    });
  });

  it("should render resend activation form when validation fails", async () => {
    mockValidateActivation.mockRejectedValue(new Error("Invalid token"));

    setup();

    await waitFor(() => {
      expect(screen.getByText("Resend activation link")).toBeInTheDocument();
    });
  });

  it("should render contact support section when validation fails", async () => {
    mockValidateActivation.mockRejectedValue(new Error("Invalid token"));

    setup();

    await waitFor(() => {
      expect(screen.getByText("Contact us")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Stuck? Our team can manually activate your account or help troubleshoot."
        )
      ).toBeInTheDocument();
    });
  });

  it("should render email support link with correct href", async () => {
    mockValidateActivation.mockRejectedValue(new Error("Invalid token"));

    setup();

    await waitFor(() => {
      expect(
        screen.getByRole("link", { name: /email support/i })
      ).toHaveAttribute("href", "/contact");
    });
  });

  it("should call validateActivation with the token from URL params", async () => {
    mockValidateActivation.mockResolvedValue(undefined);
    const token = "test-token-456";

    setup(token);

    await waitFor(() => {
      expect(mockValidateActivation).toHaveBeenCalledWith({ token });
    });
  });
});

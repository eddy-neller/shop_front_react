import { screen, waitFor, within } from "@testing-library/react";
import { renderPage } from "@/lib/utils/tests/renderPage";

describe("ForgotPasswordPage", () => {
  const setup = () => {
    renderPage("/forgot-password");
  };

  it("should render the page title in the Helmet", async () => {
    setup();

    await waitFor(() => {
      expect(document.title).toBe("E.N Shop - Forgot password");
    });
  });

  it("should set the breadcrumb correctly", async () => {
    setup();

    const breadcrumbNav = screen.getByRole("navigation", {
      name: /breadcrumb/i,
    });
    expect(breadcrumbNav).toBeInTheDocument();

    const breadcrumbList = within(breadcrumbNav).getByRole("list");
    expect(breadcrumbList).toBeInTheDocument();

    expect(within(breadcrumbList).getAllByRole("listitem")).toHaveLength(2);

    const activeItem = await within(breadcrumbList).findByRole("link", {
      name: "Forgot password",
    });
    expect(activeItem).toBeInTheDocument();
    expect(activeItem).toHaveAttribute("aria-current", "page");
  });

  it("should render the main heading and description", () => {
    setup();

    expect(
      screen.getByRole("heading", { name: "Forgot your password?" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/no worries! we'll send you reset instructions/i)
    ).toBeInTheDocument();
  });

  it("should render the password reset form", () => {
    setup();

    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send reset instructions/i })
    ).toBeInTheDocument();
  });

  it("should render the back to sign in link", () => {
    setup();

    expect(
      screen.getByRole("link", { name: /back to sign in/i })
    ).toHaveAttribute("href", "/login");
  });

  it("should render trust indicators", () => {
    setup();

    expect(screen.getByText("Secure by default")).toBeInTheDocument();
    expect(screen.getByText("No spam • Cancel anytime")).toBeInTheDocument();
  });

  it("should render the benefits section", () => {
    setup();

    expect(
      screen.getByRole("heading", { name: "Why reset your password?" })
    ).toBeInTheDocument();
    expect(screen.getByText("Security first")).toBeInTheDocument();
    expect(screen.getByText("Quick recovery")).toBeInTheDocument();
    expect(screen.getByText("Team access")).toBeInTheDocument();
    expect(screen.getByText("Peace of mind")).toBeInTheDocument();
  });

  it("should render reset success rate information", () => {
    setup();

    expect(screen.getByText("Reset success rate")).toBeInTheDocument();
    expect(screen.getByText("99.9%")).toBeInTheDocument();
    expect(
      screen.getByText("Instant delivery • Secure tokens")
    ).toBeInTheDocument();
  });
});

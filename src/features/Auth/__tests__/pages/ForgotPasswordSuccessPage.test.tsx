import { screen, waitFor, within } from "@testing-library/react";
import { renderPage } from "@/lib/utils/tests/renderPage";

describe("ForgotPasswordSuccessPage", () => {
  const defaultState = {
    email: "test@example.com",
  };

  const setup = (state: unknown = defaultState) => {
    renderPage("/forgot-password/success", undefined, undefined, state);
  };

  it("should render the page title in the Helmet", async () => {
    setup();

    await waitFor(() => {
      expect(document.title).toBe("E.N Shop - Reset Email Sent");
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

    const breadcrumbItems = within(breadcrumbList).getAllByRole("listitem");
    expect(breadcrumbItems).toHaveLength(3);

    const forgotPasswordLink = await within(breadcrumbList).findByRole("link", {
      name: "Forgot password",
    });
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(forgotPasswordLink).toHaveAttribute("href", "/forgot-password");

    const activeItem = within(breadcrumbList).getByRole("link", {
      name: "Success",
    });
    expect(activeItem).toBeInTheDocument();
    expect(activeItem).toHaveAttribute("aria-current", "page");
  });

  it("should render the hero heading and email", async () => {
    setup();

    expect(
      await screen.findByRole("heading", { name: /reset email sent/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/we've sent password reset instructions to/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/test@example\.com/i)).toBeInTheDocument();
  });

  it("should render the success message", () => {
    setup();

    expect(
      screen.getByRole("heading", { name: "Check your email" })
    ).toBeInTheDocument();
  });

  it("should render the reset instructions", () => {
    setup();

    expect(screen.getByText(/reset instructions sent!/i)).toBeInTheDocument();
    expect(
      screen.getByText(/please check your inbox and follow the link/i)
    ).toBeInTheDocument();
  });

  it("should render the expiration information", () => {
    setup();

    expect(
      screen.getByText(/link expires in 15 minutes/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/for security reasons/i)).toBeInTheDocument();
  });

  it("should render the spam folder note with request link", () => {
    setup();

    expect(
      screen.getByText(/didn't receive the email\? check your spam folder/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /request a new link/i })
    ).toHaveAttribute("href", "/forgot-password");
  });

  it("should render the action links correctly", () => {
    setup();

    expect(
      screen.getByRole("link", { name: /back to sign in/i })
    ).toHaveAttribute("href", "/login");

    expect(
      screen.getByRole("link", { name: /send again/i })
    ).toHaveAttribute("href", "/forgot-password");
  });

  it("should render trust indicators", () => {
    setup();

    expect(screen.getByText("Secure by default")).toBeInTheDocument();
    expect(screen.getByText("No spam • Cancel anytime")).toBeInTheDocument();
  });

  it("should render the next steps section", async () => {
    setup();

    expect(
      await screen.findByRole("heading", { name: "What happens next?" })
    ).toBeInTheDocument();
    expect(screen.getByText("Check your inbox")).toBeInTheDocument();
    expect(screen.getByText("Click the reset link")).toBeInTheDocument();
    expect(screen.getByText("Set new password")).toBeInTheDocument();
    expect(screen.getByText("Sign in again")).toBeInTheDocument();
  });

  it("should render security information", () => {
    setup();

    expect(screen.getByText("Security level")).toBeInTheDocument();
    expect(screen.getByText("High")).toBeInTheDocument();
    expect(
      screen.getByText("Encrypted tokens • Rate limited • 15m expiry")
    ).toBeInTheDocument();
  });

  it("should redirect to forgot-password if no state is provided", async () => {
    setup(null);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Forgot your password?" })
      ).toBeInTheDocument();
    });
  });
});

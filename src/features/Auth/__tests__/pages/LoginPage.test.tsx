import { screen, waitFor, within } from "@testing-library/react";
import { renderPage } from "@/lib/utils/tests/renderPage";

describe("LoginPage", () => {
  const setup = () => {
    renderPage("/login");
  };

  it("should render the page title in the Helmet", async () => {
    setup();

    await waitFor(() => {
      expect(document.title).toBe("E.N Shop - Sign in");
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
      name: "Sign in",
    });
    expect(activeItem).toBeInTheDocument();
    expect(activeItem).toHaveAttribute("aria-current", "page");
  });

  it("should render the main heading and description", () => {
    setup();

    expect(
      screen.getByRole("heading", { name: "Welcome back" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/sign in to continue/i)
    ).toBeInTheDocument();
  });

  it("should render SSO buttons", () => {
    setup();

    const googleButton = screen.getByRole("button", {
      name: /continue with google/i,
    });
    expect(googleButton).toHaveAttribute("type", "button");

    const facebookButton = screen.getByRole("button", {
      name: /continue with facebook/i,
    });
    expect(facebookButton).toHaveAttribute("type", "button");

    const appleButton = screen.getByRole("button", {
      name: /continue with apple/i,
    });
    expect(appleButton).toHaveAttribute("type", "button");
  });

  it("should render the separator with 'or' text", () => {
    setup();

    expect(screen.getByText("or")).toBeInTheDocument();
  });

  it("should render the login form", () => {
    setup();

    expect(
      screen.getByPlaceholderText(/name@example.com/i)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your password/i)).toBeInTheDocument();
  });

  it("should render the forgot password link", () => {
    setup();

    expect(
      screen.getByRole("link", { name: /forgot password\?/i })
    ).toHaveAttribute("href", "/forgot-password");
  });

  it("should render the register link", () => {
    setup();

    expect(
      screen.getByRole("link", { name: /create an account/i })
    ).toHaveAttribute("href", "/register");
  });

  it("should render trust indicators", () => {
    setup();

    expect(screen.getByText("Secure by default")).toBeInTheDocument();
    expect(screen.getByText("No spam • Cancel anytime")).toBeInTheDocument();
  });

  it("should render the benefits section", () => {
    setup();

    expect(
      screen.getByRole("heading", { name: "Why sign in?" })
    ).toBeInTheDocument();
    expect(screen.getByText("Faster workflow")).toBeInTheDocument();
    expect(screen.getByText("Security first")).toBeInTheDocument();
    expect(screen.getByText("Built for teams")).toBeInTheDocument();
    expect(screen.getByText("Delightful UX")).toBeInTheDocument();
  });

  it("should render uptime information", () => {
    setup();

    expect(screen.getByText("Uptime last 30d")).toBeInTheDocument();
    expect(screen.getByText("99.98%")).toBeInTheDocument();
    expect(screen.getByText("SOC2-ready • GDPR-friendly")).toBeInTheDocument();
  });
});

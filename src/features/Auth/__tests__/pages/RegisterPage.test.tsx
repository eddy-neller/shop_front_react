import { screen, waitFor, within } from "@testing-library/react";
import { renderPage } from "@/lib/utils/tests/renderPage";

describe("RegisterPage", () => {
  const setup = () => {
    renderPage("/register");
  };

  it("should render the page title in the Helmet", async () => {
    setup();

    await waitFor(() => {
      expect(document.title).toBe("E.N Shop - Create account");
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
      name: "Register",
    });
    expect(activeItem).toBeInTheDocument();
    expect(activeItem).toHaveAttribute("aria-current", "page");
  });

  it("should render the main heading and description", () => {
    setup();

    expect(
      screen.getByRole("heading", { name: "Create your account" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        (_content, element) =>
          element?.textContent?.replace(/\s+/g, " ").trim() ===
          "Join E.N Shop today."
      )
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

  it("should render the register form", () => {
    setup();

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/name@example.com/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/choose a username/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/choose a password/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/^confirm password$/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/confirm your password/i)
    ).toBeInTheDocument();
  });

  it("should render the sign in link", () => {
    setup();

    expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute(
      "href",
      "/login"
    );
  });

  it("should render trust indicators", () => {
    setup();

    expect(screen.getByText("Secure by default")).toBeInTheDocument();
    expect(screen.getByText("No spam • Cancel anytime")).toBeInTheDocument();
  });

  it("should render the benefits section", () => {
    setup();

    expect(
      screen.getByRole("heading", { name: "Why join?" })
    ).toBeInTheDocument();
    expect(screen.getByText("Faster onboarding")).toBeInTheDocument();
    expect(screen.getByText("Built-in best practices")).toBeInTheDocument();
    expect(screen.getByText("Security first")).toBeInTheDocument();
  });

  it("should render uptime information", () => {
    setup();

    expect(screen.getByText("Uptime last 30d")).toBeInTheDocument();
    expect(screen.getByText("99.98%")).toBeInTheDocument();
    expect(screen.getByText("SOC2-ready • GDPR-friendly")).toBeInTheDocument();
  });
});

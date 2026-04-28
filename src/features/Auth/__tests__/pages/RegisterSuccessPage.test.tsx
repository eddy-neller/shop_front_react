import { screen, waitFor, within } from "@testing-library/react";
import { renderPage } from "@/lib/utils/tests/renderPage";

describe("RegisterSuccessPage", () => {
  const defaultState = { email: "test@example.com" };

  const setup = (state: unknown = defaultState) => {
    renderPage("/register/success", undefined, undefined, state);
  };

  it("should render the page title in the Helmet", async () => {
    setup();

    await waitFor(() => {
      expect(document.title).toBe("E.N Shop - Account created");
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

    const registerLink = await within(breadcrumbList).findByRole("link", {
      name: "Register",
    });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute("href", "/register");

    const activeItem = within(breadcrumbList).getByRole("link", {
      name: "Success",
    });
    expect(activeItem).toBeInTheDocument();
    expect(activeItem).toHaveAttribute("aria-current", "page");
  });

  it("should render the success message", async () => {
    setup();

    expect(
      await screen.findByRole("heading", { name: "Account created" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/sent you an activation link/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/test@example\.com/i)).toBeInTheDocument();
  });

  it("should render the activation instructions", () => {
    setup();

    expect(screen.getByText("Open the email")).toBeInTheDocument();
    expect(
      screen.getByText(/and click the link to validate your address/i)
    ).toBeInTheDocument();
  });

  it("should render the expiration information", () => {
    setup();

    expect(
      screen.getByText(/the activation link is valid for/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/48 hours/i)).toBeInTheDocument();
  });

  it("should render the activation alert", () => {
    setup();

    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(
      "Please activate your account before signing in."
    );
  });

  it("should render the sign in action link", () => {
    setup();

    expect(
      screen.getByRole("link", { name: /go to sign in/i })
    ).toHaveAttribute("href", "/login");
  });

  it("should redirect to register if no state is provided", async () => {
    setup(null);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /create.*account/i })
      ).toBeInTheDocument();
    });
  });
});
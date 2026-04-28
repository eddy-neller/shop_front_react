import { screen, waitFor, within } from "@testing-library/react";
import { renderPage } from "@/lib/utils/tests/renderPage";

describe("RegisterValidationSuccessPage", () => {
  const defaultState = {};

  const setup = (state: object | null = defaultState) => {
    return renderPage(
      "/register/validation/success",
      undefined,
      undefined,
      state ?? undefined
    );
  };

  it("should render the page title in the Helmet", async () => {
    setup();

    await waitFor(() => {
      expect(document.title).toBe("E.N Shop - Activation success");
    });
  });

  it("should set the breadcrumb correctly", async () => {
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
      name: "Activation success",
    });
    expect(activeItem).toBeInTheDocument();
    expect(activeItem).toHaveAttribute("aria-current", "page");
  });

  it("should render the success heading and subtitle", async () => {
    setup();

    expect(
      await screen.findByRole("heading", {
        name: /account activated successfully/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/your account has been activated/i)
    ).toBeInTheDocument();
  });

  it("should render the sign in link", async () => {
    setup();

    const signInLink = await screen.findByRole("link", {
      name: /^sign in$/i,
    });
    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute("href", "/login");
  });

  it("should render the next steps cards", async () => {
    setup();

    expect(await screen.findByText("Explore dashboard")).toBeInTheDocument();
    expect(screen.getByText("Complete your profile")).toBeInTheDocument();
    expect(screen.getByText("Secure your account")).toBeInTheDocument();
  });

  it("should redirect to register if no state provided", async () => {
    setup(null);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /create your account/i })
      ).toBeInTheDocument();
    });
  });
});

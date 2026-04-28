import { screen, waitFor, within } from "@testing-library/react";
import { renderPage } from "@/lib/utils/tests/renderPage";
import rawUser from "@/features/User/__tests__/fixtures/user-admin.json";
import { User } from "@/features/User/types/user";
import { useMe } from "@/features/User/hooks/useUser";
import { expectSpinnerWhileLoading } from "@/lib/utils/tests/base-tests";
import { Mock } from "vitest";

vi.mock("@/features/User/hooks/useUser", () => ({
  useMe: vi.fn(),
}));

const mockUseMe = useMe as Mock;

describe("UserProfilePage", () => {
  const user: User = rawUser;

  beforeEach(() => {
    mockUseMe.mockReturnValue({
      data: user,
      isLoading: false,
      isError: false,
    });
  });

  const setup = () => {
    renderPage("/user/profile");
  };

  it("should render the page title in the Helmet", async () => {
    setup();

    await waitFor(() => {
      expect(document.title).toBe("E.N Shop - User Profile");
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

    expect(within(breadcrumbList).getAllByRole("listitem")).toHaveLength(3);

    const activeItem = await within(breadcrumbList).findByRole("link", {
      name: "My Profile",
    });
    expect(activeItem).toBeInTheDocument();
    expect(activeItem).toHaveAttribute("aria-current", "page");
  });

  it("should render the loading spinner while user is loading", async () => {
    mockUseMe.mockReturnValue({
      data: null,
      isPending: true,
      isError: false,
    });

    setup();

    await waitFor(() => {
      expectSpinnerWhileLoading();
    });
  });

  it("displays an error message if data fetching fails", async () => {
    mockUseMe.mockReturnValue({
      data: null,
      isPending: false,
      isError: true,
    });

    setup();

    await waitFor(() => {
      expect(
        screen.getByText(/unable to load your profile information/i)
      ).toBeInTheDocument();
    });
  });

  it("renders the private profile card", () => {
    setup();

    expect(screen.getByText("venom")).toBeInTheDocument();
    expect(screen.getByText(/venom@en-develop.fr/i)).toBeInTheDocument();
    expect(screen.getByText(/sign-ins/i)).toBeInTheDocument();
  });
});

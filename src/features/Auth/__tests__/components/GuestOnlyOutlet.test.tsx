import "@/lib/utils/tests/mocks/mockAuthHelper";
import { screen } from "@testing-library/react";
import { renderComponentQuery } from "@/lib/utils/tests/renderComponent";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import GuestOnlyOutlet from "@/features/Auth/components/GuestOnlyOutlet";
import { Mock, vi } from "vitest";

// Mock Navigate et Outlet avant tout import de react-router-dom
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom"
    );
  return {
    ...actual,
    Outlet: () => <div>Guest Content</div>,
    Navigate: ({ to }: { to: string }) => <div>Redirecting to {to}</div>,
  };
});

const mockUseIsAuthenticated = useIsAuthenticated as Mock;

describe("GuestOnlyOutlet component", () => {
  describe("when user is not authenticated", () => {
    beforeEach(() => {
      mockUseIsAuthenticated.mockReturnValue(false);
    });

    it("renders the outlet content for guest users", () => {
      renderComponentQuery(<GuestOnlyOutlet />);

      expect(screen.getByText("Guest Content")).toBeInTheDocument();
      expect(screen.queryByText(/Redirecting to/i)).not.toBeInTheDocument();
    });

    it("renders the outlet content with custom fallbackPath", () => {
      renderComponentQuery(<GuestOnlyOutlet fallbackPath="/dashboard" />);

      expect(screen.getByText("Guest Content")).toBeInTheDocument();
      expect(screen.queryByText(/Redirecting to/i)).not.toBeInTheDocument();
    });
  });

  describe("when user is authenticated", () => {
    beforeEach(() => {
      mockUseIsAuthenticated.mockReturnValue(true);
    });

    it("redirects to default fallback path (/user) when authenticated", () => {
      renderComponentQuery(<GuestOnlyOutlet />);

      expect(screen.getByText("Redirecting to /user")).toBeInTheDocument();
      expect(screen.queryByText("Guest Content")).not.toBeInTheDocument();
    });

    it("redirects to custom fallback path when authenticated", () => {
      renderComponentQuery(<GuestOnlyOutlet fallbackPath="/dashboard" />);

      expect(screen.getByText("Redirecting to /dashboard")).toBeInTheDocument();
      expect(screen.queryByText("Guest Content")).not.toBeInTheDocument();
    });

    it("redirects to /user/profile when custom fallbackPath is provided", () => {
      renderComponentQuery(<GuestOnlyOutlet fallbackPath="/user/profile" />);

      expect(
        screen.getByText("Redirecting to /user/profile")
      ).toBeInTheDocument();
    });
  });

  describe("authentication state changes", () => {
    it("switches from guest content to redirect when authentication status changes", () => {
      mockUseIsAuthenticated.mockReturnValue(false);
      const { rerender } = renderComponentQuery(<GuestOnlyOutlet />);

      expect(screen.getByText("Guest Content")).toBeInTheDocument();

      // Simule un changement d'état d'authentification
      mockUseIsAuthenticated.mockReturnValue(true);
      rerender(<GuestOnlyOutlet />);

      expect(screen.getByText("Redirecting to /user")).toBeInTheDocument();
      expect(screen.queryByText("Guest Content")).not.toBeInTheDocument();
    });

    it("switches from redirect to guest content when user logs out", () => {
      mockUseIsAuthenticated.mockReturnValue(true);
      const { rerender } = renderComponentQuery(<GuestOnlyOutlet />);

      expect(screen.getByText("Redirecting to /user")).toBeInTheDocument();

      // Simule une déconnexion
      mockUseIsAuthenticated.mockReturnValue(false);
      rerender(<GuestOnlyOutlet />);

      expect(screen.getByText("Guest Content")).toBeInTheDocument();
      expect(screen.queryByText(/Redirecting to/i)).not.toBeInTheDocument();
    });
  });

  describe("fallbackPath prop validation", () => {
    beforeEach(() => {
      mockUseIsAuthenticated.mockReturnValue(true);
    });

    it("accepts absolute paths starting with /", () => {
      renderComponentQuery(<GuestOnlyOutlet fallbackPath="/home" />);

      expect(screen.getByText("Redirecting to /home")).toBeInTheDocument();
    });

    it("accepts nested paths", () => {
      renderComponentQuery(
        <GuestOnlyOutlet fallbackPath="/user/settings/profile" />
      );

      expect(
        screen.getByText("Redirecting to /user/settings/profile")
      ).toBeInTheDocument();
    });
  });
});

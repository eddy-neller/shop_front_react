import "@/lib/utils/tests/mocks/mockRouterHelper";
import { setLocation } from "@/lib/utils/tests/mocks/mockRouterHelper";
import { act, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderComponentQuery } from "@/lib/utils/tests/renderComponent";
import AuthNav from "@/features/Auth/components/AuthNav";
import { vi } from "vitest";

describe("AuthNav", () => {
  const setup = () => renderComponentQuery(<AuthNav />);

  beforeEach(() => setLocation({ pathname: "/" }));

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe("unauthenticated behavior", () => {
    it("renders authentication trigger button", () => {
      setup();

      expect(screen.getByText(/sign in \/ sign up/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /sign in \/ sign up/i })
      ).toBeInTheDocument();
    });

    it("shows authentication panel on hover", async () => {
      setup();

      const authTrigger = screen.getByRole("button", {
        name: /sign in \/ sign up/i,
      });

      await userEvent.hover(authTrigger);

      await waitFor(() => {
        expect(screen.getByText(/welcome/i)).toBeInTheDocument();
        expect(
          screen.getByText(/choose an option to continue/i)
        ).toBeInTheDocument();
        expect(
          screen.getByRole("link", { name: /^sign in$/i })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("link", { name: /create account/i })
        ).toBeInTheDocument();
        expect(
          screen.getByRole("link", { name: /forgot password\?/i })
        ).toBeInTheDocument();
      });
    });

    it("shows correct hrefs in the authentication panel", async () => {
      setup();

      await userEvent.hover(
        screen.getByRole("button", { name: /sign in \/ sign up/i })
      );

      await waitFor(() => {
        expect(
          screen.getByRole("link", { name: /^sign in$/i })
        ).toHaveAttribute("href", "/login");
        expect(
          screen.getByRole("link", { name: /create account/i })
        ).toHaveAttribute("href", "/register");
        expect(
          screen.getByRole("link", { name: /forgot password\?/i })
        ).toHaveAttribute("href", "/forgot-password");
      });
    });

    it("closes authentication panel on mouse leave", async () => {
      const { container } = setup();

      const authTrigger = screen.getByRole("button", {
        name: /sign in \/ sign up/i,
      });

      await userEvent.hover(authTrigger);

      await waitFor(() => {
        expect(
          screen.getByText(/choose an option to continue/i)
        ).toBeInTheDocument();
      });

      // mouseLeave on the outer wrapper div (handler lives there, not on the button)
      fireEvent.mouseLeave(container.firstChild as HTMLElement);

      await waitFor(() => {
        expect(
          screen.queryByText(/choose an option to continue/i)
        ).not.toBeInTheDocument();
      });
    });

    it("cancels the scheduled close when hovering back before the delay ends", () => {
      vi.useFakeTimers();
      const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");
      const { container } = setup();
      const authWrapper = container.firstChild as HTMLElement;
      const authTrigger = screen.getByRole("button", {
        name: /sign in \/ sign up/i,
      });

      fireEvent.mouseEnter(authWrapper);
      expect(authTrigger).toHaveAttribute("aria-expanded", "true");

      fireEvent.mouseLeave(authWrapper);
      clearTimeoutSpy.mockClear();
      fireEvent.mouseEnter(authWrapper);

      expect(clearTimeoutSpy).toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(150);
      });

      expect(authTrigger).toHaveAttribute("aria-expanded", "true");
      expect(
        screen.getByText(/choose an option to continue/i)
      ).toBeInTheDocument();
    });

    it("clears the previous scheduled close when mouse leaves again", () => {
      vi.useFakeTimers();
      const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");
      const { container } = setup();
      const authWrapper = container.firstChild as HTMLElement;
      const authTrigger = screen.getByRole("button", {
        name: /sign in \/ sign up/i,
      });

      fireEvent.mouseEnter(authWrapper);
      fireEvent.mouseLeave(authWrapper);
      clearTimeoutSpy.mockClear();
      fireEvent.mouseLeave(authWrapper);

      expect(clearTimeoutSpy).toHaveBeenCalled();
      expect(authTrigger).toHaveAttribute("aria-expanded", "true");

      act(() => {
        vi.advanceTimersByTime(150);
      });

      expect(authTrigger).toHaveAttribute("aria-expanded", "false");
      expect(
        screen.queryByText(/choose an option to continue/i)
      ).not.toBeInTheDocument();
    });

    it("closes authentication panel when clicking on sign in link", async () => {
      setup();

      await userEvent.hover(
        screen.getByRole("button", { name: /sign in \/ sign up/i })
      );

      await waitFor(() => {
        expect(
          screen.getByRole("link", { name: /^sign in$/i })
        ).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole("link", { name: /^sign in$/i }));

      await waitFor(() => {
        expect(
          screen.queryByText(/choose an option to continue/i)
        ).not.toBeInTheDocument();
      });
    });

    it("clears a scheduled close when clicking on sign in link", () => {
      vi.useFakeTimers();
      const clearTimeoutSpy = vi.spyOn(globalThis, "clearTimeout");
      const { container } = setup();
      const authWrapper = container.firstChild as HTMLElement;
      const authTrigger = screen.getByRole("button", {
        name: /sign in \/ sign up/i,
      });

      fireEvent.mouseEnter(authWrapper);
      fireEvent.mouseLeave(authWrapper);
      clearTimeoutSpy.mockClear();
      fireEvent.click(screen.getByRole("link", { name: /^sign in$/i }));

      expect(clearTimeoutSpy).toHaveBeenCalled();
      expect(authTrigger).toHaveAttribute("aria-expanded", "false");

      act(() => {
        vi.advanceTimersByTime(150);
      });

      expect(
        screen.queryByText(/choose an option to continue/i)
      ).not.toBeInTheDocument();
    });

    it("clears a scheduled close when the component unmounts", () => {
      vi.useFakeTimers();
      const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");
      const { container, unmount } = setup();
      const authWrapper = container.firstChild as HTMLElement;

      fireEvent.mouseEnter(authWrapper);
      fireEvent.mouseLeave(authWrapper);
      clearTimeoutSpy.mockClear();

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();
    });

    it("closes authentication panel when clicking on create account link", async () => {
      setup();

      await userEvent.hover(
        screen.getByRole("button", { name: /sign in \/ sign up/i })
      );

      await waitFor(() => {
        expect(
          screen.getByRole("link", { name: /create account/i })
        ).toBeInTheDocument();
      });

      await userEvent.click(
        screen.getByRole("link", { name: /create account/i })
      );

      await waitFor(() => {
        expect(
          screen.queryByText(/choose an option to continue/i)
        ).not.toBeInTheDocument();
      });
    });

    it("closes authentication panel when clicking on forgot password link", async () => {
      setup();

      await userEvent.hover(
        screen.getByRole("button", { name: /sign in \/ sign up/i })
      );

      await waitFor(() => {
        expect(
          screen.getByRole("link", { name: /forgot password\?/i })
        ).toBeInTheDocument();
      });

      await userEvent.click(
        screen.getByRole("link", { name: /forgot password\?/i })
      );

      await waitFor(() => {
        expect(
          screen.queryByText(/choose an option to continue/i)
        ).not.toBeInTheDocument();
      });
    });

    it("shows active styling when on authentication pages", () => {
      setLocation({ pathname: "/login" });
      setup();

      expect(
        screen.getByRole("button", { name: /sign in \/ sign up/i })
      ).toHaveClass("text-blue-600");
    });

    it("shows active styling on register path", () => {
      setLocation({ pathname: "/register" });
      setup();

      expect(
        screen.getByRole("button", { name: /sign in \/ sign up/i })
      ).toHaveClass("text-blue-600");
    });

    it("does not show active styling on unrelated paths", () => {
      setLocation({ pathname: "/" });
      setup();

      expect(
        screen.getByRole("button", { name: /sign in \/ sign up/i })
      ).toHaveClass("text-gray-700");
    });
  });

  describe("accessibility", () => {
    it("has aria-haspopup='dialog' on the trigger button", () => {
      setup();

      expect(
        screen.getByRole("button", { name: /sign in \/ sign up/i })
      ).toHaveAttribute("aria-haspopup", "dialog");
    });

    it("has aria-expanded='false' when panel is closed", () => {
      setup();

      expect(
        screen.getByRole("button", { name: /sign in \/ sign up/i })
      ).toHaveAttribute("aria-expanded", "false");
    });

    it("updates aria-expanded to 'true' when panel opens", async () => {
      setup();

      const authTrigger = screen.getByRole("button", {
        name: /sign in \/ sign up/i,
      });

      await userEvent.hover(authTrigger);

      await waitFor(() => {
        expect(authTrigger).toHaveAttribute("aria-expanded", "true");
      });
    });

    it("renders the panel with role='dialog' and correct aria-label", async () => {
      setup();

      await userEvent.hover(
        screen.getByRole("button", { name: /sign in \/ sign up/i })
      );

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toHaveAttribute(
          "aria-label",
          "Authentication panel"
        );
      });
    });

    it("has aria-controls pointing to the panel id", () => {
      setup();

      expect(
        screen.getByRole("button", { name: /sign in \/ sign up/i })
      ).toHaveAttribute("aria-controls", "authPanel");
    });
  });

  describe("icon rendering", () => {
    it("renders an svg icon in the authentication trigger", () => {
      setup();

      const authTrigger = screen.getByRole("button", {
        name: /sign in \/ sign up/i,
      });

      expect(authTrigger.querySelector("svg")).toBeInTheDocument();
    });

    it("renders svg icons in the panel links", async () => {
      setup();

      await userEvent.hover(
        screen.getByRole("button", { name: /sign in \/ sign up/i })
      );

      await waitFor(() => {
        const signInLink = screen.getByRole("link", { name: /^sign in$/i });
        expect(signInLink.querySelector("svg")).toBeInTheDocument();

        const createAccountLink = screen.getByRole("link", {
          name: /create account/i,
        });
        expect(createAccountLink.querySelector("svg")).toBeInTheDocument();
      });
    });
  });
});

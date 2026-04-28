import "@/lib/utils/tests/mocks/mockRouterHelper";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/features/Auth/components/LoginForm";
import { renderComponentQuery } from "@/lib/utils/tests/renderComponent";
import { useLogin } from "@/features/Auth/hooks/useLogin";
import i18n from "@/i18n";
import { vi, type Mock } from "vitest";

const loginSpy = vi.fn();

vi.mock("@/features/Auth/hooks/useLogin", () => ({
  useLogin: vi.fn(() => ({
    login: loginSpy,
    isPending: false,
    isLoading: false,
    isError: false,
    error: null,
  })),
}));

const mockUseLogin = useLogin as Mock;

describe("LoginForm", () => {
  const setup = () => renderComponentQuery(<LoginForm />);

  // Auth namespaces live under src/features/Auth/locales/ (feature-scoped path).
  // The dynamic import() for these paths resolves slower than the generic
  // src/locales/ path used by other namespaces (e.g. "contact-us"), so useForm
  // can mount before translations are ready and freeze stale keys as zod error
  // messages. Pre-loading guarantees translations are available at mount time.
  beforeAll(async () => {
    await i18n.loadNamespaces("auth");
  });

  beforeEach(() => {
    loginSpy.mockClear();
  });

  describe("rendering", () => {
    it("should render the form correctly", () => {
      setup();

      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/name@example\.com/i)
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/your password/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /sign in/i })
      ).toBeInTheDocument();
    });

    it("should render the show password toggle button", () => {
      setup();

      expect(
        screen.getByRole("button", { name: /show password/i })
      ).toBeInTheDocument();
    });
  });

  describe("validation", () => {
    it("should show validation errors on empty form submission", async () => {
      setup();

      await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
    });

    it("should show validation error on invalid email format", async () => {
      setup();

      // "test@nodomain" passes HTML email sanitization (has @) but fails zod's
      // .email() check (no TLD), so the error message is "Invalid email format"
      // instead of "Email is required". Typing plain "invalid-email" (no @)
      // would be sanitized to "" by jsdom, triggering the min(1) error instead.
      await userEvent.type(
        screen.getByPlaceholderText(/name@example\.com/i),
        "test@nodomain"
      );
      await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      });
    });

    it("should show validation error on short password", async () => {
      setup();

      await userEvent.type(
        screen.getByPlaceholderText(/your password/i),
        "123"
      );
      await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument();
      });
    });

    it("should not call login when form is invalid", async () => {
      setup();

      await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });

      expect(loginSpy).not.toHaveBeenCalled();
    });
  });

  describe("form submission", () => {
    it("should call login with correct credentials on valid submit", async () => {
      setup();

      await userEvent.type(
        screen.getByPlaceholderText(/name@example\.com/i),
        "john.doe@example.com"
      );
      await userEvent.type(
        screen.getByPlaceholderText(/your password/i),
        "password123"
      );
      await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(loginSpy).toHaveBeenCalledWith({
          email: "john.doe@example.com",
          password: "password123",
        });
      });
    });

    it("should call login only once per submit", async () => {
      setup();

      await userEvent.type(
        screen.getByPlaceholderText(/name@example\.com/i),
        "john.doe@example.com"
      );
      await userEvent.type(
        screen.getByPlaceholderText(/your password/i),
        "password123"
      );
      await userEvent.click(screen.getByRole("button", { name: /sign in/i }));

      await waitFor(() => {
        expect(loginSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("password visibility toggle", () => {
    it("should show the password when toggle is clicked", async () => {
      setup();

      const passwordInput = screen.getByPlaceholderText(/your password/i);
      expect(passwordInput).toHaveAttribute("type", "password");

      await userEvent.click(
        screen.getByRole("button", { name: /show password/i })
      );

      expect(passwordInput).toHaveAttribute("type", "text");
      expect(
        screen.getByRole("button", { name: /hide password/i })
      ).toBeInTheDocument();
    });

    it("should hide the password when toggle is clicked again", async () => {
      setup();

      await userEvent.click(
        screen.getByRole("button", { name: /show password/i })
      );
      await userEvent.click(
        screen.getByRole("button", { name: /hide password/i })
      );

      expect(screen.getByPlaceholderText(/your password/i)).toHaveAttribute(
        "type",
        "password"
      );
    });
  });

  describe("busy state", () => {
    afterEach(() => {
      mockUseLogin.mockReset();
      mockUseLogin.mockImplementation(() => ({
        login: loginSpy,
        isPending: false,
        isLoading: false,
        isError: false,
        error: null,
      }));
    });

    it("should show busy label when isPending is true", () => {
      mockUseLogin.mockReturnValue({
        login: loginSpy,
        isPending: true,
        isLoading: true,
        isError: false,
        error: null,
      });

      setup();

      expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    });

    it("should disable the submit button when isPending is true", () => {
      mockUseLogin.mockReturnValue({
        login: loginSpy,
        isPending: true,
        isLoading: true,
        isError: false,
        error: null,
      });

      setup();

      expect(
        screen.getByRole("button", { name: /signing in/i })
      ).toBeDisabled();
    });
  });
});

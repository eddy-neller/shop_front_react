import "@/lib/utils/tests/mocks/mockToastHelper";
import { toast } from "@/lib/utils/tests/mocks/mockToastHelper";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterActivationEmailResendForm from "@/features/Auth/components/RegisterActivationEmailResendForm";
import { resendActivationEmail } from "@/features/Auth/lib/api/auth";
import { renderComponentQuery } from "@/lib/utils/tests/renderComponent";
import {
  makeValidationError422,
  makeRateLimitError429,
} from "@/lib/utils/tests/axiosHelper";
import i18n from "@/i18n";

vi.mock("@/features/Auth/lib/api/auth", () => ({
  resendActivationEmail: vi.fn(),
}));

const mockResendActivationEmail = vi.mocked(resendActivationEmail);

describe("RegisterActivationEmailResendForm", () => {
  const setup = () =>
    renderComponentQuery(<RegisterActivationEmailResendForm />);

  beforeAll(async () => {
    await i18n.loadNamespaces("auth-registerValidation");
  });

  describe("rendering", () => {
    it("should render the form correctly", () => {
      setup();

      expect(screen.getByLabelText(/your email/i)).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/you@example\.com/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /send me a new link/i })
      ).toBeInTheDocument();
    });
  });

  describe("validation", () => {
    it("should show validation error on empty form submission", async () => {
      setup();

      await userEvent.click(
        screen.getByRole("button", { name: /send me a new link/i })
      );

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });
    });

    it("should show validation error on invalid email format", async () => {
      setup();

      // "test@nodomain" passes HTML email sanitization (has @) but fails zod's
      // .email() check (no TLD). Plain "invalid-email" (no @) would be sanitized
      // to "" by jsdom, triggering min(1) instead.
      await userEvent.type(
        screen.getByPlaceholderText(/you@example\.com/i),
        "test@nodomain"
      );
      await userEvent.click(
        screen.getByRole("button", { name: /send me a new link/i })
      );

      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      });
    });

    it("should show validation error when email exceeds 100 characters", async () => {
      setup();

      const longEmail = "a".repeat(90) + "@example.com"; // 102 chars total
      await userEvent.type(
        screen.getByPlaceholderText(/you@example\.com/i),
        longEmail
      );
      await userEvent.click(
        screen.getByRole("button", { name: /send me a new link/i })
      );

      await waitFor(() => {
        expect(screen.getByText(/maximum 100 characters/i)).toBeInTheDocument();
      });
    });

    it("should not call the API when form is invalid", async () => {
      setup();

      await userEvent.click(
        screen.getByRole("button", { name: /send me a new link/i })
      );

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });

      expect(mockResendActivationEmail).not.toHaveBeenCalled();
    });
  });

  describe("successful submission", () => {
    it("should call the API with the correct email", async () => {
      mockResendActivationEmail.mockResolvedValueOnce(undefined);
      setup();

      await userEvent.type(
        screen.getByPlaceholderText(/you@example\.com/i),
        "john.doe@example.com"
      );
      await userEvent.click(
        screen.getByRole("button", { name: /send me a new link/i })
      );

      await waitFor(() => {
        expect(mockResendActivationEmail).toHaveBeenCalledWith({
          email: "john.doe@example.com",
        });
      });
    });

    it("should show a success toast after submission", async () => {
      mockResendActivationEmail.mockResolvedValueOnce(undefined);
      setup();

      await userEvent.type(
        screen.getByPlaceholderText(/you@example\.com/i),
        "john.doe@example.com"
      );
      await userEvent.click(
        screen.getByRole("button", { name: /send me a new link/i })
      );

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "A new activation link has been sent."
        );
      });
    });

    it("should show the success message with the submitted email", async () => {
      mockResendActivationEmail.mockResolvedValueOnce(undefined);
      setup();

      await userEvent.type(
        screen.getByPlaceholderText(/you@example\.com/i),
        "john.doe@example.com"
      );
      await userEvent.click(
        screen.getByRole("button", { name: /send me a new link/i })
      );

      await waitFor(() => {
        expect(
          screen.getByText(/a new activation link has been sent to/i)
        ).toBeInTheDocument();
        expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
        expect(
          screen.getByText(/please check your inbox/i)
        ).toBeInTheDocument();
      });
    });

    it("should hide the form after successful submission", async () => {
      mockResendActivationEmail.mockResolvedValueOnce(undefined);
      setup();

      await userEvent.type(
        screen.getByPlaceholderText(/you@example\.com/i),
        "john.doe@example.com"
      );
      await userEvent.click(
        screen.getByRole("button", { name: /send me a new link/i })
      );

      await waitFor(() => {
        expect(
          screen.queryByPlaceholderText(/you@example\.com/i)
        ).not.toBeInTheDocument();
        expect(
          screen.queryByRole("button", { name: /send me a new link/i })
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("error handling", () => {
    it("should show server-side field error on 422 response", async () => {
      mockResendActivationEmail.mockRejectedValueOnce(
        makeValidationError422([
          { propertyPath: "email", message: "Email not found" },
        ])
      );
      setup();

      await userEvent.type(
        screen.getByPlaceholderText(/you@example\.com/i),
        "nonexistent@example.com"
      );
      await userEvent.click(
        screen.getByRole("button", { name: /send me a new link/i })
      );

      await waitFor(() => {
        expect(screen.getByText(/email not found/i)).toBeInTheDocument();
      });
    });

    it("should show a toast on 429 rate limit error", async () => {
      mockResendActivationEmail.mockRejectedValueOnce(
        makeRateLimitError429("Too many requests", 60)
      );
      setup();

      await userEvent.type(
        screen.getByPlaceholderText(/you@example\.com/i),
        "test@example.com"
      );
      await userEvent.click(
        screen.getByRole("button", { name: /send me a new link/i })
      );

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Limite de requêtes atteinte",
          {
            description: "Trop de requêtes. Veuillez réessayer plus tard.",
          }
        );
      });
    });

    it("should show the default error toast on generic error", async () => {
      mockResendActivationEmail.mockRejectedValueOnce(
        new Error("Network error")
      );
      setup();

      await userEvent.type(
        screen.getByPlaceholderText(/you@example\.com/i),
        "test@example.com"
      );
      await userEvent.click(
        screen.getByRole("button", { name: /send me a new link/i })
      );

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "An error occurred while resending the activation email."
        );
      });
    });
  });
});

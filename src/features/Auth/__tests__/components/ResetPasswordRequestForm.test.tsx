import "@/lib/utils/tests/mocks/mockRouterHelper";
import "@/lib/utils/tests/mocks/mockToastHelper";
import { toast } from "@/lib/utils/tests/mocks/mockToastHelper";
import { navigate } from "@/lib/utils/tests/mocks/mockRouterHelper";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResetPasswordRequestForm from "@/features/Auth/components/ResetPasswordRequestForm";
import { requestPasswordReset } from "@/features/Auth/lib/api/auth";
import { renderComponentQuery } from "@/lib/utils/tests/renderComponent";
import {
  makeRateLimitError429,
  makeValidationError422,
} from "@/lib/utils/tests/axiosHelper";

vi.mock("@/features/Auth/lib/api/auth", () => ({
  requestPasswordReset: vi.fn(),
}));

describe("ResetPasswordRequestForm", () => {
  const setup = () => {
    renderComponentQuery(<ResetPasswordRequestForm />);
  };

  it("should render the form correctly", () => {
    setup();

    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send reset instructions/i })
    ).toBeInTheDocument();
  });

  it("should show validation errors on empty form submission", async () => {
    setup();

    await userEvent.click(
      screen.getByRole("button", { name: /send reset instructions/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it("should show validation errors on invalid email format", async () => {
    setup();

    await userEvent.type(
      screen.getByPlaceholderText(/you@example.com/i),
      "invalid-email"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /send reset instructions/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  it("should show validation errors on long email", async () => {
    setup();

    const longEmail = "a".repeat(101) + "@example.com";
    await userEvent.type(
      screen.getByPlaceholderText(/you@example.com/i),
      longEmail
    );
    await userEvent.click(
      screen.getByRole("button", { name: /send reset instructions/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/maximum 100 characters/i)).toBeInTheDocument();
    });
  });

  it("should submit the form successfully", async () => {
    vi.mocked(requestPasswordReset).mockResolvedValueOnce(undefined);
    setup();

    await userEvent.type(
      screen.getByPlaceholderText(/you@example.com/i),
      "john.doe@example.com"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /send reset instructions/i })
    );

    await waitFor(() => {
      expect(requestPasswordReset).toHaveBeenCalledWith({
        email: "john.doe@example.com",
      });
      expect(toast.success).toHaveBeenCalledWith(
        "Password reset instructions sent successfully.",
        expect.objectContaining({ description: expect.any(String) })
      );
      expect(sessionStorage.getItem("forgotPasswordEmail")).toBe(
        "john.doe@example.com"
      );
      expect(navigate).toHaveBeenCalledWith("/forgot-password/success");
    });
  });

  it("should handle server-side validation errors", async () => {
    const violations = [{ propertyPath: "email", message: "Email not found" }];
    vi.mocked(requestPasswordReset).mockRejectedValueOnce(
      makeValidationError422(violations)
    );
    setup();

    await userEvent.type(
      screen.getByPlaceholderText(/you@example.com/i),
      "nonexistent@example.com"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /send reset instructions/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/email not found/i)).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it("should handle rate limiting error (429)", async () => {
    vi.mocked(requestPasswordReset).mockRejectedValueOnce(
      makeRateLimitError429("Too many requests", 60)
    );
    setup();

    await userEvent.type(
      screen.getByPlaceholderText(/you@example.com/i),
      "test@example.com"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /send reset instructions/i })
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Limite de requêtes atteinte",
        expect.objectContaining({ description: expect.any(String) })
      );
    });
  });

  it("should show generic error message on failure", async () => {
    vi.mocked(requestPasswordReset).mockRejectedValueOnce(
      new Error("Network error")
    );
    setup();

    await userEvent.type(
      screen.getByPlaceholderText(/you@example.com/i),
      "test@example.com"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /send reset instructions/i })
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "An error occurred while sending the password reset request."
      );
    });
  });

  it("should show loading state during submission", async () => {
    vi.mocked(requestPasswordReset).mockImplementation(
      () => new Promise(() => {})
    );
    setup();

    await userEvent.type(
      screen.getByPlaceholderText(/you@example.com/i),
      "test@example.com"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /send reset instructions/i })
    );

    const button = screen.getByRole("button", { name: /sending/i });
    expect(button).toBeDisabled();
  });
});

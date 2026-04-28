import "@/lib/utils/tests/mocks/mockRouterHelper";
import "@/lib/utils/tests/mocks/mockToastHelper";
import { toast } from "@/lib/utils/tests/mocks/mockToastHelper";
import { navigate } from "@/lib/utils/tests/mocks/mockRouterHelper";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResetPasswordConfirmForm from "@/features/Auth/components/ResetPasswordConfirmForm";
import { confirmPasswordReset } from "@/features/Auth/lib/api/auth";
import { renderComponentQuery } from "@/lib/utils/tests/renderComponent";
import { makeValidationError422 } from "@/lib/utils/tests/axiosHelper";

vi.mock("@/features/Auth/lib/api/auth", () => ({
  confirmPasswordReset: vi.fn(),
}));

describe("ResetPasswordConfirmForm", () => {
  const testToken = "valid-reset-token-123";

  const setup = (token = testToken) => {
    renderComponentQuery(<ResetPasswordConfirmForm token={token} />);
  };

  it("should render the form correctly", () => {
    setup();

    expect(
      screen.getByPlaceholderText(/choose a new password/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/confirm your new password/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reset password/i })
    ).toBeInTheDocument();
  });

  it("should show validation errors on empty form submission", async () => {
    setup();

    await userEvent.click(
      screen.getByRole("button", { name: /reset password/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/new password is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/please confirm your new password/i)
      ).toBeInTheDocument();
    });
  });

  it("should show validation errors on weak password", async () => {
    setup();

    await userEvent.type(
      screen.getByPlaceholderText(/choose a new password/i),
      "weak"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /reset password/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText(/8.30 chars, with 1 uppercase, 1 number/i)
      ).toBeInTheDocument();
    });
  });

  it("should show real-time validation for password mismatch", async () => {
    setup();

    await userEvent.type(
      screen.getByPlaceholderText(/choose a new password/i),
      "ValidPass1!"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/confirm your new password/i),
      "DifferentPass1!"
    );

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });

    await userEvent.clear(
      screen.getByPlaceholderText(/confirm your new password/i)
    );
    await userEvent.type(
      screen.getByPlaceholderText(/confirm your new password/i),
      "ValidPass1!"
    );

    await waitFor(() => {
      expect(
        screen.queryByText(/passwords do not match/i)
      ).not.toBeInTheDocument();
    });
  });

  it("should submit the form successfully", async () => {
    vi.mocked(confirmPasswordReset).mockResolvedValueOnce(undefined);
    setup();

    await userEvent.type(
      screen.getByPlaceholderText(/choose a new password/i),
      "NewValidPass1!"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/confirm your new password/i),
      "NewValidPass1!"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /reset password/i })
    );

    await waitFor(() => {
      expect(confirmPasswordReset).toHaveBeenCalledWith({
        token: testToken,
        newPassword: "NewValidPass1!",
        confirmNewPassword: "NewValidPass1!",
      });
      expect(toast.success).toHaveBeenCalledWith(
        "Your password has been successfully reset.",
        expect.objectContaining({ description: expect.any(String) })
      );
    });
  });

  it("should show success message after successful submission", async () => {
    vi.mocked(confirmPasswordReset).mockResolvedValueOnce(undefined);
    setup();

    await userEvent.type(
      screen.getByPlaceholderText(/choose a new password/i),
      "NewValidPass1!"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/confirm your new password/i),
      "NewValidPass1!"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /reset password/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText(/password reset successful/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/your password has been successfully reset/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/you can now sign in with your new password/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/redirecting to login page/i)
      ).toBeInTheDocument();
    });
  });

  it("should handle server-side validation errors", async () => {
    const violations = [
      { propertyPath: "newPassword", message: "Password too weak" },
    ];
    vi.mocked(confirmPasswordReset).mockRejectedValueOnce(
      makeValidationError422(violations)
    );
    setup();

    await userEvent.type(
      screen.getByPlaceholderText(/choose a new password/i),
      "ValidPass1!"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/confirm your new password/i),
      "ValidPass1!"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /reset password/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/password too weak/i)).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it("should show generic error message on failure", async () => {
    vi.mocked(confirmPasswordReset).mockRejectedValueOnce(
      new Error("Network error")
    );
    setup();

    await userEvent.type(
      screen.getByPlaceholderText(/choose a new password/i),
      "ValidPass1!"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/confirm your new password/i),
      "ValidPass1!"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /reset password/i })
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "An error occurred while resetting your password."
      );
    });
  });

  it("should toggle password visibility", async () => {
    setup();

    const newPasswordInput = screen.getByPlaceholderText(
      /choose a new password/i
    ) as HTMLInputElement;
    const confirmNewPasswordInput = screen.getByPlaceholderText(
      /confirm your new password/i
    ) as HTMLInputElement;

    expect(newPasswordInput.type).toBe("password");
    expect(confirmNewPasswordInput.type).toBe("password");

    await userEvent.click(
      screen.getByRole("button", { name: /show new password/i })
    );
    expect(newPasswordInput.type).toBe("text");

    await userEvent.click(
      screen.getByRole("button", { name: /show confirm new password/i })
    );
    expect(confirmNewPasswordInput.type).toBe("text");
  });

  it("should show loading state during submission", async () => {
    vi.mocked(confirmPasswordReset).mockImplementation(
      () => new Promise(() => {})
    );
    setup();

    await userEvent.type(
      screen.getByPlaceholderText(/choose a new password/i),
      "ValidPass1!"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/confirm your new password/i),
      "ValidPass1!"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /reset password/i })
    );

    const button = screen.getByRole("button", { name: /resetting/i });
    expect(button).toBeDisabled();
  });

  it("should redirect to login after successful reset", async () => {
    vi.mocked(confirmPasswordReset).mockResolvedValueOnce(undefined);
    setup();

    await userEvent.type(
      screen.getByPlaceholderText(/choose a new password/i),
      "NewValidPass1!"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/confirm your new password/i),
      "NewValidPass1!"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /reset password/i })
    );

    await waitFor(
      () => {
        expect(navigate).toHaveBeenCalledWith("/login");
      },
      { timeout: 3500 }
    );
  });

  it("should show password requirements hint", () => {
    setup();

    expect(
      screen.getByText(
        /use a strong password: 8.30 chars, uppercase, number, special/i
      )
    ).toBeInTheDocument();
  });
});

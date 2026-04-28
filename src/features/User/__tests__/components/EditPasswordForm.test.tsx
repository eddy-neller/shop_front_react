import "@/lib/utils/tests/mocks/mockRouterHelper";
import "@/lib/utils/tests/mocks/mockToastHelper";
import { toast } from "@/lib/utils/tests/mocks/mockToastHelper";
import { navigate } from "@/lib/utils/tests/mocks/mockRouterHelper";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditPasswordForm from "@/features/User/components/EditPasswordForm";
import { updatePassword } from "@/features/User/lib/api/user";
import { makeValidationError422 } from "@/lib/utils/tests/axiosHelper";
import { renderComponentQuery } from "@/lib/utils/tests/renderComponent";

vi.mock("@/features/User/lib/api/user", () => ({
  updatePassword: vi.fn(),
}));

describe("EditPasswordForm", () => {
  const setup = () => {
    renderComponentQuery(<EditPasswordForm />);
  };

  it("renders the password fields", () => {
    setup();

    expect(screen.getByLabelText(/^current password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^new password$/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/^confirm new password$/i)
    ).toBeInTheDocument();
  });

  it("should display validation errors", async () => {
    setup();

    await userEvent.click(
      screen.getByRole("button", { name: /change password/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText(/current password is required/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/new password is required/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/please confirm your new password/i)
      ).toBeInTheDocument();
    });
  });

  it("should display validation error for weak new password", async () => {
    setup();

    await userEvent.type(
      screen.getByLabelText(/^new password$/i),
      "weak"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /change password/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText(/8–30 chars, with 1 uppercase, 1 number/i)
      ).toBeInTheDocument();
    });
  });

  it("should display validation error for password mismatch", async () => {
    setup();

    await userEvent.type(
      screen.getByLabelText(/^current password$/i),
      "CurrentPass1!"
    );
    await userEvent.type(
      screen.getByLabelText(/^new password$/i),
      "NewPass123!"
    );
    await userEvent.type(
      screen.getByLabelText(/^confirm new password$/i),
      "DifferentPass1!"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /change password/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText(/passwords do not match/i)
      ).toBeInTheDocument();
    });
  });

  it("should show real-time validation for password mismatch", async () => {
    setup();

    await userEvent.type(
      screen.getByLabelText(/^new password$/i),
      "ValidPass1!"
    );
    await userEvent.type(
      screen.getByLabelText(/^confirm new password$/i),
      "DifferentPass1!"
    );

    await waitFor(() => {
      expect(
        screen.getByText(/passwords do not match/i)
      ).toBeInTheDocument();
    });

    await userEvent.clear(
      screen.getByLabelText(/^confirm new password$/i)
    );
    await userEvent.type(
      screen.getByLabelText(/^confirm new password$/i),
      "ValidPass1!"
    );

    await waitFor(() => {
      expect(
        screen.queryByText(/passwords do not match/i)
      ).not.toBeInTheDocument();
    });
  });

  it("should show real-time validation for new password vs current password", async () => {
    setup();

    await userEvent.type(
      screen.getByLabelText(/^current password$/i),
      "CurrentPass1!"
    );
    await userEvent.type(
      screen.getByLabelText(/^new password$/i),
      "CurrentPass1!"
    );

    await waitFor(() => {
      expect(
        screen.getByText(/new password must be different from current password/i)
      ).toBeInTheDocument();
    });

    await userEvent.clear(screen.getByLabelText(/^new password$/i));
    await userEvent.type(
      screen.getByLabelText(/^new password$/i),
      "DifferentPass1!"
    );

    await waitFor(() => {
      expect(
        screen.queryByText(
          /new password must be different from current password/i
        )
      ).not.toBeInTheDocument();
    });
  });

  it("submits a password update", async () => {
    vi.mocked(updatePassword).mockResolvedValueOnce(undefined);
    setup();

    await userEvent.type(
      screen.getByLabelText(/^current password$/i),
      "Current1!"
    );
    await userEvent.type(
      screen.getByLabelText(/^new password$/i),
      "NextPass1!"
    );
    await userEvent.type(
      screen.getByLabelText(/^confirm new password$/i),
      "NextPass1!"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /change password/i })
    );

    await waitFor(() => {
      expect(updatePassword).toHaveBeenCalledWith({
        currentPassword: "Current1!",
        newPassword: "NextPass1!",
        confirmNewPassword: "NextPass1!",
      });
      expect(toast.success).toHaveBeenCalledWith(
        "Password updated successfully!"
      );
      expect(navigate).toHaveBeenCalledWith("/user/profile");
    });
  });

  it("should handle server-side validation errors", async () => {
    const violations = [
      { propertyPath: "newPassword", message: "Weak password" },
    ];
    vi.mocked(updatePassword).mockRejectedValueOnce(
      makeValidationError422(violations)
    );

    setup();

    await userEvent.type(
      screen.getByLabelText(/^current password$/i),
      "Current1!"
    );
    await userEvent.type(
      screen.getByLabelText(/^new password$/i),
      "NextPass1!"
    );
    await userEvent.type(
      screen.getByLabelText(/^confirm new password$/i),
      "NextPass1!"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /change password/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/weak password/i)).toBeInTheDocument();
      expect(toast.error).toHaveBeenCalledWith("Erreur de validation", {
        description: "Veuillez vérifier les champs du formulaire.",
      });
    });
  });

  it("should show a generic error message on failure", async () => {
    vi.mocked(updatePassword).mockRejectedValueOnce(new Error("Network error"));

    setup();

    await userEvent.type(
      screen.getByLabelText(/^current password$/i),
      "Current1!"
    );
    await userEvent.type(
      screen.getByLabelText(/^new password$/i),
      "NextPass1!"
    );
    await userEvent.type(
      screen.getByLabelText(/^confirm new password$/i),
      "NextPass1!"
    );

    await userEvent.click(
      screen.getByRole("button", { name: /change password/i })
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "An error occurred while updating your password."
      );
    });
  });

  it("should toggle password visibility", async () => {
    setup();

    const currentPasswordInput = screen.getByLabelText(
      /^current password$/i
    ) as HTMLInputElement;
    const newPasswordInput = screen.getByLabelText(
      /^new password$/i
    ) as HTMLInputElement;
    const confirmPasswordInput = screen.getByLabelText(
      /^confirm new password$/i
    ) as HTMLInputElement;

    expect(currentPasswordInput.type).toBe("password");
    expect(newPasswordInput.type).toBe("password");
    expect(confirmPasswordInput.type).toBe("password");

    await userEvent.click(
      screen.getByRole("button", { name: /show current password/i })
    );
    expect(currentPasswordInput.type).toBe("text");

    await userEvent.click(
      screen.getByRole("button", { name: /show new password/i })
    );
    expect(newPasswordInput.type).toBe("text");

    await userEvent.click(
      screen.getByRole("button", {
        name: /show confirm new password/i,
      })
    );
    expect(confirmPasswordInput.type).toBe("text");
  });
});

import "@/utils/tests/mocks/mockRouterHelper";
import "@/utils/tests/mocks/mockToastify";
import { toast } from "@/utils/tests/mocks/mockToastify";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResetPasswordConfirmForm from "@/features/Auth/components/ResetPasswordConfirmForm";
import { confirmPasswordReset } from "@/features/Auth/services/auth";
import { renderComponentQuery } from "@/utils/tests/renderComponent";

vi.mock("@/features/Auth/services/auth", () => ({
  confirmPasswordReset: vi.fn(),
}));

describe("ResetPasswordConfirmForm", () => {
  it("renders the reset confirmation form", () => {
    renderComponentQuery(<ResetPasswordConfirmForm token="abc" />);

    expect(screen.getByLabelText(/^nouveau mot de passe$/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/confirmer le nouveau mot de passe/i)
    ).toBeInTheDocument();
  });

  it("shows the success state after a successful reset", async () => {
    vi.mocked(confirmPasswordReset).mockResolvedValueOnce(undefined);
    renderComponentQuery(<ResetPasswordConfirmForm token="abc" />);

    await userEvent.type(
      screen.getByLabelText(/^nouveau mot de passe$/i),
      "Password1!"
    );
    await userEvent.type(
      screen.getByLabelText(/confirmer le nouveau mot de passe/i),
      "Password1!"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /réinitialiser le mot de passe/i })
    );

    await waitFor(() => {
      expect(confirmPasswordReset).toHaveBeenCalledWith({
        token: "abc",
        newPassword: "Password1!",
        confirmNewPassword: "Password1!",
      });
      expect(toast.success).toHaveBeenCalled();
      expect(screen.getByText(/mot de passe réinitialisé avec succès/i)).toBeInTheDocument();
    });
  });
});

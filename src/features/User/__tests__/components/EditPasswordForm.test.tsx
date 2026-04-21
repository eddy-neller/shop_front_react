import "@/utils/tests/mocks/mockRouterHelper";
import "@/utils/tests/mocks/mockToastify";
import { toast } from "@/utils/tests/mocks/mockToastify";
import { navigate } from "@/utils/tests/mocks/mockRouterHelper";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditPasswordForm from "@/features/User/components/EditPasswordForm";
import { updatePassword } from "@/features/User/services/user";
import { renderComponentQuery } from "@/utils/tests/renderComponent";

vi.mock("@/features/User/services/user", () => ({
  updatePassword: vi.fn(),
}));

describe("EditPasswordForm", () => {
  it("renders the password fields", () => {
    renderComponentQuery(<EditPasswordForm />);

    expect(screen.getByLabelText(/^mot de passe actuel$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^nouveau mot de passe$/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/^confirmer le nouveau mot de passe$/i)
    ).toBeInTheDocument();
  });

  it("submits a password update", async () => {
    vi.mocked(updatePassword).mockResolvedValueOnce(undefined);
    renderComponentQuery(<EditPasswordForm />);

    await userEvent.type(
      screen.getByLabelText(/^mot de passe actuel$/i),
      "Current1!"
    );
    await userEvent.type(screen.getByLabelText(/^nouveau mot de passe$/i), "NextPass1!");
    await userEvent.type(
      screen.getByLabelText(/^confirmer le nouveau mot de passe$/i),
      "NextPass1!"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /modifier le mot de passe/i })
    );

    await waitFor(() => {
      expect(updatePassword).toHaveBeenCalledWith({
        currentPassword: "Current1!",
        newPassword: "NextPass1!",
        confirmNewPassword: "NextPass1!",
      });
      expect(toast.success).toHaveBeenCalled();
      expect(navigate).toHaveBeenCalledWith("/user/profile");
    });
  });
});

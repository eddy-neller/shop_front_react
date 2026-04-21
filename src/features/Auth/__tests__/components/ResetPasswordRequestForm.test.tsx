import "@/utils/tests/mocks/mockRouterHelper";
import "@/utils/tests/mocks/mockToastify";
import { toast } from "@/utils/tests/mocks/mockToastify";
import { navigate } from "@/utils/tests/mocks/mockRouterHelper";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResetPasswordRequestForm from "@/features/Auth/components/ResetPasswordRequestForm";
import { requestPasswordReset } from "@/features/Auth/services/auth";
import { renderComponentQuery } from "@/utils/tests/renderComponent";

vi.mock("@/features/Auth/services/auth", () => ({
  requestPasswordReset: vi.fn(),
}));

describe("ResetPasswordRequestForm", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("renders the reset request form", () => {
    renderComponentQuery(<ResetPasswordRequestForm />);

    expect(screen.getByLabelText(/votre email/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /envoyer les instructions/i })
    ).toBeInTheDocument();
  });

  it("submits and redirects to the success page", async () => {
    vi.mocked(requestPasswordReset).mockResolvedValueOnce(undefined);
    renderComponentQuery(<ResetPasswordRequestForm />);

    await userEvent.type(
      screen.getByLabelText(/votre email/i),
      "john@example.com"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /envoyer les instructions/i })
    );

    await waitFor(() => {
      expect(requestPasswordReset).toHaveBeenCalledWith({ email: "john@example.com" });
      expect(toast.success).toHaveBeenCalled();
      expect(sessionStorage.getItem("forgotPasswordEmail")).toBe("john@example.com");
      expect(navigate).toHaveBeenCalledWith("/forgot-password/success");
    });
  });
});

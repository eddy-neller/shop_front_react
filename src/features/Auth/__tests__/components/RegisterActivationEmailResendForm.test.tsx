import "@/utils/tests/mocks/mockToastify";
import { toast } from "@/utils/tests/mocks/mockToastify";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterActivationEmailResendForm from "@/features/Auth/components/RegisterActivationEmailResendForm";
import { resendActivationEmail } from "@/features/Auth/services/auth";
import { renderComponentQuery } from "@/utils/tests/renderComponent";

vi.mock("@/features/Auth/services/auth", () => ({
  resendActivationEmail: vi.fn(),
}));

describe("RegisterActivationEmailResendForm", () => {
  it("renders the resend form", () => {
    renderComponentQuery(<RegisterActivationEmailResendForm />);

    expect(screen.getByLabelText(/votre email/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /m'envoyer un nouveau lien/i })
    ).toBeInTheDocument();
  });

  it("shows the success state after submission", async () => {
    vi.mocked(resendActivationEmail).mockResolvedValueOnce(undefined);
    renderComponentQuery(<RegisterActivationEmailResendForm />);

    await userEvent.type(
      screen.getByLabelText(/votre email/i),
      "john@example.com"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /m'envoyer un nouveau lien/i })
    );

    await waitFor(() => {
      expect(resendActivationEmail).toHaveBeenCalledWith({ email: "john@example.com" });
      expect(toast.success).toHaveBeenCalled();
      expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
    });
  });
});

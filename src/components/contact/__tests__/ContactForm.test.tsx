import "@/utils/tests/mocks/mockToastify";
import { toast } from "@/utils/tests/mocks/mockToastify";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "@/components/ContactForm";
import { sendEmail } from "@/services/contact";
import { renderComponentQuery } from "@/utils/tests/renderComponent";

vi.mock("@/services/contact", () => ({
  sendEmail: vi.fn(),
}));

describe("ContactForm", () => {
  it("renders the current contact form", () => {
    renderComponentQuery(<ContactForm />);

    expect(screen.getByLabelText(/nom complet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sujet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it("submits the form successfully", async () => {
    vi.mocked(sendEmail).mockResolvedValueOnce(undefined);
    renderComponentQuery(<ContactForm />);

    await userEvent.type(screen.getByLabelText(/nom complet/i), "John Doe");
    await userEvent.type(screen.getByLabelText(/^email$/i), "john@example.com");
    await userEvent.type(screen.getByLabelText(/sujet/i), "Bonjour");
    await userEvent.type(screen.getByLabelText(/message/i), "Un message assez long.");
    await userEvent.click(
      screen.getByRole("button", { name: /envoyer le message/i })
    );

    await waitFor(() => {
      expect(sendEmail).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        subject: "Bonjour",
        message: "Un message assez long.",
      });
      expect(toast.success).toHaveBeenCalled();
    });
  });
});

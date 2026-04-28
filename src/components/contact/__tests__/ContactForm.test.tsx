import "@/lib/utils/tests/mocks/mockToastHelper";
import { toast } from "@/lib/utils/tests/mocks/mockToastHelper";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "@/components/contact/ContactForm";
import { sendEmail } from "@/lib/api/contact";
import { renderComponentQuery } from "@/lib/utils/tests/renderComponent";
import { makeValidationError422 } from "@/lib/utils/tests/axiosHelper";

vi.mock("@/lib/api/contact", () => ({
  sendEmail: vi.fn(),
}));

describe("ContactForm", () => {
  const setup = () => {
    renderComponentQuery(<ContactForm />);

    return {
      nameInput: screen.getByLabelText(/full name/i),
      emailInput: screen.getByLabelText(/^email$/i),
      subjectInput: screen.getByLabelText(/subject/i),
      messageInput: screen.getByLabelText(/^message$/i),
      submitButton: screen.getByRole("button", { name: /send message/i }),
    };
  };

  it("renders the current contact form", () => {
    const { nameInput, emailInput, subjectInput, messageInput, submitButton } =
      setup();

    expect(screen.getByText("Contact Us")).toBeInTheDocument();
    expect(nameInput).toHaveAttribute("placeholder", "Your name");
    expect(emailInput).toHaveAttribute("placeholder", "your.email@example.com");
    expect(subjectInput).toHaveAttribute(
      "placeholder",
      "Subject of your message"
    );
    expect(messageInput).toHaveAttribute("placeholder", "Your message...");
    expect(submitButton).toBeInTheDocument();
  });

  it("shows validation errors on empty form", async () => {
    const user = userEvent.setup();
    const { submitButton } = setup();

    await user.click(submitButton);

    expect(
      await screen.findByText(/name must be at least 2 characters/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
    expect(
      screen.getByText(/subject must be at least 5 characters/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/message must be at least 10 characters/i)
    ).toBeInTheDocument();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("shows validation errors for short field values", async () => {
    const user = userEvent.setup();
    const { nameInput, subjectInput, messageInput, submitButton } = setup();

    await user.type(nameInput, "J");
    await user.type(subjectInput, "Test");
    await user.type(messageInput, "Too short");
    await user.click(submitButton);

    expect(
      await screen.findByText(/name must be at least 2 characters/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/subject must be at least 5 characters/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/message must be at least 10 characters/i)
    ).toBeInTheDocument();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("shows a validation error for invalid email input", async () => {
    const user = userEvent.setup();
    const { emailInput, submitButton } = setup();

    await user.type(emailInput, "john");
    await user.click(submitButton);

    expect(
      await screen.findByText(/invalid email format/i)
    ).toBeInTheDocument();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("submits the form successfully", async () => {
    const user = userEvent.setup();
    vi.mocked(sendEmail).mockResolvedValueOnce({ message: "Message sent" });
    const { nameInput, emailInput, subjectInput, messageInput, submitButton } =
      setup();

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john.doe@example.com");
    await user.type(subjectInput, "Test Subject");
    await user.type(messageInput, "This is a test message.");
    await user.click(submitButton);

    await waitFor(() => {
      expect(sendEmail).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john.doe@example.com",
        subject: "Test Subject",
        message: "This is a test message.",
      });
      expect(toast.success).toHaveBeenCalledWith("Message sent successfully!", {
        description: "We will get back to you as soon as possible.",
      });
    });

    expect(nameInput).toHaveValue("");
    expect(emailInput).toHaveValue("");
    expect(subjectInput).toHaveValue("");
    expect(messageInput).toHaveValue("");
  });

  it("shows server-side validation errors", async () => {
    const user = userEvent.setup();
    const violations = [
      { propertyPath: "name", message: "Invalid name" },
      { propertyPath: "subject", message: "Invalid subject" },
    ];
    vi.mocked(sendEmail).mockRejectedValueOnce(
      makeValidationError422(violations)
    );
    const { nameInput, emailInput, subjectInput, messageInput, submitButton } =
      setup();

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john.doe@example.com");
    await user.type(subjectInput, "Test Subject");
    await user.type(messageInput, "This is a test message.");
    await user.click(submitButton);

    expect(await screen.findByText(/invalid name/i)).toBeInTheDocument();
    expect(screen.getByText(/invalid subject/i)).toBeInTheDocument();
    expect(toast.error).toHaveBeenCalledWith("Erreur de validation", {
      description: "Veuillez vérifier les champs du formulaire.",
    });
  });

  it("shows a generic error message on failure", async () => {
    const user = userEvent.setup();
    vi.mocked(sendEmail).mockRejectedValueOnce(new Error("Network error"));
    const { nameInput, emailInput, subjectInput, messageInput, submitButton } =
      setup();

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john.doe@example.com");
    await user.type(subjectInput, "Test Subject");
    await user.type(messageInput, "This is a test message.");
    await user.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "An error occurred while sending the email."
      );
    });
  });
});

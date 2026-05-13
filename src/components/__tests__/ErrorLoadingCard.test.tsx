import { render, screen } from "@testing-library/react";
import ErrorLoadingCard from "@/components/ErrorLoadingCard";

describe("ErrorLoadingCard", () => {
  const setup = (message?: string) => {
    return render(<ErrorLoadingCard message={message} />);
  };

  it("should render the error card with default message", () => {
    setup();

    expect(
      screen.getByText("Error when loading your data.")
    ).toBeInTheDocument();
  });

  it("should render the error card with custom message", () => {
    const customMessage = "Custom error message";
    setup(customMessage);

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });
});

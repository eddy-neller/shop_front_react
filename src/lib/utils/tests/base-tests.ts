import { screen } from "@testing-library/react";

export const expectSpinnerWhileLoading = () => {
  const spinner = screen.getByRole("status");
  expect(spinner).toBeInTheDocument();
};

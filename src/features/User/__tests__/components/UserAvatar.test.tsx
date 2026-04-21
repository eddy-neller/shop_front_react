import "@/i18n";
import { render, screen } from "@testing-library/react";
import UserAvatar from "@/features/User/components/UserAvatar";
import { describe, expect, it } from "vitest";

describe("UserAvatar", () => {
  it("renders the fallback initials when there is no avatar", () => {
    render(<UserAvatar username="John Doe" />);

    expect(screen.getByText("JD")).toBeInTheDocument();
  });
});

import "@/i18n";
import { render, screen } from "@testing-library/react";
import UserAvatar from "@/features/User/components/UserAvatar";
import { resolveStaticUrl } from "@/lib/utils/url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const originalCompleteDescriptor = Object.getOwnPropertyDescriptor(
  HTMLImageElement.prototype,
  "complete"
);
const originalNaturalWidthDescriptor = Object.getOwnPropertyDescriptor(
  HTMLImageElement.prototype,
  "naturalWidth"
);

describe("UserAvatar", () => {
  beforeAll(() => {
    Object.defineProperty(HTMLImageElement.prototype, "complete", {
      configurable: true,
      get: () => true,
    });
    Object.defineProperty(HTMLImageElement.prototype, "naturalWidth", {
      configurable: true,
      get: () => 1,
    });
  });

  afterAll(() => {
    if (originalCompleteDescriptor) {
      Object.defineProperty(
        HTMLImageElement.prototype,
        "complete",
        originalCompleteDescriptor
      );
    }
    if (originalNaturalWidthDescriptor) {
      Object.defineProperty(
        HTMLImageElement.prototype,
        "naturalWidth",
        originalNaturalWidthDescriptor
      );
    }
  });

  const setup = (avatarUrl: string, username: string) => {
    render(<UserAvatar avatarUrl={avatarUrl} username={username} />);
  };

  it("renders the avatar image with correct URL and alt text", async () => {
    const avatarUrl = "/avatars/user1.png";
    const username = "JohnDoe";

    setup(avatarUrl, username);

    const avatar = await screen.findByRole("img", {
      name: `${username}'s avatar`,
    });
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("src", resolveStaticUrl(avatarUrl));
    expect(avatar).toHaveAttribute("alt", `${username}'s avatar`);
    expect(avatar).toHaveClass("aspect-square h-full w-full");
  });

  it("renders the fallback initials when there is no avatar", () => {
    setup("", "John Doe");

    expect(screen.getByText("JD")).toBeInTheDocument();
  });
});

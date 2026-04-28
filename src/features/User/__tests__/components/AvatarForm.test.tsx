import "@/lib/utils/tests/mocks/mockRouterHelper";
import "@/lib/utils/tests/mocks/mockToastHelper";
import { toast } from "@/lib/utils/tests/mocks/mockToastHelper";
import { navigate } from "@/lib/utils/tests/mocks/mockRouterHelper";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AvatarForm from "@/features/User/components/AvatarForm";
import { updateAvatar } from "@/features/User/lib/api/user";
import {
  AxiosResponseOK,
  makeValidationError422,
} from "@/lib/utils/tests/axiosHelper";
import { renderComponentQuery } from "@/lib/utils/tests/renderComponent";
import { Mock } from "vitest";

vi.mock("@/features/User/lib/api/user", () => ({
  updateAvatar: vi.fn(),
}));

const mockUpdateAvatar = updateAvatar as Mock;

describe("AvatarForm", () => {
  const setup = () => {
    renderComponentQuery(<AvatarForm />);
  };

  it("should render the form correctly", () => {
    setup();

    expect(screen.getByLabelText(/image file/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /update avatar/i })
    ).toBeInTheDocument();
  });

  it("should display validation errors for missing file", async () => {
    setup();

    await userEvent.click(
      screen.getByRole("button", { name: /update avatar/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText(/please select an image file/i)
      ).toBeInTheDocument();
    });
  });

  it("should display validation error for large file size", async () => {
    setup();

    const file = new File(["large-image"], "large.jpg", {
      type: "image/jpeg",
    });
    Object.defineProperty(file, "size", { value: 300 * 1024 });

    const input = screen.getByLabelText(/image file/i);
    await userEvent.upload(input, file);

    expect((input as HTMLInputElement).files).toHaveLength(1);

    await userEvent.click(
      screen.getByRole("button", { name: /update avatar/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText(/file size must be less than 200kb/i)
      ).toBeInTheDocument();
    });
  });

  it("should display validation error for invalid file type", async () => {
    setup();

    const file = new File(["text-content"], "text.txt", {
      type: "text/plain",
    });

    const input = screen.getByLabelText(/image file/i);
    input.removeAttribute("accept");

    await userEvent.upload(input, file);

    expect((input as HTMLInputElement).files).toHaveLength(1);

    await userEvent.click(
      screen.getByRole("button", { name: /update avatar/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText(/only jpg and png files are allowed/i)
      ).toBeInTheDocument();
    });
  });

  it("should call the mutation on valid form submission", async () => {
    mockUpdateAvatar.mockResolvedValueOnce(AxiosResponseOK({}));

    setup();

    const file = new File(["valid-image"], "avatar.png", {
      type: "image/png",
    });

    const input = screen.getByLabelText(/image file/i);
    await userEvent.upload(input, file);

    await userEvent.click(
      screen.getByRole("button", { name: /update avatar/i })
    );

    await waitFor(() => {
      expect(mockUpdateAvatar).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Avatar updated successfully!");
      expect(navigate).toHaveBeenCalledWith("/user/profile");
    });
  });

  it("should handle server-side validation errors", async () => {
    const violations = [
      { propertyPath: "avatarFile", message: "Invalid avatar file" },
    ];
    mockUpdateAvatar.mockRejectedValueOnce(makeValidationError422(violations));

    setup();

    const file = new File(["valid-image"], "avatar.png", {
      type: "image/png",
    });

    const input = screen.getByLabelText(/image file/i);
    await userEvent.upload(input, file);

    await userEvent.click(
      screen.getByRole("button", { name: /update avatar/i })
    );

    await waitFor(() => {
      expect(screen.getByText(/invalid avatar file/i)).toBeInTheDocument();
    });
  });

  it("should show a generic error message on failure", async () => {
    mockUpdateAvatar.mockRejectedValueOnce(new Error("Network error"));

    setup();

    const file = new File(["valid-image"], "avatar.png", {
      type: "image/png",
    });

    const input = screen.getByLabelText(/image file/i);
    await userEvent.upload(input, file);

    await userEvent.click(
      screen.getByRole("button", { name: /update avatar/i })
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining(
          "An error occurred while uploading your avatar"
        )
      );
    });
  });
});

import "@/utils/tests/mocks/mockRouterHelper";
import "@/utils/tests/mocks/mockToastify";
import { toast } from "@/utils/tests/mocks/mockToastify";
import { navigate } from "@/utils/tests/mocks/mockRouterHelper";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AvatarForm from "@/features/User/components/AvatarForm";
import { updateAvatar } from "@/features/User/services/user";
import { renderComponentQuery } from "@/utils/tests/renderComponent";

vi.mock("@/features/User/services/user", () => ({
  updateAvatar: vi.fn(),
}));

describe("AvatarForm", () => {
  it("renders the avatar form", () => {
    renderComponentQuery(<AvatarForm />);

    expect(screen.getByLabelText(/fichier image/i)).toBeInTheDocument();
    expect(screen.getByText(/\(jpg\/png, 96x96px max, 200KB max\)/i)).toBeInTheDocument();
  });

  it("uploads the selected avatar", async () => {
    vi.mocked(updateAvatar).mockResolvedValueOnce(undefined);
    renderComponentQuery(<AvatarForm />);

    const file = new File(["avatar"], "avatar.png", { type: "image/png" });
    await userEvent.upload(screen.getByLabelText(/fichier image/i), file);
    await userEvent.click(
      screen.getByRole("button", { name: /mettre à jour l'avatar/i })
    );

    await waitFor(() => {
      expect(updateAvatar).toHaveBeenCalledWith(file);
      expect(toast.success).toHaveBeenCalled();
      expect(navigate).toHaveBeenCalledWith("/user/profile");
    });
  });
});

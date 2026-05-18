import "@/lib/utils/tests/mocks/mockToastHelper";
import { toast } from "@/lib/utils/tests/mocks/mockToastHelper";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderPage } from "@/lib/utils/tests/renderPage";
import {
  useAddresses,
  useDeleteAddress,
} from "@/features/Shop/hooks/useAddresses";
import rawAddresses from "@/features/Shop/__tests__/fixtures/addresses.json";
import type { ShopAddress } from "@/features/Shop/types/address";
import { Mock, vi } from "vitest";

vi.mock("@/features/Shop/hooks/useAddresses", () => ({
  useAddresses: vi.fn(),
  useDeleteAddress: vi.fn(),
  useCreateAddress: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useUpdateAddress: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

const mockUseAddresses = useAddresses as Mock;
const mockUseDeleteAddress = useDeleteAddress as Mock;
const deleteMutate = vi.fn();

describe("UserAddressesPage", () => {
  const addresses = rawAddresses as ShopAddress[];

  beforeEach(() => {
    mockUseDeleteAddress.mockReturnValue({
      mutate: deleteMutate,
      isPending: false,
    });
    mockUseAddresses.mockReturnValue({
      data: addresses,
      isPending: false,
      isError: false,
    });
  });

  const setup = () => {
    renderPage("/user/addresses");
  };

  it("renders the page title and addresses", async () => {
    setup();

    expect(
      await screen.findByRole("heading", { name: "My addresses" })
    ).toBeInTheDocument();
    expect(screen.getAllByText("Home").length).toBeGreaterThan(0);
    expect(screen.getByText("Office")).toBeInTheDocument();
    expect(screen.getByText(/12 rue de la paix/i)).toBeInTheDocument();
  });

  it("renders the empty state", async () => {
    mockUseAddresses.mockReturnValue({
      data: [],
      isPending: false,
      isError: false,
    });

    setup();

    expect(await screen.findByText("No address yet")).toBeInTheDocument();
  });

  it("renders the error state", async () => {
    mockUseAddresses.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
    });

    setup();

    expect(
      await screen.findByText("Unable to load your addresses")
    ).toBeInTheDocument();
  });

  it("opens the create form when clicking Add an address", async () => {
    setup();

    await userEvent.click(
      await screen.findByRole("button", { name: /add an address/i })
    );

    expect(await screen.findByText("New address")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /add an address/i })
    ).not.toBeInTheDocument();
  });

  it("closes the form when clicking Cancel", async () => {
    setup();

    await userEvent.click(
      await screen.findByRole("button", { name: /add an address/i })
    );
    expect(await screen.findByText("New address")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    await waitFor(() => {
      expect(screen.queryByText("New address")).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole("button", { name: /add an address/i })
    ).toBeInTheDocument();
  });

  it("opens the edit form with the selected address", async () => {
    setup();

    await userEvent.click(screen.getAllByRole("button", { name: /edit/i })[0]);

    expect(await screen.findByText("Edit address")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Home")).toBeInTheDocument();
  });

  it("does not delete when confirm is cancelled", async () => {
    vi.spyOn(window, "confirm").mockReturnValueOnce(false);

    setup();

    await screen.findByRole("heading", { name: "My addresses" });
    await userEvent.click(
      screen.getAllByRole("button", { name: /delete/i })[0]
    );

    expect(deleteMutate).not.toHaveBeenCalled();
  });

  it("deletes an address after confirmation", async () => {
    vi.spyOn(window, "confirm").mockReturnValueOnce(true);

    setup();

    await userEvent.click(
      screen.getAllByRole("button", { name: /delete/i })[0]
    );

    await waitFor(() => {
      expect(deleteMutate).toHaveBeenCalledWith(
        addresses[0].id,
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        })
      );
    });
  });

  it("shows a success toast after delete", async () => {
    vi.spyOn(window, "confirm").mockReturnValueOnce(true);

    setup();

    await screen.findByRole("heading", { name: "My addresses" });
    await userEvent.click(
      screen.getAllByRole("button", { name: /delete/i })[0]
    );

    await waitFor(() => expect(deleteMutate).toHaveBeenCalled());

    act(() => {
      deleteMutate.mock.calls[0][1].onSuccess();
    });

    expect(toast.success).toHaveBeenCalledWith("Address deleted successfully.");
  });

  it("shows an error toast when delete fails", async () => {
    vi.spyOn(window, "confirm").mockReturnValueOnce(true);

    setup();

    await screen.findByRole("heading", { name: "My addresses" });
    await userEvent.click(
      screen.getAllByRole("button", { name: /delete/i })[0]
    );

    await waitFor(() => expect(deleteMutate).toHaveBeenCalled());

    act(() => {
      deleteMutate.mock.calls[0][1].onError();
    });

    expect(toast.error).toHaveBeenCalledWith("Unable to delete this address.");
  });

  it("closes the form when deleting the address currently being edited", async () => {
    vi.spyOn(window, "confirm").mockReturnValueOnce(true);

    setup();

    await userEvent.click(screen.getAllByRole("button", { name: /edit/i })[0]);
    expect(await screen.findByText("Edit address")).toBeInTheDocument();

    await userEvent.click(
      screen.getAllByRole("button", { name: /delete/i })[0]
    );
    await waitFor(() => expect(deleteMutate).toHaveBeenCalled());

    act(() => {
      deleteMutate.mock.calls[0][1].onSuccess();
    });

    await waitFor(() => {
      expect(screen.queryByText("Edit address")).not.toBeInTheDocument();
    });
  });
});

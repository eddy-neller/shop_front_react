import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddressCard from "@/features/Shop/components/Address/AddressCard";
import type { ShopAddress } from "@/features/Shop/types/address";
import rawAddresses from "@/features/Shop/__tests__/fixtures/addresses.json";
import { renderComponentQuery } from "@/lib/utils/tests/renderComponent";

const addresses = rawAddresses as ShopAddress[];
const addressWithCompany = addresses[1];
const addressWithoutCompany = addresses[0];

describe("AddressCard", () => {
  const onEdit = vi.fn();
  const onDelete = vi.fn();
  const onSetDefault = vi.fn();

  const setup = (
    address: ShopAddress,
    isDeleting = false,
    isSettingDefault = false
  ) => {
    renderComponentQuery(
      <AddressCard
        address={address}
        onEdit={onEdit}
        onDelete={onDelete}
        onSetDefault={onSetDefault}
        isDeleting={isDeleting}
        isSettingDefault={isSettingDefault}
      />
    );
  };

  it("renders the address name", () => {
    setup(addressWithoutCompany);

    expect(
      screen.getByRole("heading", { name: addressWithoutCompany.name })
    ).toBeInTheDocument();
  });

  it("renders the full name", () => {
    setup(addressWithoutCompany);

    expect(
      screen.getByText(
        `${addressWithoutCompany.firstname} ${addressWithoutCompany.lastname}`
      )
    ).toBeInTheDocument();
  });

  it("renders the address details", () => {
    setup(addressWithoutCompany);

    expect(
      screen.getByText(
        `${addressWithoutCompany.address}, ${addressWithoutCompany.zip} ${addressWithoutCompany.city}, ${addressWithoutCompany.country}`
      )
    ).toBeInTheDocument();
  });

  it("renders the phone", () => {
    setup(addressWithoutCompany);

    expect(
      screen.getByText(`Phone: ${addressWithoutCompany.phone}`)
    ).toBeInTheDocument();
  });

  it("renders the company when provided", () => {
    setup(addressWithCompany);

    expect(
      screen.getByText(`Company: ${addressWithCompany.company}`)
    ).toBeInTheDocument();
  });

  it("does not render the company when null", () => {
    setup(addressWithoutCompany);

    expect(screen.queryByText(/Company:/)).not.toBeInTheDocument();
  });

  it("highlights the default address", () => {
    setup(addressWithoutCompany);

    expect(screen.getByText("Default address")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /set as default/i })
    ).not.toBeInTheDocument();
  });

  it("calls onSetDefault for a secondary address", async () => {
    setup(addressWithCompany);

    await userEvent.click(
      screen.getByRole("button", { name: /set as default/i })
    );

    expect(onSetDefault).toHaveBeenCalledWith(addressWithCompany);
  });

  it("shows the pending state while setting the default address", () => {
    setup(addressWithCompany, false, true);

    expect(screen.getByRole("button", { name: /updating/i })).toBeDisabled();
  });

  it("calls onEdit with the address when clicking Edit", async () => {
    setup(addressWithoutCompany);

    await userEvent.click(screen.getByRole("button", { name: /edit/i }));

    expect(onEdit).toHaveBeenCalledWith(addressWithoutCompany);
  });

  it("calls onDelete with the address when clicking Delete", async () => {
    setup(addressWithoutCompany);

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    expect(onDelete).toHaveBeenCalledWith(addressWithoutCompany);
  });

  it("disables the delete button when isDeleting is true", () => {
    setup(addressWithoutCompany, true);

    expect(screen.getByRole("button", { name: /delete/i })).toBeDisabled();
  });

  it("does not disable the delete button by default", () => {
    setup(addressWithoutCompany);

    expect(screen.getByRole("button", { name: /delete/i })).not.toBeDisabled();
  });
});

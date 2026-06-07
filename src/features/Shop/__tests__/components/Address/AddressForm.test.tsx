import "@/lib/utils/tests/mocks/mockRouterHelper";
import "@/lib/utils/tests/mocks/mockToastHelper";
import { toast } from "@/lib/utils/tests/mocks/mockToastHelper";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi, type Mock } from "vitest";
import { renderComponentQuery } from "@/lib/utils/tests/renderComponent";
import {
  makeAxiosError,
  makeAxiosResponse,
  makeValidationError422,
} from "@/lib/utils/tests/axiosHelper";
import AddressForm from "@/features/Shop/components/Address/AddressForm";
import {
  createAddress,
  updateAddress,
} from "@/features/Shop/lib/api/addresses";
import type { ShopAddress } from "@/features/Shop/types/address";
import rawAddresses from "@/features/Shop/__tests__/fixtures/addresses.json";

vi.mock("@/features/Shop/lib/api/addresses", () => ({
  createAddress: vi.fn(),
  updateAddress: vi.fn(),
  getAddresses: vi.fn(),
  getAddress: vi.fn(),
  deleteAddress: vi.fn(),
}));

const addresses = rawAddresses as ShopAddress[];
const existingAddress = addresses[0];
const existingAddressWithCompany = addresses[1];

const mockCreateAddress = createAddress as Mock;
const mockUpdateAddress = updateAddress as Mock;

const validPayload = {
  name: "Work",
  firstname: "Alice",
  lastname: "Durand",
  address: "10 rue de Rivoli",
  zip: "75004",
  city: "Paris",
  country: "France",
  phone: "+33 1 00 00 00 00",
};

describe("AddressForm", () => {
  const onCancel = vi.fn();
  const onSaved = vi.fn();

  const setup = (address?: ShopAddress | null) => {
    renderComponentQuery(
      <AddressForm address={address} onCancel={onCancel} onSaved={onSaved} />
    );
  };

  const fillForm = async (overrides: Partial<typeof validPayload> = {}) => {
    const user = userEvent.setup();
    const data = { ...validPayload, ...overrides };

    await user.type(screen.getByLabelText(/^label$/i), data.name);
    await user.type(screen.getByLabelText(/^first name$/i), data.firstname);
    await user.type(screen.getByLabelText(/^last name$/i), data.lastname);
    await user.type(screen.getByLabelText(/^street address$/i), data.address);
    await user.type(screen.getByLabelText(/^zip code$/i), data.zip);
    await user.type(screen.getByLabelText(/^city$/i), data.city);
    await user.type(screen.getByLabelText(/^country$/i), data.country);
    await user.type(screen.getByLabelText(/^phone$/i), data.phone);

    return user;
  };

  describe("rendering", () => {
    it("should render all form fields", () => {
      setup();

      expect(screen.getByLabelText(/^label$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^first name$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^last name$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^company$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^street address$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^zip code$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^city$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^country$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^phone$/i)).toBeInTheDocument();
    });

    it("should show the create title when no address is provided", () => {
      setup();

      expect(screen.getByText(/new address/i)).toBeInTheDocument();
    });

    it("should show the edit title when an address is provided", () => {
      setup(existingAddress);

      expect(screen.getByText(/edit address/i)).toBeInTheDocument();
    });

    it("should show the create submit button when no address is provided", () => {
      setup();

      expect(
        screen.getByRole("button", { name: /create address/i })
      ).toBeInTheDocument();
    });

    it("should show the save submit button when an address is provided", () => {
      setup(existingAddress);

      expect(
        screen.getByRole("button", { name: /save changes/i })
      ).toBeInTheDocument();
    });

    it("should pre-fill fields when editing an existing address", () => {
      setup(existingAddress);

      expect(screen.getByLabelText(/^label$/i)).toHaveValue(
        existingAddress.name
      );
      expect(screen.getByLabelText(/^first name$/i)).toHaveValue(
        existingAddress.firstname
      );
      expect(screen.getByLabelText(/^last name$/i)).toHaveValue(
        existingAddress.lastname
      );
      expect(screen.getByLabelText(/^street address$/i)).toHaveValue(
        existingAddress.address
      );
      expect(screen.getByLabelText(/^zip code$/i)).toHaveValue(
        existingAddress.zip
      );
      expect(screen.getByLabelText(/^city$/i)).toHaveValue(existingAddress.city);
      expect(screen.getByLabelText(/^country$/i)).toHaveValue(
        existingAddress.country
      );
      expect(screen.getByLabelText(/^phone$/i)).toHaveValue(
        existingAddress.phone
      );
    });

    it("should pre-fill the company field when editing an address with a company", () => {
      setup(existingAddressWithCompany);

      expect(screen.getByLabelText(/^company$/i)).toHaveValue(
        existingAddressWithCompany.company
      );
    });
  });

  describe("validation", () => {
    it("should show required field errors on empty submission", async () => {
      const user = userEvent.setup();
      setup();

      await user.click(
        screen.getByRole("button", { name: /create address/i })
      );

      await waitFor(() => {
        expect(
          screen.getByText(/address label is required/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/first name is required/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/last name is required/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/street address is required/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/zip code is required/i)).toBeInTheDocument();
        expect(screen.getByText(/city is required/i)).toBeInTheDocument();
        expect(screen.getByText(/country is required/i)).toBeInTheDocument();
        expect(screen.getByText(/phone is required/i)).toBeInTheDocument();
      });
    });

    it("should show a min-length error when a required field is too short", async () => {
      const user = userEvent.setup();
      setup();

      await user.type(screen.getByLabelText(/^label$/i), "A");
      await user.click(
        screen.getByRole("button", { name: /create address/i })
      );

      await waitFor(() => {
        expect(
          screen.getByText(/address label must be at least 2 characters/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe("cancel button", () => {
    it("should call onCancel when clicking the cancel button", async () => {
      const user = userEvent.setup();
      setup();

      await user.click(screen.getByRole("button", { name: /cancel/i }));

      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe("create mode", () => {
    it("should call createAddress with the correct payload", async () => {
      mockCreateAddress.mockResolvedValueOnce(existingAddress);
      setup();

      const user = await fillForm();
      await user.click(
        screen.getByRole("button", { name: /create address/i })
      );

      await waitFor(() => {
        expect(mockCreateAddress).toHaveBeenCalledWith(
          expect.objectContaining({
            name: validPayload.name,
            firstname: validPayload.firstname,
            lastname: validPayload.lastname,
            address: validPayload.address,
            zip: validPayload.zip,
            city: validPayload.city,
            country: validPayload.country,
            phone: validPayload.phone,
            company: null,
          })
        );
      });
    });

    it("should send a trimmed company value when filled", async () => {
      mockCreateAddress.mockResolvedValueOnce(existingAddressWithCompany);
      setup();

      const user = await fillForm();
      await user.type(
        screen.getByLabelText(/^company$/i),
        existingAddressWithCompany.company!
      );
      await user.click(
        screen.getByRole("button", { name: /create address/i })
      );

      await waitFor(() => {
        expect(mockCreateAddress).toHaveBeenCalledWith(
          expect.objectContaining({
            company: existingAddressWithCompany.company,
          })
        );
      });
    });

    it("should show a success toast and call onSaved on creation", async () => {
      mockCreateAddress.mockResolvedValueOnce(existingAddress);
      setup();

      const user = await fillForm();
      await user.click(
        screen.getByRole("button", { name: /create address/i })
      );

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "Address created successfully."
        );
        expect(onSaved).toHaveBeenCalledTimes(1);
      });
    });

    it("should reset the form after a successful creation", async () => {
      mockCreateAddress.mockResolvedValueOnce(existingAddress);
      setup();

      const user = await fillForm();
      await user.click(
        screen.getByRole("button", { name: /create address/i })
      );

      await waitFor(() => {
        expect(onSaved).toHaveBeenCalledTimes(1);
      });

      expect(screen.getByLabelText(/^label$/i)).toHaveValue("");
      expect(screen.getByLabelText(/^first name$/i)).toHaveValue("");
    });

    it("should map 422 violations onto form fields on creation", async () => {
      const violations = [
        { propertyPath: "name", message: "This label is already taken." },
      ];
      mockCreateAddress.mockRejectedValueOnce(
        makeValidationError422(violations)
      );
      setup();

      const user = await fillForm();
      await user.click(
        screen.getByRole("button", { name: /create address/i })
      );

      await waitFor(() => {
        expect(
          screen.getByText(/this label is already taken/i)
        ).toBeInTheDocument();
      });
    });

    it("should show an error toast on creation failure", async () => {
      mockCreateAddress.mockRejectedValueOnce(
        makeAxiosResponse(null, 500).data
      );
      setup();

      const user = await fillForm();
      await user.click(
        screen.getByRole("button", { name: /create address/i })
      );

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Unable to create this address."
        );
      });
    });

    it("should show a clear toast when the address limit is reached", async () => {
      mockCreateAddress.mockRejectedValueOnce(
        makeAxiosError(409, "Conflict", {
          message: "A customer cannot have more than 5 addresses.",
        })
      );
      setup();

      const user = await fillForm();
      await user.click(
        screen.getByRole("button", { name: /create address/i })
      );

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Address limit reached", {
          description:
            "You can have up to 5 addresses. Delete an existing address before adding a new one.",
        });
      });
    });
  });

  describe("edit mode", () => {
    it("should call updateAddress with the correct id and payload", async () => {
      mockUpdateAddress.mockResolvedValueOnce(existingAddress);
      setup(existingAddress);

      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: /save changes/i }));

      await waitFor(() => {
        expect(mockUpdateAddress).toHaveBeenCalledWith(
          existingAddress.id,
          expect.objectContaining({
            name: existingAddress.name,
            firstname: existingAddress.firstname,
            lastname: existingAddress.lastname,
            address: existingAddress.address,
            zip: existingAddress.zip,
            city: existingAddress.city,
            country: existingAddress.country,
            phone: existingAddress.phone,
          })
        );
      });
    });

    it("should show a success toast and call onSaved on update", async () => {
      mockUpdateAddress.mockResolvedValueOnce(existingAddress);
      setup(existingAddress);

      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: /save changes/i }));

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          "Address updated successfully."
        );
        expect(onSaved).toHaveBeenCalledTimes(1);
      });
    });

    it("should map 422 violations onto form fields on update", async () => {
      const violations = [
        { propertyPath: "zip", message: "Invalid zip code." },
      ];
      mockUpdateAddress.mockRejectedValueOnce(
        makeValidationError422(violations)
      );
      setup(existingAddress);

      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: /save changes/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid zip code/i)).toBeInTheDocument();
      });
    });

    it("should show an error toast on update failure", async () => {
      mockUpdateAddress.mockRejectedValueOnce(new Error("Network error"));
      setup(existingAddress);

      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: /save changes/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Unable to update this address."
        );
      });
    });
  });
});

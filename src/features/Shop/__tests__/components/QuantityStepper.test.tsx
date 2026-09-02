import { useState } from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { renderComponentQuery } from "@/lib/utils/tests/renderComponent";
import QuantityStepper, {
  MAX_QUANTITY,
  MIN_QUANTITY,
  clampQuantity,
} from "@/features/Shop/components/QuantityStepper";

describe("QuantityStepper", () => {
  const setup = (overrides?: {
    value?: number;
    disabled?: boolean;
    min?: number;
    max?: number;
  }) => {
    const onChange = vi.fn();
    const utils = renderComponentQuery(
      <QuantityStepper
        value={overrides?.value ?? 1}
        onChange={onChange}
        disabled={overrides?.disabled}
        min={overrides?.min}
        max={overrides?.max}
      />
    );
    return { onChange, ...utils };
  };

  // Wrapper contrôlé pour tester la saisie clavier de façon réaliste.
  const Controlled = ({ initial = 1 }: { initial?: number }) => {
    const [value, setValue] = useState(initial);
    return <QuantityStepper value={value} onChange={setValue} />;
  };

  describe("rendering", () => {
    it("should render the current value and accessible labels", async () => {
      setup({ value: 3 });

      expect(await screen.findByRole("spinbutton")).toHaveValue(3);
      expect(
        screen.getByRole("button", { name: /decrease quantity/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /increase quantity/i })
      ).toBeInTheDocument();
    });
  });

  describe("button interactions", () => {
    it("should call onChange with value minus one when decreasing", async () => {
      const user = userEvent.setup();
      const { onChange } = setup({ value: 4 });

      await user.click(
        screen.getByRole("button", { name: /decrease quantity/i })
      );

      expect(onChange).toHaveBeenCalledWith(3);
    });

    it("should call onChange with value plus one when increasing", async () => {
      const user = userEvent.setup();
      const { onChange } = setup({ value: 4 });

      await user.click(
        screen.getByRole("button", { name: /increase quantity/i })
      );

      expect(onChange).toHaveBeenCalledWith(5);
    });
  });

  describe("bounds", () => {
    it("should disable the decrease button at the minimum", () => {
      setup({ value: MIN_QUANTITY });

      expect(
        screen.getByRole("button", { name: /decrease quantity/i })
      ).toBeDisabled();
    });

    it("should disable the increase button at the maximum", () => {
      setup({ value: MAX_QUANTITY });

      expect(
        screen.getByRole("button", { name: /increase quantity/i })
      ).toBeDisabled();
    });

    it("should clamp typed values above the maximum", async () => {
      const user = userEvent.setup();
      renderComponentQuery(<Controlled />);

      const input = await screen.findByRole("spinbutton");
      await user.type(input, "999");

      await waitFor(() => expect(input).toHaveValue(MAX_QUANTITY));
    });
  });

  describe("disabled state", () => {
    it("should disable every control when disabled", () => {
      setup({ value: 5, disabled: true });

      expect(
        screen.getByRole("button", { name: /decrease quantity/i })
      ).toBeDisabled();
      expect(
        screen.getByRole("button", { name: /increase quantity/i })
      ).toBeDisabled();
      expect(screen.getByRole("spinbutton")).toBeDisabled();
    });
  });

  describe("clampQuantity", () => {
    it("should keep values within the default bounds", () => {
      expect(clampQuantity(0)).toBe(MIN_QUANTITY);
      expect(clampQuantity(150)).toBe(MAX_QUANTITY);
      expect(clampQuantity(42)).toBe(42);
    });

    it("should respect custom bounds", () => {
      expect(clampQuantity(1, 5, 10)).toBe(5);
      expect(clampQuantity(20, 5, 10)).toBe(10);
    });
  });
});

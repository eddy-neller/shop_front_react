import { Minus, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 99;

export const clampQuantity = (
  value: number,
  min: number = MIN_QUANTITY,
  max: number = MAX_QUANTITY
) => Math.min(max, Math.max(min, value));

interface QuantityStepperProps {
  value: number;
  onChange: (quantity: number) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
  className?: string;
}

const QuantityStepper = ({
  value,
  onChange,
  disabled = false,
  min = MIN_QUANTITY,
  max = MAX_QUANTITY,
  className,
}: QuantityStepperProps) => {
  const { t } = useTranslation("shop-common");
  const setClamped = (next: number) => onChange(clampQuantity(next, min, max));

  return (
    <div
      className={cn(
        "inline-flex h-10 items-stretch overflow-hidden rounded-md border border-input bg-background shadow-sm",
        className
      )}
    >
      <button
        type="button"
        aria-label={t("quantity.decrease")}
        disabled={disabled || value <= min}
        onClick={() => setClamped(value - 1)}
        className="flex w-10 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-40"
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <Input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        aria-label={t("quantity.label")}
        className="h-full w-14 rounded-none border-0 bg-transparent px-0 text-center text-base font-medium shadow-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        onChange={(event) => {
          const next = Number(event.target.value);
          if (Number.isInteger(next)) {
            setClamped(next);
          }
        }}
      />
      <button
        type="button"
        aria-label={t("quantity.increase")}
        disabled={disabled || value >= max}
        onClick={() => setClamped(value + 1)}
        className="flex w-10 items-center justify-center text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-40"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
};

export default QuantityStepper;

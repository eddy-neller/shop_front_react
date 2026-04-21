import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type LoadingButtonProps = ButtonProps & {
  isBusy?: boolean;
  label: React.ReactNode;
  busyLabel?: React.ReactNode;
  icon?: React.ReactNode;
};

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  (
    {
      isBusy = false,
      label,
      busyLabel,
      icon,
      disabled,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    return (
      <Button
        {...rest}
        ref={ref}
        disabled={disabled || isBusy}
        aria-busy={isBusy || undefined}
        className={className}
      >
        {isBusy ? (
          <>
            <Spinner className="mr-2" />
            {busyLabel ?? label}
          </>
        ) : (
          <>
            {icon && (
              <span className="mr-2 inline-flex items-center">{icon}</span>
            )}
            {label}
          </>
        )}
        {children}
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";

export default LoadingButton;

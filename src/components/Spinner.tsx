import React from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { Spinner as ShadcnSpinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  loading: boolean;
  /** Affiche un overlay plein écran centré */
  fullscreen?: boolean;
  /** Message sous le loader */
  message?: string;
  /** Taille du loader */
  size?: number;
  /** Couleur CSS du loader */
  color?: string;
  /** Backdrop (utile avec fullscreen) */
  backdrop?: boolean;
  /** Classe supplémentaire sur le conteneur */
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  loading,
  fullscreen = false,
  message,
  size = 64,
  color = "hsl(var(--primary))",
  backdrop = true,
  className = "",
}) => {
  const { t } = useTranslation("common");

  if (!loading) return null;

  const displayMessage = message ?? t("spinner.loading");

  const Content = (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        fullscreen
          ? "fixed inset-0 z-[1080] grid place-items-center"
          : "grid min-h-[40vh] place-items-center",
        className
      )}
    >
      {fullscreen && backdrop && (
        <div
          className="absolute inset-0 bg-black/35 backdrop-blur-sm"
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "relative flex flex-col items-center rounded-lg bg-card px-6 py-5 text-card-foreground shadow-xl",
          !fullscreen && "shadow-md"
        )}
      >
        <ShadcnSpinner
          className="animate-spin"
          style={{
            width: size,
            height: size,
            color,
          }}
        />
        {displayMessage && (
          <div className="mt-3 font-semibold">{displayMessage}</div>
        )}
      </div>
    </div>
  );

  return fullscreen ? createPortal(Content, document.body) : Content;
};

export default Spinner;

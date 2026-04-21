import { AxiosError } from "axios";
import { toast } from "sonner";
import { UseFormSetError } from "react-hook-form";

export interface Violation {
  propertyPath: string;
  message: string;
}

/**
 * Centralized error handler for Axios errors
 * Handles common error patterns like 429 (rate limit) and 422 (validation errors)
 */
export const handleAxiosError = (
  error: unknown,
  setError?: UseFormSetError<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  showToast?: boolean,
  defaultMessage?: string
): void => {
  if (!(error instanceof AxiosError)) {
    if (showToast) {
      toast.error(defaultMessage || "Une erreur est survenue");
    }
    return;
  }

  const response = error.response;

  if (response?.status === 429) {
    const message = "Trop de requêtes. Veuillez réessayer plus tard.";
    if (showToast) {
      toast.error("Limite de requêtes atteinte", {
        description: message,
      });
    }
    return;
  }

  if (response?.status === 422 && response.data?.violations) {
    const violations: Violation[] = response.data.violations;

    if (setError) {
      violations.forEach((violation: Violation) => {
        setError(violation.propertyPath as string, {
          type: "server",
          message: violation.message,
        });
      });
    }

    if (showToast) {
      toast.error("Erreur de validation", {
        description: "Veuillez vérifier les champs du formulaire.",
      });
    }
    return;
  }

  if (response?.status === 403) {
    const message = "Vous n'avez pas la permission d'effectuer cette action.";
    if (showToast) {
      toast.error("Accès refusé", {
        description: message,
      });
    }
    return;
  }

  if (response?.status === 404) {
    const message = "La ressource demandée n'a pas été trouvée.";
    if (showToast) {
      toast.error("Ressource introuvable", {
        description: message,
      });
    }
    return;
  }

  if (response?.status && response.status >= 500) {
    const message =
      "Une erreur serveur est survenue. Veuillez réessayer plus tard.";
    if (showToast) {
      toast.error("Erreur serveur", {
        description: message,
      });
    }
    return;
  }

  if (!response) {
    const message = "Erreur réseau. Veuillez vérifier votre connexion.";
    if (showToast) {
      toast.error("Erreur de connexion", {
        description: message,
      });
    }
    return;
  }

  if (showToast) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorMessage = (response.data as any)?.message || defaultMessage;

    toast.error("Erreur", {
      description: errorMessage || "Une erreur est survenue.",
    });
  }
};

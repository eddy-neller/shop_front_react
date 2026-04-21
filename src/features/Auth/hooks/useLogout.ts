import { useCallback } from "react";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useAbility } from "@/contexts/AbilityContext";
import { defineAbilityFor } from "@/lib/utils/ability";
import { useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/lib/utils/queryKeys";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { removeAuthLogoutListener } from "@/features/Auth/utils/authEventListener";

export const useLogout = () => {
  const signOut = useSignOut();
  const ability = useAbility();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const clearAndRedirect = useCallback(
    (reason?: string) => {
      removeAuthLogoutListener();

      queryClient.removeQueries({ queryKey: userKeys.all });
      signOut();
      ability.update(defineAbilityFor(null).rules);

      if (reason) {
        const logoutMessages: Record<
          string,
          {
            type: "success" | "warning" | "error" | "info";
            title: string;
            message: string;
          }
        > = {
          expired: {
            type: "warning",
            title: "Session expirée",
            message: "Votre session a expiré. Veuillez vous reconnecter.",
          },
          invalid: {
            type: "error",
            title: "Session invalide",
            message:
              "Votre token de session est invalide. Veuillez vous reconnecter.",
          },
          missing: {
            type: "info",
            title: "Authentification requise",
            message: "Veuillez vous connecter pour accéder à cette page.",
          },
          others: {
            type: "error",
            title: "Accès non autorisé",
            message:
              "Vous n'êtes pas autorisé à accéder à cette ressource. Veuillez vous reconnecter.",
          },
        };

        const config = logoutMessages[reason] || logoutMessages.others;
        toast[config.type](config.title, {
          description: config.message,
        });
      }

      navigate("/login", { replace: true });
    },
    [ability, navigate, queryClient, signOut]
  );

  const logout = useCallback(() => {
    clearAndRedirect();
  }, [clearAndRedirect]);

  return { logout, clearAndRedirect };
};

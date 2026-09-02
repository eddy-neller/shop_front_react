import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import { useAbility } from "@/contexts/AbilityContext";
import { defineAbilityFor } from "@/lib/utils/ability";
import { login } from "@/features/Auth/lib/api/auth";
import type { JwtPayload, LoginCredentials } from "@/features/Auth/types/auth";
import { setupAuthLogoutListener } from "@/features/Auth/utils/authEventListener";
import { useLogout } from "@/features/Auth/hooks/useLogout";

export const useLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const signIn = useSignIn();
  const ability = useAbility();
  const { clearAndRedirect } = useLogout();

  const mutation = useMutation({
    mutationFn: (data: LoginCredentials) => login(data),
    onSuccess: (response) => {
      try {
        const { accessToken } = response;
        const decoded: JwtPayload = jwtDecode(accessToken);

        const isLogged = signIn({
          auth: {
            token: accessToken,
            type: "Bearer",
          },
          userState: {
            id: decoded.sub,
            roles: decoded.roles,
          },
        });

        if (!isLogged) {
          throw new Error("signIn returned false (storage not written)");
        }

        ability.update(defineAbilityFor(decoded).rules);
        setupAuthLogoutListener(clearAndRedirect);

        const requestedPath = (location.state as { from?: string } | null)
          ?.from;

        navigate(requestedPath?.startsWith("/") ? requestedPath : "/user", {
          replace: true,
        });
      } catch {
        toast.error("Connexion impossible", {
          description:
            "Une erreur est survenue lors de la création de la session.",
        });
      }
    },
    onError: () => {
      toast.error("Identifiants invalides", {
        description: "Vérifiez votre email et votre mot de passe.",
      });
    },
  });

  return {
    login: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};

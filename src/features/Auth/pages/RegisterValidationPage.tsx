import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { XCircle, Mail, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { validateActivation } from "@/features/Auth/lib/api/auth";
import RegisterActivationEmailResendForm from "@/features/Auth/components/RegisterActivationEmailResendForm";
import type { ValidateActivationPayload } from "@/features/Auth/types/auth";
import { useTranslation } from "react-i18next";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";

export default function RegisterValidationPage() {
  const { setBreadcrumbItems } = useBreadcrumb();
  const { t } = useTranslation("auth-registerValidation");
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const noToken = !token.trim();
  const [isTokenInvalid, setIsTokenInvalid] = useState<boolean | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: ValidateActivationPayload) =>
      validateActivation(payload),
    onSuccess: () => {
      // Stocker un flag dans sessionStorage pour indiquer que la validation a réussi
      if (typeof window !== "undefined") {
        sessionStorage.setItem("registerValidationSuccess", "true");
      }
      navigate("/register/validation/success", { state: {} });
    },
    onError: () => {
      setIsTokenInvalid(true);
    },
  });

  useEffect(() => {
    setBreadcrumbItems([
      {
        key: "register",
        linkProps: { to: "/register" },
        title: t("breadcrumb.register"),
      },
      {
        key: "register-validation",
        title: t("validation.breadcrumb"),
        active: true,
      },
    ]);
  }, [setBreadcrumbItems, t]);

  // Vérifier le token au chargement
  useEffect(() => {
    if (noToken) {
      setIsTokenInvalid(true);
    } else {
      mutation.mutate({ token } as ValidateActivationPayload);
    }
  }, [noToken, token]);

  // Afficher le loading
  if (isTokenInvalid === null) {
    return (
      <>
        <Helmet>
          <title>{t("validation.helmet.verify.title")}</title>
          <meta
            name="description"
            content={t("validation.helmet.verify.description")}
          />
        </Helmet>

        <div className="bg-gray-50 min-h-screen">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card
                className="shadow-lg border border-blue-100"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(37, 99, 235, 0.08) 0%, #fff 100%)",
                }}
              >
                <CardContent className="p-8">
                  {mutation.isPending && (
                    <div
                      role="status"
                      className="text-center"
                      aria-live="polite"
                      aria-busy="true"
                    >
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                      <p className="text-muted-foreground mt-3 mb-0">
                        {t("validation.pending")}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Si le token est invalide
  return (
    <>
      <Helmet>
        <title>{t("validation.helmet.invalid.title")}</title>
        <meta
          name="description"
          content={t("validation.helmet.invalid.description")}
        />
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card
              className="shadow-lg border border-blue-100"
              style={{
                background:
                  "linear-gradient(180deg, rgba(37, 99, 235, 0.08) 0%, #fff 100%)",
              }}
            >
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="rounded-full bg-red-100 dark:bg-red-900 inline-flex items-center justify-center w-16 h-16 mb-4">
                    <XCircle className="text-red-600 dark:text-red-400 h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    {t("validation.invalid.title")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("validation.invalid.text")}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <Card className="border-0 shadow-sm h-full">
                    <CardContent className="p-4">
                      <div className="font-semibold mb-3">
                        {t("validation.resend.title")}
                      </div>
                      <RegisterActivationEmailResendForm />
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm h-full">
                    <CardContent className="p-4 flex flex-col">
                      <div className="font-semibold mb-3">
                        {t("validation.contact.title")}
                      </div>
                      <p className="text-muted-foreground text-sm mb-4">
                        {t("validation.contact.text")}
                      </p>
                      <div>
                        <Button
                          asChild
                          variant="default"
                          className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Link to="/contact" className="block">
                            <Mail className="mr-2 h-4 w-4" />
                            {t("validation.contact.cta")}
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

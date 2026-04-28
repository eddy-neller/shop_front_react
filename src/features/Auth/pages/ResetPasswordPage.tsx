import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { XCircle, Loader2, Lock, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMutation } from "@tanstack/react-query";
import { checkPasswordResetToken } from "@/features/Auth/lib/api/auth";
import ResetPasswordConfirmForm from "@/features/Auth/components/ResetPasswordConfirmForm";
import { useTranslation } from "react-i18next";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";

export default function ResetPasswordPage() {
  const { setBreadcrumbItems } = useBreadcrumb();
  const { t } = useTranslation("auth-forgotPassword");

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const noToken = !token.trim();
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  const mutation = useMutation({
    mutationFn: (token: string) => checkPasswordResetToken({ token }),
    onSuccess: () => {
      setIsTokenValid(true);
    },
    onError: () => {
      setIsTokenValid(false);
    },
  });

  useEffect(() => {
    setBreadcrumbItems([
      {
        key: "forgot-password",
        linkProps: { to: "/forgot-password" },
        title: t("breadcrumb.forgot"),
      },
      { key: "reset-password", title: t("breadcrumb.reset"), active: true },
    ]);
  }, [setBreadcrumbItems, t]);

  // Vérifier le token au chargement
  useEffect(() => {
    if (!noToken) {
      mutation.mutate(token);
    } else {
      setIsTokenValid(false);
    }
  }, [noToken, token]);

  // Afficher la vérification
  if (isTokenValid === null) {
    return (
      <>
        <Helmet>
          <title>{t("reset.helmet.verify.title")}</title>
          <meta
            name="description"
            content={t("reset.helmet.verify.description")}
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
                        {t("reset.verify.message")}
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
  if (!isTokenValid) {
    return (
      <>
        <Helmet>
          <title>{t("reset.helmet.invalid.title")}</title>
          <meta
            name="description"
            content={t("reset.helmet.invalid.description")}
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
                  <div className="text-center">
                    <div className="rounded-full bg-red-100 dark:bg-red-900 inline-flex items-center justify-center w-16 h-16 mb-4">
                      <XCircle className="text-red-600 dark:text-red-400 h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      {t("reset.invalid.title")}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {t("reset.invalid.message")}
                    </p>
                    <Button
                      asChild
                      variant="default"
                      className="rounded-full px-6 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Link to="/forgot-password">
                        {t("reset.invalid.button")}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Si le token est valide, afficher le formulaire
  return (
    <>
      <Helmet>
        <title>{t("forms.resetConfirm.helmet.title")}</title>
        <meta
          name="description"
          content={t("forms.resetConfirm.helmet.description")}
        />
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Colonne principale */}
              <div className="lg:col-span-2">
                <Card
                  className="shadow-lg border border-blue-100"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(37, 99, 235, 0.08) 0%, #fff 100%)",
                  }}
                >
                  <CardContent className="p-6">
                    {/* Header / Hero */}
                    <div className="flex items-center mb-6">
                      <div className="rounded-full bg-green-500 inline-flex items-center justify-center mr-3 w-10 h-10">
                        <Lock className="text-white h-5 w-5" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold mb-1">
                          {t("resetPassword.hero.title")}
                        </h1>
                        <p className="text-muted-foreground">
                          {t("resetPassword.hero.description.prefix")}{" "}
                          <strong>
                            {t("resetPassword.hero.description.brand")}
                          </strong>
                          {t("resetPassword.hero.description.suffix")}
                        </p>
                      </div>
                    </div>

                    {/* Formulaire de confirmation */}
                    <ResetPasswordConfirmForm token={token} />

                    {/* Note de sécurité */}
                    <Alert className="mt-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        <strong>{t("resetPassword.securityNote.title")}</strong>{" "}
                        {t("resetPassword.securityNote.message")}
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </div>

              {/* Colonne d'information */}
              <div className="lg:col-span-1">
                <Card
                  className="h-full shadow-lg border border-blue-100"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(37, 99, 235, 0.08) 0%, #fff 100%)",
                  }}
                >
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">
                      {t("resetPassword.requirements.title")}
                    </h2>
                    <div className="mb-4">
                      <p className="text-muted-foreground text-sm mb-3">
                        {t("resetPassword.requirements.subtitle")}
                      </p>
                      <ul className="text-muted-foreground text-sm space-y-2">
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>
                            {t("resetPassword.requirements.items.length")}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>
                            {t("resetPassword.requirements.items.uppercase")}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>
                            {t("resetPassword.requirements.items.lowercase")}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>
                            {t("resetPassword.requirements.items.number")}
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>
                            {t("resetPassword.requirements.items.special")}
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                      <div className="text-sm text-muted-foreground">
                        <strong>
                          {t("resetPassword.requirements.tip.title")}
                        </strong>
                        <p className="mt-1">
                          {t("resetPassword.requirements.tip.message1")}
                        </p>
                        <p className="mt-1">
                          {t("resetPassword.requirements.tip.message2")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

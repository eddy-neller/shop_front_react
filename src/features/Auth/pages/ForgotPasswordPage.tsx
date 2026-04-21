import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  Lock,
  Shield,
  Users,
  Smile,
  CheckCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import ResetPasswordRequestForm from "@/features/Auth/components/ResetPasswordRequestForm";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useEffect } from "react";

export default function ForgotPasswordPage() {
  const { setBreadcrumbItems } = useBreadcrumb();
  const { t } = useTranslation("auth-forgotPassword");

  useEffect(() => {
    setBreadcrumbItems([
      { key: "forgot-password", title: t("breadcrumb.forgot"), active: true },
    ]);
  }, [setBreadcrumbItems, t]);

  return (
    <>
      <Helmet>
        <title>{t("forms.resetRequest.helmet.title")}</title>
        <meta
          name="description"
          content={t("forms.resetRequest.helmet.description")}
        />
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Colonne formulaire */}
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
                      <div className="rounded-full bg-yellow-500 inline-flex items-center justify-center mr-3 w-10 h-10">
                        <Lock className="text-white h-5 w-5" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold mb-1">
                          {t("forgot.hero.title")}
                        </h1>
                        <p className="text-muted-foreground">
                          {t("forgot.hero.description")}
                        </p>
                      </div>
                    </div>

                    {/* Formulaire de réinitialisation */}
                    <ResetPasswordRequestForm />

                    {/* Lien retour */}
                    <div className="flex justify-center mt-4 text-sm">
                      <Link
                        to="/login"
                        className="text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline flex items-center"
                      >
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        {t("forgot.links.backToSignIn")}
                      </Link>
                    </div>

                    {/* Mentions confiance */}
                    <div className="flex items-center justify-between flex-wrap gap-2 mt-6 pt-6 border-t">
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Lock className="mr-2 h-4 w-4" />
                        <span>{t("forgot.trust.secure")}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                        <span>{t("forgot.trust.nospam")}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Colonne "Pourquoi réinitialiser ?" */}
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
                      {t("forgot.why.title")}
                    </h2>
                    <div className="space-y-4 mb-6">
                      <div className="flex gap-3">
                        <Shield className="mt-1 h-5 w-5 text-blue-600 flex-shrink-0" />
                        <div>
                          <div className="font-semibold mb-1">
                            {t("forgot.why.items.security.title")}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {t("forgot.why.items.security.text")}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Lock className="mt-1 h-5 w-5 text-yellow-500 flex-shrink-0" />
                        <div>
                          <div className="font-semibold mb-1">
                            {t("forgot.why.items.recovery.title")}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {t("forgot.why.items.recovery.text")}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Users className="mt-1 h-5 w-5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold mb-1">
                            {t("forgot.why.items.support.title")}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {t("forgot.why.items.support.text")}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Smile className="mt-1 h-5 w-5 text-green-600 flex-shrink-0" />
                        <div>
                          <div className="font-semibold mb-1">
                            {t("forgot.why.items.peace.title")}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {t("forgot.why.items.peace.text")}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          {t("forgot.stats.resetRate")}
                        </span>
                        <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                          99.9%
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("forgot.stats.caption")}
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

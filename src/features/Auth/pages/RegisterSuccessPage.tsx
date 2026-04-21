import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, Mail, Clock, LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";

export default function RegisterSuccessPage() {
  const { setBreadcrumbItems } = useBreadcrumb();
  const { t } = useTranslation("auth-register");
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Récupérer l'email depuis sessionStorage
    if (typeof window !== "undefined") {
      const storedEmail = sessionStorage.getItem("registerEmail");
      if (storedEmail) {
        setEmail(storedEmail);
        sessionStorage.removeItem("registerEmail");
      } else {
        navigate("/register", { replace: true });
      }
    }
  }, [navigate]);

  useEffect(() => {
    setBreadcrumbItems([
      {
        key: "register",
        linkProps: { to: "/register" },
        title: t("breadcrumb.register"),
      },
      { key: "register-success", active: true, title: t("breadcrumb.success") },
    ]);
  }, [setBreadcrumbItems, t]);

  if (!email) {
    return null; // Ou un loader pendant la redirection
  }

  return (
    <>
      <Helmet>
        <title>{t("forms.registerSuccess.helmet.title")}</title>
        <meta
          name="description"
          content={t("forms.registerSuccess.helmet.description")}
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
                <div className="text-center mb-6">
                  <div className="rounded-full bg-green-100 dark:bg-green-900 inline-flex items-center justify-center w-16 h-16 mb-4">
                    <CheckCircle className="text-green-600 dark:text-green-400 h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    {t("registerSuccess.hero.title")}
                  </h3>
                  <p className="text-muted-foreground">
                    {t("registerSuccess.hero.subtitlePrefix")}{" "}
                    <strong>{email}</strong>
                  </p>
                </div>

                <div className="mt-6 mb-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-1 h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm">
                        <strong>{t("registerSuccess.steps.mail.title")}</strong>{" "}
                        {t("registerSuccess.steps.mail.text")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="mt-1 h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm">
                        {t("registerSuccess.steps.expiry.prefix")}{" "}
                        <strong>
                          {t("registerSuccess.steps.expiry.highlight")}
                        </strong>
                        {t("registerSuccess.steps.expiry.suffix")}
                      </p>
                    </div>
                  </div>
                </div>

                <Alert className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                  <AlertDescription className="text-sm">
                    <strong>{t("registerSuccess.alert.title")}</strong>{" "}
                    {t("registerSuccess.alert.message")}
                  </AlertDescription>
                </Alert>

                <div className="text-center">
                  <Button
                    asChild
                    variant="default"
                    className="rounded-full px-6 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Link to="/login">
                      <LogIn className="mr-2 h-4 w-4" />
                      {t("registerSuccess.cta")}
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

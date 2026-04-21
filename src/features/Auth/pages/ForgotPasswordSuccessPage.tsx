import { useEffect, useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Mail,
  Clock,
  ArrowLeft,
  Shield,
  Users,
  Smile,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";

export default function ForgotPasswordSuccessPage() {
  const { setBreadcrumbItems } = useBreadcrumb();
  const { t } = useTranslation("auth-forgotPassword");
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    // Récupérer l'email depuis sessionStorage
    const checkValidation = () => {
      if (typeof window !== "undefined") {
        const storedEmail = sessionStorage.getItem("forgotPasswordEmail");
        if (storedEmail) {
          setEmail(storedEmail);
          sessionStorage.removeItem("forgotPasswordEmail");
        } else {
          navigate("/forgot-password", { replace: true });
        }
      }
    };

    // Utiliser requestAnimationFrame pour s'assurer que le DOM est prêt
    requestAnimationFrame(() => {
      requestAnimationFrame(checkValidation);
    });
  }, [navigate]);

  useEffect(() => {
    setBreadcrumbItems([
      {
        key: "forgot-password",
        linkProps: { to: "/forgot-password" },
        title: t("breadcrumb.forgot"),
      },
      {
        key: "forgot-password-success",
        title: t("breadcrumb.success"),
        active: true,
      },
    ]);
  }, [setBreadcrumbItems, t]);

  if (!email) {
    return null; // Ou un loader pendant la redirection
  }

  return (
    <>
      <Helmet>
        <title>{t("forgot.success.helmet.title")}</title>
        <meta
          name="description"
          content={t("forgot.success.helmet.description")}
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
                        <CheckCircle className="text-white h-5 w-5" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold mb-1">
                          {t("forgot.success.hero.title")}
                        </h1>
                        <p className="text-muted-foreground">
                          {t("forgot.success.hero.subtitlePrefix")}{" "}
                          <strong>{email}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Message de succès */}
                    <div className="text-center mb-6">
                      <Mail className="text-blue-600 mx-auto mb-4 h-12 w-12" />
                      <h5 className="mb-3 font-semibold">
                        {t("forgot.success.message.title")}
                      </h5>
                      <p className="text-muted-foreground mb-4">
                        {t("forgot.success.message.text")}
                      </p>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-center text-muted-foreground text-sm mb-2">
                          <Clock className="mr-2 h-4 w-4" />
                          <span>{t("forgot.success.expiry")}</span>
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {t("forgot.success.notReceived.check")}{" "}
                          <Link
                            to="/forgot-password"
                            className="text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline"
                          >
                            {t("forgot.success.notReceived.requestLink")}
                          </Link>
                          .
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link to="/login">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          {t("forgot.success.actions.backToSignIn")}
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link to="/forgot-password">
                          <Mail className="mr-2 h-4 w-4" />
                          {t("forgot.success.actions.sendAgain")}
                        </Link>
                      </Button>
                    </div>

                    {/* Mentions confiance */}
                    <div className="flex items-center justify-between flex-wrap gap-2 mt-6 pt-6 border-t">
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>{t("forgot.success.trust.secure")}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                        <span>{t("forgot.success.trust.nospam")}</span>
                      </div>
                    </div>
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
                      {t("forgot.success.next.title")}
                    </h2>
                    <div className="space-y-4 mb-6">
                      <div className="flex gap-3">
                        <Mail className="mt-1 h-5 w-5 text-blue-600 flex-shrink-0" />
                        <div>
                          <div className="font-semibold mb-1">
                            {t("forgot.success.next.items.check.title")}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {t("forgot.success.next.items.check.text")}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Shield className="mt-1 h-5 w-5 text-yellow-500 flex-shrink-0" />
                        <div>
                          <div className="font-semibold mb-1">
                            {t("forgot.success.next.items.link.title")}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {t("forgot.success.next.items.link.text")}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Users className="mt-1 h-5 w-5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold mb-1">
                            {t("forgot.success.next.items.set.title")}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {t("forgot.success.next.items.set.text")}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Smile className="mt-1 h-5 w-5 text-green-600 flex-shrink-0" />
                        <div>
                          <div className="font-semibold mb-1">
                            {t("forgot.success.next.items.signin.title")}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {t("forgot.success.next.items.signin.text")}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          {t("forgot.success.security.level")}
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-green-600 text-white"
                        >
                          {t("forgot.success.security.badge")}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t("forgot.success.security.caption")}
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

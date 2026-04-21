import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import LoginForm from "@/features/Auth/components/LoginForm";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useEffect } from "react";

export default function LoginPage() {
  const { setBreadcrumbItems } = useBreadcrumb();
  const { t } = useTranslation("auth");

  useEffect(() => {
    setBreadcrumbItems([
      { key: "sign-in", title: t("breadcrumb.login"), active: true },
    ]);
  }, [setBreadcrumbItems, t]);

  return (
    <>
      <Helmet>
        <title>{t("forms.login.helmet.title")}</title>
        <meta
          name="description"
          content={t("forms.login.helmet.description")}
        />
      </Helmet>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {t("login.hero.title")}
              </h1>
              <p className="text-gray-600">{t("login.hero.description")}</p>
            </div>

            <LoginForm />

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-600">
                {t("login.links.noAccount")}{" "}
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-700 font-medium underline-offset-4 hover:underline"
                >
                  {t("login.links.createAccount")}
                </Link>
              </p>
              <p className="text-sm text-gray-600">
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-700 font-medium underline-offset-4 hover:underline"
                >
                  {t("login.links.forgotPassword")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

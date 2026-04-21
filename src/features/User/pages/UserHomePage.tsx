import { Helmet } from "react-helmet-async";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import UserDashboard from "@/features/User/components/UserDashboard";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

export default function UserHomePage() {
  const { setBreadcrumbItems } = useBreadcrumb();
  const { t } = useTranslation("user");

  useEffect(() => {
    setBreadcrumbItems([
      { key: "user", title: t("breadcrumb.dashboard"), active: true },
    ]);
  }, [setBreadcrumbItems, t]);

  return (
    <>
      <Helmet>
        <title>{t("helmet.home.title")}</title>
        <meta name="description" content={t("helmet.home.description")} />
      </Helmet>

      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <UserDashboard />
        </div>
      </div>
    </>
  );
}

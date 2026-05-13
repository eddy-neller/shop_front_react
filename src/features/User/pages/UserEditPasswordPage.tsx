import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import EditPasswordForm from "@/features/User/components/EditPasswordForm";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const UserEditPasswordPage = () => {
  const { setBreadcrumbItems } = useBreadcrumb();
  const { t } = useTranslation("user");

  useEffect(() => {
    setBreadcrumbItems([
      {
        key: "user",
        linkProps: { to: "/user" },
        title: t("breadcrumb.dashboard"),
      },
      {
        key: "edit-password",
        title: t("breadcrumb.editPassword"),
        active: true,
      },
    ]);
  }, [setBreadcrumbItems, t]);

  return (
    <>
      <Helmet>
        <title>{t("helmet.editPassword.title")}</title>
        <meta
          name="description"
          content={t("helmet.editPassword.description")}
        />
      </Helmet>

      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <EditPasswordForm />
        </div>
      </div>
    </>
  );
};

export default UserEditPasswordPage;

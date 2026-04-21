import UserProfileCard from "@/features/User/components/UserProfileCard";
import UserErrorCard from "@/features/User/components/UserErrorCard";
import { useMe } from "@/features/User/hooks/useUser";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Spinner from "@/components/Spinner";

export default function UserProfilePage() {
  const { setBreadcrumbItems } = useBreadcrumb();
  const { t } = useTranslation("user");

  const { data: user, isPending, isError } = useMe();

  useEffect(() => {
    setBreadcrumbItems([
      {
        key: "user",
        linkProps: { to: "/user" },
        title: t("breadcrumb.dashboard"),
      },
      { key: "profile", title: t("breadcrumb.profile"), active: true },
    ]);
  }, [setBreadcrumbItems, t]);

  if (isPending) return <Spinner loading={isPending} fullscreen />;
  if (isError || !user) return <UserErrorCard />;

  return (
    <>
      <Helmet>
        <title>{t("helmet.profile.title")}</title>
        <meta name="description" content={t("helmet.profile.description")} />
      </Helmet>

      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <UserProfileCard user={user} isPrivate />
        </div>
      </div>
    </>
  );
}

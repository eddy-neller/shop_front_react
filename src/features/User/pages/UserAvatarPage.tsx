import AvatarForm from "@/features/User/components/AvatarForm";
import UserAvatar from "@/features/User/components/UserAvatar";
import UserErrorCard from "@/features/User/components/UserErrorCard";
import { coupeMot, supRepLettre } from "@/lib/utils/format";
import { Card, CardContent } from "@/components/ui/card";
import { useMe } from "@/features/User/hooks/useUser";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Spinner from "@/components/Spinner";

export default function UserAvatarPage() {
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
      { key: "avatar", title: t("breadcrumb.avatar"), active: true },
    ]);
  }, [setBreadcrumbItems, t]);

  if (isPending) return <Spinner loading={isPending} fullscreen />;
  if (isError || !user) return <UserErrorCard />;

  const formattedUser = {
    username: coupeMot(supRepLettre(user.username), 15),
  };

  return (
    <>
      <Helmet>
        <title>{t("helmet.avatar.title")}</title>
        <meta name="description" content={t("helmet.avatar.description")} />
      </Helmet>

      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-6">
                  <p className="text-muted-foreground mb-4">
                    {t("avatarPage.p1")}
                  </p>
                  {user.avatarUrl && (
                    <div className="flex justify-center">
                      <UserAvatar
                        avatarUrl={user.avatarUrl}
                        username={formattedUser.username}
                      />
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mb-6">
                    {t("avatarPage.p2")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <AvatarForm />
          </div>
        </div>
      </div>
    </>
  );
}

import { Link } from "react-router-dom";
import { Crown, Shield, User, CheckCircle2, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import type { AuthUser } from "@/features/User/types/user";
import { useTranslation } from "react-i18next";

const Accent = ({ color }: { color: string }) => (
  <div
    className="rounded-l-lg"
    style={{
      width: "6px",
      alignSelf: "stretch",
      background: color,
    }}
  />
);

const FeatureItem = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-start gap-2 py-1">
    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
    <span className="text-sm">{children}</span>
  </div>
);

const HeaderCard = ({ username }: { username: string }) => {
  const { t } = useTranslation("user");

  return (
    <Card className="border-0 shadow-sm rounded-2xl mb-4">
      <CardContent className="flex items-center p-6">
        <div className="mr-4 flex items-center justify-center rounded-full w-14 h-14 bg-blue-100">
          <User className="text-xl text-blue-600" />
        </div>
        <div className="flex-grow">
          <h3 className="text-xl font-semibold mb-1">
            {t("dashboard.welcome", { username })}
          </h3>
          <div className="text-gray-600">{t("dashboard.welcomeBack")}</div>
        </div>
        <div>
          <Button asChild variant="outline" className="gap-2">
            <Link to="/user/profile">
              <Eye className="h-4 w-4" />
              {t("dashboard.showProfile")}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function UserDashboard() {
  const { t } = useTranslation("user");
  const authUser = useAuthUser<AuthUser | null>();

  if (!authUser) {
    return null;
  }

  const roles = authUser.roles || [];
  const username =
    authUser.username || authUser.email || t("dashboard.fallbackUsername");
  const isAdmin =
    roles.includes("ROLE_ADMIN") || roles.includes("ROLE_SUPER_ADMIN");
  const isModerator = roles.includes("ROLE_MODERATEUR");
  const isMember = !isAdmin && !isModerator;

  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4">
      <HeaderCard username={username} />

      {/* Admin Section */}
      {isAdmin && (
        <Card className="border-0 shadow-sm rounded-2xl mb-3">
          <CardContent className="p-0 flex">
            <Accent color="#fbbf24" />
            <div className="p-6 w-full">
              <div className="flex items-center mb-3">
                <div className="mr-3 inline-flex items-center justify-center rounded-full w-9 h-9 bg-yellow-100">
                  <Crown className="h-5 w-5 text-yellow-600" />
                </div>
                <h5 className="text-lg font-semibold mb-0">
                  {t("dashboard.admin.title")}
                </h5>
              </div>
              <p className="text-gray-600 mb-0">{t("dashboard.admin.text")}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Moderator Section (visible only if not admin) */}
      {isModerator && !isAdmin && (
        <Card className="border-0 shadow-sm rounded-2xl mb-3">
          <CardContent className="p-0 flex">
            <Accent color="#3b82f6" />
            <div className="p-6 w-full">
              <div className="flex items-center mb-3">
                <div className="mr-3 inline-flex items-center justify-center rounded-full w-9 h-9 bg-blue-100">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <h5 className="text-lg font-semibold mb-0">
                  {t("dashboard.moderator.title")}
                </h5>
              </div>
              <p className="text-gray-600 mb-3">
                {t("dashboard.moderator.intro")}
              </p>
              <div className="space-y-1">
                <FeatureItem>
                  {t("dashboard.moderator.features.delete")}
                </FeatureItem>
                <FeatureItem>
                  {t("dashboard.moderator.features.rules")}
                </FeatureItem>
                <FeatureItem>
                  {t("dashboard.moderator.features.resolve")}
                </FeatureItem>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Member Section (visible only if not moderator) */}
      {isMember && (
        <Card className="border-0 shadow-sm rounded-2xl">
          <CardContent className="p-0 flex">
            <Accent color="#3b82f6" />
            <div className="p-6 w-full">
              <div className="flex items-center mb-3">
                <div className="mr-3 inline-flex items-center justify-center rounded-full w-9 h-9 bg-blue-100">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <h5 className="text-lg font-semibold mb-0">
                  {t("dashboard.member.title")}
                </h5>
              </div>
              <p className="text-gray-600 mb-3">
                {t("dashboard.member.intro")}
              </p>
              <div className="space-y-1">
                <FeatureItem>
                  {t("dashboard.member.features.private")}
                </FeatureItem>
                <FeatureItem>
                  {t("dashboard.member.features.profile")}
                </FeatureItem>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import { useMemo } from "react";
import { User as UserIcon, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { coupeMot, formatDate, supRepLettre } from "@/lib/utils/format";
import type { User } from "@/features/User/types/user";
import UserAvatar from "@/features/User/components/UserAvatar";
import UserRole from "@/features/User/components/UserRole";
import { useTranslation } from "react-i18next";

interface UserProfileCardProps {
  user: User;
}

export default function UserProfileCard({ user }: UserProfileCardProps) {
  const { t, i18n } = useTranslation("user");
  const dateLocale = i18n.language.startsWith("fr") ? "fr-FR" : "en-US";
  const formattedUser = useMemo(
    () => ({
      username: coupeMot(supRepLettre(user.username), 15),
    }),
    [user]
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          <span>{formattedUser.username}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Colonne gauche */}
          <div className="md:col-span-1">
            <UserAvatar
              avatarUrl={user.avatarUrl}
              username={formattedUser.username}
            />
            <UserRole roles={user.roles} />
          </div>

          {/* Colonne droite */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">{t("profileCard.email")}</span>
              <a
                href={`mailto:${user.email}`}
                className="text-primary hover:underline"
              >
                {user.email}
              </a>
            </div>
            <div className="space-y-2 pt-2 border-t">
              <div>
                <span className="font-semibold">
                  {t("profileCard.registered")}
                </span>{" "}
                {formatDate(user.createdAt, dateLocale, true)}
              </div>
              <div>
                <span className="font-semibold">
                  {t("profileCard.lastVisit")}
                </span>{" "}
                {formatDate(user.lastVisit, dateLocale, true)}
              </div>
            </div>
            <div className="space-y-2 pt-2 border-t">
              <div>
                <span className="font-semibold">{t("profileCard.logins")}</span>{" "}
                {user.nbLogin}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

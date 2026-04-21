import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { resolveStaticUrl } from "@/lib/utils/url";
import { User } from "lucide-react";
import { useTranslation } from "react-i18next";

interface UserAvatarProps {
  avatarUrl?: string;
  username: string;
}

export default function UserAvatar({ avatarUrl, username }: UserAvatarProps) {
  const { t } = useTranslation("user");
  const initials = username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const fullAvatarUrl = resolveStaticUrl(avatarUrl);

  return (
    <Avatar className="w-24 h-24 mb-4">
      {fullAvatarUrl ? (
        <AvatarImage
          src={fullAvatarUrl}
          alt={t("avatar.alt", { username })}
        />
      ) : null}
      <AvatarFallback>
        {initials || <User className="h-8 w-8" />}
      </AvatarFallback>
    </Avatar>
  );
}

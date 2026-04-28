import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

interface UserRoleProps {
  roles: string[];
}

export default function UserRole({ roles }: UserRoleProps) {
  const { t } = useTranslation("user");

  const getRoleInfo = () => {
    if (roles && roles.length > 0) {
      if (roles.includes("ROLE_ADMIN")) {
        return { label: t("roles.admin"), color: "red" };
      }
      if (roles.includes("ROLE_MODERATEUR")) {
        return { label: t("roles.moderator"), color: "blue" };
      }
      if (roles.includes("ROLE_USER")) {
        return { label: t("roles.member"), color: "green" };
      }
    }

    return { label: t("roles.unknown"), color: "gray" };
  };

  const { label, color } = getRoleInfo();

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Badge variant="outline" style={{ color }}>
        {label}
      </Badge>
    </div>
  );
}

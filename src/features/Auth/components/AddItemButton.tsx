import React from "react";
import { Link } from "react-router-dom";
import { FaPlusSquare } from "react-icons/fa";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { Can } from "@/contexts/AbilityContext";
import { Action, SubjectType } from "@/lib/utils/ability";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface AddItemButtonProps {
  permission: SubjectType;
  to: string;
  buttonText: string;
  message: string;
}

const AddItemButton: React.FC<AddItemButtonProps> = ({
  permission,
  to,
  buttonText,
  message,
}) => {
  const isAuthenticated = useIsAuthenticated();
  const { t } = useTranslation("auth");

  return (
    <div className="mt-5 text-center">
      {isAuthenticated ? (
        <Can I={Action.CREATE} a={permission}>
          <Button asChild>
            <Link to={to}>
              <FaPlusSquare />
              {buttonText}
            </Link>
          </Button>
        </Can>
      ) : (
        <p>
          {t("addItemButton.mustBeLoggedIn")}{" "}
          <Link to="/login">{t("addItemButton.login")}</Link>{" "}
          {t("addItemButton.message", { message })}
        </p>
      )}
    </div>
  );
};

export default AddItemButton;

import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function BackButton() {
  const { t } = useTranslation("notFound");

  return (
    <Button
      variant="outline"
      onClick={() => window.history.back()}
      className="w-full"
    >
      {t("cta.back")}
    </Button>
  );
}

import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function UserErrorCard() {
  const { t } = useTranslation("user");

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle>{t("errorCard.title")}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {t("errorCard.description")}
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              {t("errorCard.retry")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

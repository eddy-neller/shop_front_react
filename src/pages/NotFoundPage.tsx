import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Home, Search } from "lucide-react";
import BackButton from "@/components/not-found/BackButton";
import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
  const { t } = useTranslation("notFound");

  return (
    <>
      <Helmet>
        <title>{t("helmet.title")}</title>
        <meta name="description" content={t("helmet.description")} />
      </Helmet>

      <div className="flex items-center justify-center flex-grow py-16 px-4 bg-gray-50">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <CardTitle className="text-4xl font-bold">404</CardTitle>
            <CardDescription className="text-lg mt-2">
              {t("title")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t("message")}</p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button asChild variant="outline" className="w-full" size="lg">
              <Link to="/" className="w-full">
                <Home className="mr-2 h-4 w-4" />
                {t("cta.home")}
              </Link>
            </Button>
            <BackButton />
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

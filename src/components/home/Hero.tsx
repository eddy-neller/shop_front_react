import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const Hero: React.FC = () => {
  const { t } = useTranslation("home");

  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">{t("hero.title")}</h1>
          <p className="text-xl mb-8 text-blue-100">
            {t("hero.description")}
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <Link to="/contact">{t("hero.cta")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

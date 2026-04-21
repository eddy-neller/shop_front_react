import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, UserPlus, LogIn } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const CLOSE_DELAY = 150;

export default function AuthNav() {
  const location = useLocation();
  const { t } = useTranslation("auth");
  const [open, setOpen] = useState(false);
  const closeTimerRef = useRef<number | null>(null);

  const AUTH_PATHS = ["/login", "/register", "/forgot-password"];
  const isAuthActive = AUTH_PATHS.some((p) =>
    location.pathname.startsWith(p)
  );

  const openAuth = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpen(true);
  };

  const scheduleCloseAuth = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = window.setTimeout(() => {
      setOpen(false);
      closeTimerRef.current = null;
    }, CLOSE_DELAY) as unknown as number;
  };

  const closeAuthNow = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpen(false);
  }, []);

  useEffect(() => {
    closeAuthNow();
  }, [location.pathname, closeAuthNow]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  return (
    <div
      onMouseEnter={openAuth}
      onMouseLeave={scheduleCloseAuth}
      className="relative"
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 text-base font-medium transition-all duration-300 rounded-lg",
              "active:scale-95",
              "before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2",
              "before:w-0 before:h-0.5 before:bg-blue-600 before:transition-all before:duration-300",
              "hover:before:w-3/4",
              isAuthActive
                ? "text-blue-600 before:w-3/4 before:bg-blue-600"
                : "text-gray-700 hover:text-blue-600"
            )}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls="authPanel"
            onClick={(e) => e.preventDefault()}
            >
              <User className="h-5 w-5" />
            <span className="hidden md:inline">{t("nav.signInUp")}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          id="authPanel"
          className="w-80 p-0"
          align="end"
          sideOffset={8}
          role="dialog"
          aria-label={t("nav.authPanelAria")}
          onMouseEnter={openAuth}
          onMouseLeave={scheduleCloseAuth}
        >
          <div className="p-4">
            <div className="mb-4">
              <h6 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
                {t("nav.welcome")}
              </h6>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t("nav.chooseOption")}
              </div>
            </div>

            <div className="space-y-2">
              <Button
                asChild
                variant="default"
                size="lg"
                className="w-full rounded-lg bg-slate-900 text-white hover:bg-slate-800"
              >
                <Link to="/login" onClick={closeAuthNow}>
                  <LogIn className="mr-2 h-4 w-4" />
                  {t("nav.signIn")}
                </Link>
              </Button>

              <div className="mt-3">
                <Button
                  asChild
                  variant="default"
                  size="lg"
                  className="w-full rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Link to="/register" onClick={closeAuthNow}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    {t("nav.createAccount")}
                  </Link>
                </Button>
              </div>
            </div>

            <div className="text-center mt-3">
              <Link
                to="/forgot-password"
                className="text-sm text-gray-600 hover:text-blue-600 underline-offset-4 hover:underline transition-colors"
                onClick={closeAuthNow}
              >
                {t("nav.forgotPassword")}
              </Link>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import LoadingButton from "@/components/LoadingButton";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  createLoginSchema,
  type LoginFormData,
} from "@/features/Auth/schemas/login";
import { useLogin } from "@/features/Auth/hooks/useLogin";
import { useTranslation } from "react-i18next";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isPending } = useLogin();
  const { t } = useTranslation("auth");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(createLoginSchema(t)),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  const isBusy = isSubmitting || isPending;

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {t("login.submit.label")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">{t("login.email.label")}</FieldLabel>
              <FieldContent>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("login.email.placeholder")}
                    className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                    {...register("email")}
                  />
                </div>
                <FieldError
                  errors={errors.email ? [errors.email] : undefined}
                />
              </FieldContent>
            </Field>

            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">
                {t("login.password.label")}
              </FieldLabel>
              <FieldContent>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("login.password.placeholder")}
                    className={`pl-10 pr-10 ${errors.password ? "border-destructive" : ""}`}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={
                      showPassword
                        ? t("login.password.hide")
                        : t("login.password.show")
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <FieldError
                  errors={errors.password ? [errors.password] : undefined}
                />
              </FieldContent>
            </Field>
          </FieldGroup>

          <LoadingButton
            type="submit"
            size="lg"
            className="w-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-100 font-medium"
            isBusy={isBusy}
            label={t("login.submit.label")}
            busyLabel={t("login.submit.busy")}
            icon={<LogIn className="h-4 w-4" />}
          />
        </form>
      </CardContent>
    </Card>
  );
}

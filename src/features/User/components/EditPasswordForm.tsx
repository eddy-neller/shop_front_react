import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Lock, Key } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { updatePassword } from "@/features/User/lib/api/user";
import {
  createEditPasswordFormSchema,
  type EditPasswordFormData,
} from "@/features/User/schemas/password";
import { toast } from "sonner";
import { handleAxiosError } from "@/lib/utils/axiosErrorHandler";
import { useTranslation } from "react-i18next";

export default function EditPasswordForm() {
  const navigate = useNavigate();
  const { t } = useTranslation("user");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<EditPasswordFormData>({
    resolver: zodResolver(createEditPasswordFormSchema(t)),
  });

  const mutation = useMutation({
    mutationFn: (data: EditPasswordFormData) => updatePassword(data),
    onSuccess: () => {
      toast.success(t("forms.editPassword.toast.success"));
      navigate("/user/profile");
    },
    onError: (error: unknown) => {
      handleAxiosError(
        error,
        setError,
        true,
        t("forms.editPassword.toast.error")
      );
    },
  });

  const onSubmit = (data: EditPasswordFormData) => {
    mutation.mutate(data);
  };

  const currentPassword = watch("currentPassword");
  const newPassword = watch("newPassword");
  const confirmNewPassword = watch("confirmNewPassword");

  // Validation en temps réel : nouveau mot de passe différent de l'actuel
  useEffect(() => {
    if (newPassword && currentPassword) {
      if (newPassword === currentPassword) {
        setError("newPassword", {
          type: "manual",
          message: t("forms.editPassword.new.different"),
        });
      } else {
        clearErrors("newPassword");
      }
    }
  }, [newPassword, currentPassword, setError, clearErrors, t]);

  // Validation en temps réel : confirmation du mot de passe
  useEffect(() => {
    if (confirmNewPassword) {
      if (newPassword !== confirmNewPassword) {
        setError("confirmNewPassword", {
          type: "manual",
          message: t("forms.editPassword.confirm.mismatch"),
        });
      } else {
        clearErrors("confirmNewPassword");
      }
    }
  }, [newPassword, confirmNewPassword, setError, clearErrors, t]);

  const isBusy = isSubmitting || mutation.isPending;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t("breadcrumb.editPassword")}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-6">
          {t("forms.editPassword.intro")}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <FieldGroup>
            {/* Mot de passe actuel */}
            <Field data-invalid={!!errors.currentPassword}>
              <FieldLabel htmlFor="currentPassword">
                {t("forms.editPassword.current.label")}
              </FieldLabel>
              <FieldContent>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder={t("forms.editPassword.current.placeholder")}
                    className={`pl-10 pr-10 ${
                      errors.currentPassword ? "border-destructive" : ""
                    }`}
                    {...register("currentPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={
                      showCurrentPassword
                        ? t("forms.editPassword.current.hide")
                        : t("forms.editPassword.current.show")
                    }
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <FieldError
                  errors={
                    errors.currentPassword
                      ? [errors.currentPassword]
                      : undefined
                  }
                />
              </FieldContent>
            </Field>

            <Separator className="my-6" />

            {/* Nouveau mot de passe */}
            <Field data-invalid={!!errors.newPassword}>
              <FieldLabel htmlFor="newPassword">
                {t("forms.editPassword.new.label")}
              </FieldLabel>
              <FieldContent>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder={t("forms.editPassword.new.placeholder")}
                    className={`pl-10 pr-10 ${
                      errors.newPassword ? "border-destructive" : ""
                    }`}
                    {...register("newPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={
                      showNewPassword
                        ? t("forms.editPassword.new.hide")
                        : t("forms.editPassword.new.show")
                    }
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <FieldError
                  errors={errors.newPassword ? [errors.newPassword] : undefined}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {t("forms.editPassword.new.hint")}
                </p>
              </FieldContent>
            </Field>

            {/* Confirmation du nouveau mot de passe */}
            <Field data-invalid={!!errors.confirmNewPassword}>
              <FieldLabel htmlFor="confirmNewPassword">
                {t("forms.editPassword.confirm.label")}
              </FieldLabel>
              <FieldContent>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmNewPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t("forms.editPassword.confirm.placeholder")}
                    className={`pl-10 pr-10 ${
                      errors.confirmNewPassword ? "border-destructive" : ""
                    }`}
                    {...register("confirmNewPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={
                      showConfirmPassword
                        ? t("forms.editPassword.confirm.hide")
                        : t("forms.editPassword.confirm.show")
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <FieldError
                  errors={
                    errors.confirmNewPassword
                      ? [errors.confirmNewPassword]
                      : undefined
                  }
                />
              </FieldContent>
            </Field>
          </FieldGroup>

          {/* Actions */}
          <div className="pt-4 mt-6">
            <LoadingButton
              type="submit"
              variant="default"
              size="lg"
              className="w-full bg-slate-900 text-white hover:bg-slate-800 font-medium"
              isBusy={isBusy}
              label={t("forms.editPassword.submit.label")}
              busyLabel={t("forms.editPassword.submit.busy")}
              icon={<Key className="h-4 w-4" />}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

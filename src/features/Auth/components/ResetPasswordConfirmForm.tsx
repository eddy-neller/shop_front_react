import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import LoadingButton from "@/components/LoadingButton";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  createPasswordResetConfirmSchema,
  type PasswordResetConfirmFormData,
} from "@/features/Auth/schemas/passwordReset";
import { confirmPasswordReset } from "@/features/Auth/lib/api/auth";
import { handleAxiosError } from "@/lib/utils/axiosErrorHandler";
import { useTranslation } from "react-i18next";

interface ResetPasswordConfirmFormProps {
  token: string;
}

export default function ResetPasswordConfirmForm({
  token,
}: ResetPasswordConfirmFormProps) {
  const navigate = useNavigate();
  const { t } = useTranslation("auth-forgotPassword");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<PasswordResetConfirmFormData>({
    resolver: zodResolver(createPasswordResetConfirmSchema(t)),
  });

  const passwordWatch = watch("newPassword");
  const confirmPasswordWatch = watch("confirmNewPassword");

  // Validation en temps réel pour confirmNewPassword quand newPassword change
  useEffect(() => {
    if (confirmPasswordWatch) {
      if (passwordWatch !== confirmPasswordWatch) {
        setError("confirmNewPassword", {
          type: "manual",
          message: t("forms.resetConfirm.confirmNewPassword.match"),
        });
      } else {
        clearErrors("confirmNewPassword");
      }
    }
  }, [passwordWatch, confirmPasswordWatch, setError, clearErrors, t]);

  const mutation = useMutation({
    mutationFn: (data: PasswordResetConfirmFormData) =>
      confirmPasswordReset({
        token,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      }),
    onSuccess: () => {
      setIsSuccess(true);
      toast.success(t("forms.resetConfirm.toast.success"), {
        description: t("forms.resetConfirm.success.redirecting"),
      });
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    },
    onError: (error) => {
      handleAxiosError(
        error,
        setError,
        true,
        t("forms.resetConfirm.error.message")
      );
    },
  });

  const onSubmit = (data: PasswordResetConfirmFormData) => {
    mutation.mutate(data);
  };

  const isBusy = isSubmitting || mutation.isPending;

  if (isSuccess) {
    return (
      <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <div className="text-center">
          <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-600 dark:text-green-400" />
          <AlertDescription className="font-semibold mb-2">
            {t("forms.resetConfirm.success.title")}
          </AlertDescription>
          <AlertDescription className="text-sm">
            {t("forms.resetConfirm.success.message")}
          </AlertDescription>
          <AlertDescription className="mt-2 text-xs text-muted-foreground">
            {t("forms.resetConfirm.success.redirecting")}
          </AlertDescription>
        </div>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FieldGroup>
        {/* New Password */}
        <Field data-invalid={!!errors.newPassword}>
          <FieldLabel htmlFor="newPassword">
            {t("forms.resetConfirm.newPassword.label")}
          </FieldLabel>
          <FieldContent>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder={t("forms.resetConfirm.newPassword.placeholder")}
                autoComplete="new-password"
                className={`pl-10 pr-10 ${errors.newPassword ? "border-destructive" : ""}`}
                {...register("newPassword")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={
                  showPassword
                    ? t("forms.resetConfirm.newPassword.hide")
                    : t("forms.resetConfirm.newPassword.show")
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
              errors={errors.newPassword ? [errors.newPassword] : undefined}
            />
            <p className="text-sm text-muted-foreground mt-1">
              {t("forms.resetConfirm.hint.text")}
            </p>
          </FieldContent>
        </Field>

        {/* Confirm New Password */}
        <Field data-invalid={!!errors.confirmNewPassword}>
          <FieldLabel htmlFor="confirmNewPassword">
            {t("forms.resetConfirm.confirmNewPassword.label")}
          </FieldLabel>
          <FieldContent>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="confirmNewPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t(
                  "forms.resetConfirm.confirmNewPassword.placeholder"
                )}
                autoComplete="new-password"
                className={`pl-10 pr-10 ${errors.confirmNewPassword ? "border-destructive" : ""}`}
                {...register("confirmNewPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={
                  showConfirmPassword
                    ? t("forms.resetConfirm.confirmNewPassword.hide")
                    : t("forms.resetConfirm.confirmNewPassword.show")
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

      <div className="flex justify-center mt-3">
        <LoadingButton
          variant="default"
          type="submit"
          isBusy={isBusy}
          icon={<CheckCircle className="h-4 w-4" />}
          label={t("forms.resetConfirm.submit.label")}
          busyLabel={t("forms.resetConfirm.submit.busy")}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        />
      </div>
    </form>
  );
}

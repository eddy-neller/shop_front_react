import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Mail, Send } from "lucide-react";
import LoadingButton from "@/components/LoadingButton";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { toast } from "sonner";
import {
  createPasswordResetRequestSchema,
  type PasswordResetRequestFormData,
} from "@/features/Auth/schemas/passwordReset";
import { requestPasswordReset } from "@/features/Auth/lib/api/auth";
import { handleAxiosError } from "@/lib/utils/axiosErrorHandler";
import { useTranslation } from "react-i18next";

export default function ResetPasswordRequestForm() {
  const navigate = useNavigate();
  const { t } = useTranslation("auth-forgotPassword");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PasswordResetRequestFormData>({
    resolver: zodResolver(createPasswordResetRequestSchema(t)),
  });

  const mutation = useMutation({
    mutationFn: (data: PasswordResetRequestFormData) =>
      requestPasswordReset({ email: data.email }),
    onSuccess: (_res, variables) => {
      toast.success(t("forms.resetRequest.toast.success"), {
        description: t("forgot.success.message.text"),
      });

      // Stocker l'email dans sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.setItem("forgotPasswordEmail", variables.email);
      }
      navigate("/forgot-password/success");
    },
    onError: (error) => {
      handleAxiosError(
        error,
        setError,
        true,
        t("forms.resetRequest.toast.error")
      );
    },
  });

  const onSubmit = (data: PasswordResetRequestFormData) => {
    mutation.mutate(data);
  };

  const isBusy = isSubmitting || mutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">
            {t("forms.resetRequest.email.label")}
          </FieldLabel>
          <FieldContent>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder={t("forms.resetRequest.email.placeholder")}
                className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                {...register("email")}
              />
            </div>
            <FieldError errors={errors.email ? [errors.email] : undefined} />
          </FieldContent>
        </Field>
      </FieldGroup>

      <div className="flex justify-center mt-3">
        <LoadingButton
          variant="default"
          type="submit"
          isBusy={isBusy}
          icon={<Send className="h-4 w-4" />}
          label={t("forms.resetRequest.submit.label")}
          busyLabel={t("forms.resetRequest.submit.busy")}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        />
      </div>
    </form>
  );
}

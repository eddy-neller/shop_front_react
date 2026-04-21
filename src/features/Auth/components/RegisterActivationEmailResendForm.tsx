import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  createResendActivationSchema,
  type ResendActivationFormData,
} from "@/features/Auth/schemas/resendActivation";
import { resendActivationEmail } from "@/features/Auth/lib/api/auth";
import { handleAxiosError } from "@/lib/utils/axiosErrorHandler";
import { toast } from "sonner";
import { useTranslation, Trans } from "react-i18next";

export default function RegisterActivationEmailResendForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const { t } = useTranslation("auth-registerValidation");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResendActivationFormData>({
    resolver: zodResolver(createResendActivationSchema(t)),
  });

  const mutation = useMutation({
    mutationFn: (data: ResendActivationFormData) =>
      resendActivationEmail({ email: data.email }),
    onSuccess: (_res, variables) => {
      setSentTo(variables.email);
      toast.success(t("validation.forms.resendActivation.toast.success"));
    },
    onError: (error) => {
      handleAxiosError(
        error,
        setError,
        true,
        t("validation.forms.resendActivation.toast.error")
      );
    },
  });

  const onSubmit = (data: ResendActivationFormData) => {
    mutation.mutate(data);
  };

  const isBusy = isSubmitting || mutation.isPending;

  if (sentTo) {
    return (
      <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <AlertDescription>
          <Trans
            ns="auth-registerValidation"
            i18nKey="validation.forms.resendActivation.success.message"
            values={{ email: sentTo }}
            components={{ strong: <strong /> }}
          />
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">
            {t("validation.forms.resendActivation.email.label")}
          </FieldLabel>
          <FieldContent>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder={t(
                  "validation.forms.resendActivation.email.placeholder"
                )}
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
          label={t("validation.forms.resendActivation.submit.label")}
          busyLabel={t("validation.forms.resendActivation.submit.busy")}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        />
      </div>
    </form>
  );
}

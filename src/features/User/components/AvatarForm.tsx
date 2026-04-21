import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import LoadingButton from "@/components/LoadingButton";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateAvatar } from "@/features/User/lib/api/user";
import {
  createAvatarFormSchema,
  type AvatarFormData,
} from "@/features/User/schemas/avatar";
import { toast } from "sonner";
import { handleAxiosError } from "@/lib/utils/axiosErrorHandler";
import { Upload } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AvatarForm() {
  const navigate = useNavigate();
  const { t } = useTranslation("user");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<AvatarFormData>({
    resolver: zodResolver(createAvatarFormSchema(t)),
  });

  const mutation = useMutation({
    mutationFn: async (data: AvatarFormData) => {
      const avatarFile = data.avatarFile[0];
      if (!avatarFile) {
        throw new Error(t("forms.avatar.required"));
      }
      return updateAvatar(avatarFile);
    },
    onSuccess: () => {
      toast.success(t("forms.avatar.toast.success"));
      navigate("/user/profile");
    },
    onError: (error: unknown) => {
      handleAxiosError(error, setError, true, t("forms.avatar.toast.error"));
    },
  });

  const onSubmit = (data: AvatarFormData) => {
    mutation.mutate(data);
  };

  const isBusy = isSubmitting || mutation.isPending;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t("breadcrumb.avatar")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!errors.avatarFile}>
              <FieldLabel
                htmlFor="avatarFile"
                className="text-gray-900 dark:text-gray-100 font-semibold"
              >
                {t("forms.avatar.label")}
              </FieldLabel>
              <FieldContent>
                <Input
                  id="avatarFile"
                  type="file"
                  accept="image/jpeg, image/png"
                  className={errors.avatarFile ? "border-destructive" : ""}
                  {...register("avatarFile")}
                />
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("forms.avatar.hint")}
                </p>
                <FieldError
                  errors={errors.avatarFile ? [errors.avatarFile] : undefined}
                />
              </FieldContent>
            </Field>
          </FieldGroup>

          <div className="pt-4 mt-6">
            <LoadingButton
              type="submit"
              variant="default"
              size="lg"
              className="w-full bg-slate-900 text-white hover:bg-slate-800 font-medium"
              isBusy={isBusy}
              label={t("forms.avatar.submit.label")}
              busyLabel={t("forms.avatar.submit.busy")}
              icon={<Upload className="h-4 w-4" />}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

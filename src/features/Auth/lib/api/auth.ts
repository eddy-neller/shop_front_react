import httpClient from "@/lib/api/httpClient";
import type {
  LoginCredentials,
  PasswordResetCheckPayload,
  PasswordResetConfirmPayload,
  PasswordResetRequestPayload,
  RefreshTokenResponse,
  RegistrationPayload,
  ResendActivationEmailPayload,
  ValidateActivationPayload,
} from "@/features/Auth/types/auth";

export const login = async (
  credentials: LoginCredentials
): Promise<RefreshTokenResponse> => {
  const response = await httpClient.post<RefreshTokenResponse>("/login", {
    email: credentials.email.trim(),
    password: credentials.password,
  });

  return response.data;
};

export const refreshToken = async (
  refresh_token: string
): Promise<RefreshTokenResponse> => {
  const response = await httpClient.post<RefreshTokenResponse>(
    "/token/refresh",
    { refresh_token }
  );

  return response.data;
};

export const registration = async (
  payload: RegistrationPayload
): Promise<void> => {
  await httpClient.post("/users/register", payload);
};

export const resendActivationEmail = async (
  payload: ResendActivationEmailPayload
): Promise<void> => {
  await httpClient.post("/users/register/email-activation-request", {
    email: payload.email.trim(),
  });
};

export const validateActivation = async (
  payload: ValidateActivationPayload
): Promise<void> => {
  await httpClient.post("/users/register/validation", payload);
};

export const requestPasswordReset = async (
  payload: PasswordResetRequestPayload
): Promise<void> => {
  await httpClient.post("/users/reset-password/request", {
    email: payload.email.trim(),
  });
};

export const checkPasswordResetToken = async (
  payload: PasswordResetCheckPayload
): Promise<void> => {
  await httpClient.post("/users/reset-password/check", payload);
};

export const confirmPasswordReset = async (
  payload: PasswordResetConfirmPayload
): Promise<void> => {
  await httpClient.post("/users/reset-password/confirm", payload);
};

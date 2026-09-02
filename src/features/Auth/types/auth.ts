export type LangCode = "EN" | "FR";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refresh_token: string;
  refresh_token_expiration?: number;
}

export interface JwtPayload {
  sub: string;
  roles: string[];
  exp: number;
}

export interface RegistrationPayload {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  preferences?: {
    lang?: string;
  };
}

export interface ResendActivationEmailPayload {
  email: string;
}

export interface ValidateActivationPayload {
  token: string;
}

export interface PasswordResetRequestPayload {
  email: string;
}

export interface PasswordResetCheckPayload {
  token: string;
}

export interface PasswordResetConfirmPayload {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}

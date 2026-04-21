/**
 * Codes d'erreur du backend - synchronisés avec InfoCodes.php
 */

export const ERROR_CODES = {
  JWT: {
    BAD_CREDENTIALS: "JWTBAD0",
    INVALID_TOKEN: "JWTINV0",
    MISSING_TOKEN: "JWTMIS0",
    EXPIRED_TOKEN: "JWTEXP0",
  },
} as const;

export type JWTErrorCode =
  (typeof ERROR_CODES.JWT)[keyof typeof ERROR_CODES.JWT];

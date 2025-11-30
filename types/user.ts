export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: "ADMIN" | "USER" | "SYSTEM";
  status: "ACTIVE" | "SUSPENDED" | "CLOSED" | "RESTRICTED";
  verificationStatus: "UNVERIFIED" | "PENDING" | "VERIFIED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  bvn?: string;
  nin?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  idType?: string;
  idNumber?: string;
  idFrontImage?: string;
  idBackImage?: string;
  selfieImage?: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  loginAttempts: number;
  lockedUntil?: string;
  paymentPinHash?: string;
  paymentPinAttempts: number;
  paymentPinLockedUntil?: string;
}

export interface UserSession {
  accessToken: string;
  user: {
    id: string;
    role: string;
    email?: string;
    name?: string;
    image?: string;
  };
}

export interface UserJWT extends Record<string, unknown> {
  role: string;
  accessToken: string;
  email?: string;
  name?: string;
  picture?: string;
  sub?: string;
  iat?: number;
  exp?: number;
  jti?: string;
}

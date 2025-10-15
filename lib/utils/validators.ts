/**
 * Shared validation utilities for admin and user interfaces
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Updated to match backend regex pattern: ^\+?[1-9]\d{1,14}$
  // Supports international format with country codes
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

export const validateNigerianPhoneNumber = (phone: string): boolean => {
  // Nigerian phone number validation for local formats
  const nigerianPhoneRegex = /^(\+?234|0)[789]\d{9}$/;
  return nigerianPhoneRegex.test(phone);
};

export const validateAmount = (amount: number, min: number = 0, max?: number): boolean => {
  if (amount < min) return false;
  if (max && amount > max) return false;
  return true;
};

export const validateStarkNetAddress = (address: string): boolean => {
  const addressRegex = /^0x[0-9a-fA-F]{63,64}$/;
  return addressRegex.test(address);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateBVN = (bvn: string): boolean => {
  // BVN must be 11 digits and start with valid prefixes (22-39)
  const bvnRegex = /^(22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|39)\d{9}$/;
  return bvnRegex.test(bvn);
};

export const validateNIN = (nin: string): boolean => {
  // NIN must be 11 digits and start with 1-9
  const ninRegex = /^[1-9]\d{10}$/;
  return ninRegex.test(nin);
};

export const validateName = (name: string): boolean => {
  // Names should be 2-50 characters, letters and spaces only
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  return nameRegex.test(name);
};

export const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, "");
};

export const validateTransactionAmount = (
  amount: number,
  balance: number,
  min: number = 100,
  max: number = 1000000
): { isValid: boolean; error?: string } => {
  if (amount < min) {
    return { isValid: false, error: `Minimum transaction amount is ${min}` };
  }
  if (amount > max) {
    return { isValid: false, error: `Maximum transaction amount is ${max}` };
  }
  if (amount > balance) {
    return { isValid: false, error: "Insufficient balance" };
  }
  return { isValid: true };
};

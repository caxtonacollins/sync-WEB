/**
 * Shared validation utilities for admin and user interfaces
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+234|0)[789]\d{9}$/;
  return phoneRegex.test(phone);
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
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
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

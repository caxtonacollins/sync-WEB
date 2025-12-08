export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}


// Re-export all grouped route modules
export * as userApi from "./routes/user";
export * as accountApi from "./routes/account";
export * as authApi from "./routes/auth";
export * as sessionApi from "./routes/session";
export * as transactionApi from "./routes/transaction";
export * as exchangeApi from "./routes/exchange";
export * as contractApi from "./routes/contract";
export * as adminApi from "./routes/admin";
export * as walletApi from "./routes/wallet";
export * as flutterwaveApi from "./routes/flutterwave";

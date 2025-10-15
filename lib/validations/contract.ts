import { z } from "zod";

export const contractFactorySchema = z.object({
  newClassHash: z
    .string()
    .min(1, "Class hash is required")
    .regex(
      /^0x[a-fA-F0-9]+$/,
      "Invalid class hash format. Must start with 0x followed by hex characters"
    ),

  newOwnerAddress: z
    .string()
    .min(1, "Owner address is required")
    .regex(
      /^0x[a-fA-F0-9]+$/,
      "Invalid address format. Must start with 0x followed by hex characters"
    ),

  tokenSymbol: z
    .string()
    .min(1, "Token symbol is required")
    .max(10, "Token symbol must not exceed 10 characters")
    .regex(
      /^[A-Z0-9]+$/,
      "Token symbol must contain only uppercase letters and numbers"
    ),

  tokenAddress: z
    .string()
    .min(1, "Token address is required")
    .regex(
      /^0x[a-fA-F0-9]+$/,
      "Invalid token address format. Must start with 0x followed by hex characters"
    ),

  oracleAddress: z
    .string()
    .min(1, "Oracle address is required")
    .regex(
      /^0x[a-fA-F0-9]+$/,
      "Invalid oracle address format. Must start with 0x followed by hex characters"
    ),
});

export type ContractFormData = z.infer<typeof contractFactorySchema>;

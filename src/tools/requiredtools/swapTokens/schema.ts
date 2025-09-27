import { z } from "zod";
import { isAddress } from "viem";

export const swapTokensInputSchema = z.object({
  network: z
    .enum(["sepolia"]) // fixed for now
    .optional()
    .default("sepolia")
    .describe("Network is fixed to 'sepolia' for this tool."),
  tokenIn: z
    .string()
    .refine(addr => isAddress(addr), { message: "Must be a valid ERC20 token address" })
    .describe("ERC20 token address to swap from."),
  tokenOut: z
    .string()
    .refine(addr => isAddress(addr), { message: "Must be a valid ERC20 token address" })
    .describe("ERC20 token address to receive."),
  fee: z
    .union([z.literal(500), z.literal(3000), z.literal(10000)])
    .optional()
    .default(3000)
    .describe("Uniswap V3 pool fee tier in basis points: 500, 3000, or 10000. Defaults to 3000."),
  amountIn: z
    .string()
    .regex(/^\d+(\.\d+)?$/, { message: "amountIn must be a positive number string" })
    .describe(
      "Human-readable amount of tokenIn to swap (e.g., '0.1'). Decimals will be resolved from the token's ERC20 metadata."
    ),
  slippageBps: z
    .number()
    .int()
    .min(0)
    .max(5000)
    .optional()
    .default(300)
    .describe("Max slippage in basis points. Defaults to 300 (3%)."),
  recipient: z
    .string()
    .refine(addr => isAddress(addr), { message: "Must be a valid address" })
    .optional()
    .describe("Recipient of the output tokens. Defaults to the configured account."),
  deadlineSecondsFromNow: z
    .number()
    .int()
    .min(30)
    .max(60 * 60)
    .optional()
    .default(600)
    .describe("Transaction deadline in seconds from now. Default 600s (10 minutes)."),
});

export type SwapTokensInput = z.infer<typeof swapTokensInputSchema>;

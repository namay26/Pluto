import { z } from "zod";
export declare const privateKeySchema: z.ZodString;
export declare const sendFundsInputSchema: z.ZodObject<{
    receiverAddress: z.ZodEffects<z.ZodString, `0x${string}`, string>;
    amountToSend: z.ZodString;
    maxFeePerGas: z.ZodOptional<z.ZodString>;
    maxPriorityFeePerGas: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    receiverAddress: `0x${string}`;
    amountToSend: string;
    maxFeePerGas?: string | undefined;
    maxPriorityFeePerGas?: string | undefined;
}, {
    receiverAddress: string;
    amountToSend: string;
    maxFeePerGas?: string | undefined;
    maxPriorityFeePerGas?: string | undefined;
}>;
export type PrivateKey = z.infer<typeof privateKeySchema>;
export type GetFundsInput = z.infer<typeof sendFundsInputSchema>;
//# sourceMappingURL=privatekeyschema.d.ts.map
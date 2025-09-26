import { createPublicClient, http, defineChain, createWalletClient, } from "viem";
import { privateKeySchema } from "./tools/requiredtools/privatekeyschema.js";
import { privateKeyToAccount } from "viem/accounts";
import dotenv from "dotenv";
dotenv.config();
export const polygonTestnetConfig = defineChain({
    id: 80002,
    name: "Polygon Amoy Testnet",
    nativeCurrency: {
        decimals: 18,
        name: "Matic",
        symbol: "MATIC",
    },
    rpcUrls: {
        default: {
            http: [
                "https://rpc-amoy.polygon.technology/",
            ],
        },
    },
    blockExplorers: {
        default: {
            name: "Polygon Amoy Explorer",
            url: "https://www.oklink.com/amoy",
        },
    },
    testnet: true,
});
export const publicClient = createPublicClient({
    chain: polygonTestnetConfig,
    transport: http(),
});
if (!process.env.PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY environment variable is required");
}
const parsedPrivateKey = privateKeySchema.parse(process.env.PRIVATE_KEY);
export const account = privateKeyToAccount(parsedPrivateKey);
export const walletClient = createWalletClient({
    account: account,
    chain: polygonTestnetConfig,
    transport: http(),
});
//# sourceMappingURL=config.js.map
import dotenv from "dotenv";
import {
  createPublicClient,
  createWalletClient,
  defineChain,
  http,
  type WalletClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { privateKeySchema } from "./tools/requiredtools/privatekeyschema.js";

dotenv.config();

export const rootstockTestnetConfig = defineChain({
  id: 31, // Rootstock Testnet chainId
  name: "Rootstock Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Rootstock RBTC",
    symbol: "tRBTC", // testnet RBTC
  },
  rpcUrls: {
    default: {
      http: ["https://public-node.testnet.rsk.co"], // official RSK testnet RPC
    },
  },
  blockExplorers: {
    default: {
      name: "RSK Testnet Explorer",
      url: "https://explorer.testnet.rsk.co",
    },
  },
  testnet: true,
});

export const publicClient = createPublicClient({
  chain: rootstockTestnetConfig,
  transport: http(),
});

if (!process.env.PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY environment variable is required");
}

const parsedPrivateKey = privateKeySchema.parse(process.env.PRIVATE_KEY);
export const account = privateKeyToAccount(parsedPrivateKey as `0x${string}`);

export const walletClient: WalletClient = createWalletClient({
  account: account,
  chain: rootstockTestnetConfig,
  transport: http(),
});
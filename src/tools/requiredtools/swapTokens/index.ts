import type { Address, Hex } from "viem";
import { createPublicClient, createWalletClient, defineChain, erc20Abi, http, isAddress, parseUnits } from "viem";
import { account } from "../../../config.js";
import type { SwapTokensInput } from "./schema.js";

// Uniswap V3 SwapRouter exactInputSingle ABI
const swapRouterAbi = [
  {
    type: "function",
    name: "exactInputSingle",
    stateMutability: "payable",
    inputs: [
      {
        name: "params",
        type: "tuple",
        components: [
          { name: "tokenIn", type: "address" },
          { name: "tokenOut", type: "address" },
          { name: "fee", type: "uint24" },
          { name: "recipient", type: "address" },
          { name: "deadline", type: "uint256" },
          { name: "amountIn", type: "uint256" },
          { name: "amountOutMinimum", type: "uint256" },
          { name: "sqrtPriceLimitX96", type: "uint160" },
        ],
      },
    ],
    outputs: [{ name: "amountOut", type: "uint256" }],
  },
] as const;

// Single supported network: Sepolia
const sepolia = defineChain({
  id: 11155111,
  name: "Sepolia",
  nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.sepolia.org", "https://1rpc.io/sepolia"] } },
  blockExplorers: { default: { name: "Etherscan", url: "https://sepolia.etherscan.io" } },
  testnet: true,
});

// Hardcoded Uniswap V3 SwapRouter for Sepolia (provided by user)
const SWAP_ROUTER_SEPOLIA: Address = "0xE5E20F2977B83D39421E7B0c81f35C128e05d70d";

function getClientsForSepolia() {
  const chain = sepolia;
  const publicClient = createPublicClient({ chain, transport: http() });
  const walletClient = createWalletClient({ chain, transport: http(), account });
  return { chain, publicClient, walletClient };
}

export async function swapTokens(input: SwapTokensInput) {
  const {
    tokenIn,
    tokenOut,
    fee = 3000,
    amountIn,
    slippageBps = 300,
    recipient,
    deadlineSecondsFromNow = 600,
  } = input;

  if (!isAddress(tokenIn)) throw new Error("Invalid tokenIn");
  if (!isAddress(tokenOut)) throw new Error("Invalid tokenOut");

  const { publicClient, walletClient } = getClientsForSepolia();

  // Resolve decimals of tokenIn to convert human amount to base units
  const decimals = await publicClient.readContract({
    address: tokenIn as Address,
    abi: erc20Abi,
    functionName: "decimals",
  });

  const amountInWei = parseUnits(amountIn, Number(decimals));

  // Check allowance and approve if necessary
  const owner = account.address as Address;
  const spender = SWAP_ROUTER_SEPOLIA as Address;

  const currentAllowance = await publicClient.readContract({
    address: tokenIn as Address,
    abi: erc20Abi,
    functionName: "allowance",
    args: [owner, spender],
  });

  let approvalTxHash: Hex | undefined;
  if (currentAllowance < amountInWei) {
    approvalTxHash = await walletClient.writeContract({
      address: tokenIn as Address,
      abi: erc20Abi,
      functionName: "approve",
      args: [spender, amountInWei],
      account,
    });
  }

  // Build exactInputSingle params
  const to: Address = (recipient as Address) || (owner as Address);
  const deadline = BigInt(Math.floor(Date.now() / 1000) + deadlineSecondsFromNow);

  // For simplicity on testnets, set amountOutMinimum to 0; in production use a quoter to compute minOut from slippage
  const amountOutMinimum = 0n;

  const params = {
    tokenIn: tokenIn as Address,
    tokenOut: tokenOut as Address,
    fee: fee as unknown as number,
    recipient: to,
    deadline,
    amountIn: amountInWei,
    amountOutMinimum,
    sqrtPriceLimitX96: 0n,
  } as const;

  const swapTxHash = await walletClient.writeContract({
    address: SWAP_ROUTER_SEPOLIA as Address,
    abi: swapRouterAbi,
    functionName: "exactInputSingle",
    args: [params],
    account,
  });

  return {
    content: [
      { type: "text", text: `ApproveTx: ${approvalTxHash ?? "skipped"}` },
      { type: "text", text: `SwapTx: ${swapTxHash}` },
    ],
  };
}

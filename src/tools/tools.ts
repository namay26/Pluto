import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { sendFundsInputSchema } from "./requiredtools/sendFunds/schema.js";

export const GET_LATEST_BLOCK_TOOL: Tool = {
  name: "get_latest_block",
  description: "Get the latest block number",
  inputSchema: {
    type: "object",
    properties: {},
    required: [],
  },
};

export const SEND_FUNDS_TOOL: Tool = {
  name: "send_funds",
  description: "Send funds between two wallets",
  inputSchema: {
    type: "object",
    properties: sendFundsInputSchema.shape,
    required: ["receiverAddress", "amountToSend"],
  },
};

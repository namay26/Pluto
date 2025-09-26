import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export const GET_LATEST_BLOCK_TOOL: Tool = {
  name: "get_latest_block",
  description: "Get the latest block number",
  inputSchema: {
    type: "object",
    properties: {},
    required: [],
  },
};
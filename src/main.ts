import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type CallToolRequest,
} from "@modelcontextprotocol/sdk/types.js";

import {
  GET_LATEST_BLOCK_TOOL
} from "./tools/tools.js";
import { getLatestBlock } from "./tools/requiredtools/getlatestblock/index.js";


async function main() {
  console.error("Starting Polygon MCP server...");
  
  const server = new Server(
    {
      name: "polygon",
      version: "0.0.1",
    },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(
    CallToolRequestSchema,
    async (request: CallToolRequest) => {
      console.error("Received request:", request);
      try {
        const { name, arguments: args } = request.params;

        switch (name) {
          case "get_latest_block": {
            const latestBlock = await getLatestBlock();
            return latestBlock;
          }

          default: {
            throw new Error(

              `Tool '${name}' not found. Available tools: get_latest_block`
            );
        }
      }
      } catch (error) {
        console.error("Error handling request:", error);
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    }
  );
  

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    console.error("Received ListToolsRequest");
    return {

      tools: [
        GET_LATEST_BLOCK_TOOL,
      ],

    };
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Polygon MCP Server running on stdio");
}

main().catch(error => {
  console.error("Fatal error in main():", error);
});

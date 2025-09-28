import { RootstockPassbookMCPServer } from "./mcpServer.js";
import { SubgraphMCPClient } from "./mcpClient.js";
import { buildPassbook } from "./passbook.js";

function printUsage() {
  console.log("Usage:\n  pnpm dev -- --address <0x...> [--limit 12]\n  npm run dev -- --address <0x...> [--limit 12]\n\nOptional keyword discovery instead of address:\n  npm run dev -- --keywords Rootstock,RSK,transactions,transfers [--limit 12]\n\nFor MCP server mode:\n  npm run start (runs as MCP server for Claude)\n");
}

function formatEntry(e: any, idx: number) {
  const ts = e.timestamp ? new Date(Number(e.timestamp) * (String(e.timestamp).length > 10 ? 1 : 1000)) : undefined;
  const timeStr = ts ? ts.toISOString() : "";
  const bn = e.blockNumber != null ? ` block#${e.blockNumber}` : "";
  const asset = e.asset ? ` ${e.asset}` : "";
  const fee = e.fee ? ` fee=${e.fee}` : "";
  const status = e.status ? ` status=${e.status}` : "";
  console.log(`${idx + 1}. ${e.direction?.toUpperCase()} ${e.value || ""}${asset} -> ${e.counterparty || "?"}${bn}\n   hash=${e.hash}${fee}${status}\n   time=${timeStr}`);
}

async function runMCPServer() {
  const server = new RootstockPassbookMCPServer();
  
  // Handle JSON-RPC messages from stdin
  process.stdin.setEncoding('utf8');
  
  process.stdin.on('data', async (data) => {
    try {
      const lines = data.toString().trim().split('\n');
      for (const line of lines) {
        if (line.trim()) {
          const request = JSON.parse(line);
          const response = await server.handleRequest(request);
          console.log(JSON.stringify(response));
        }
      }
    } catch (error) {
      console.error('Error processing MCP request:', error);
    }
  });

  process.stdin.on('end', () => {
    process.exit(0);
  });

  // Keep the process alive
  process.stdin.resume();
}

async function runCLI() {
  const args = process.argv.slice(2);
  const argMap: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith("--")) {
      const key = a.replace(/^--/, "");
      const val = args[i + 1] && !args[i + 1].startsWith("--") ? args[++i] : "true";
      argMap[key] = val;
    }
  }

  if (!argMap.address && !argMap.keywords) {
    printUsage();
    return;
  }

  const address = argMap.address;
  const keywords = argMap.keywords ? argMap.keywords.split(",").map(s => s.trim()).filter(Boolean) : undefined;
  const limit = argMap.limit ? Number(argMap.limit) : 12;

  const client = new SubgraphMCPClient();

  try {
    const result = await buildPassbook(client, { address, keywords, limit });
    console.log(`\nSelected deployment: [${result.selected.type}] ${result.selected.value}${result.selected.name ? " (" + result.selected.name + ")" : ""}`);
    console.log("\nLast transactions:\n");
    result.entries.slice(0, limit).forEach((e, i) => formatEntry(e, i));
  } catch (err: any) {
    console.error("Error:", err?.message || err);
    console.error("\nNote: This CLI mode uses the implemented MCP tools to build the passbook.");
  }
}

async function main() {
  // Check if we should run as MCP server or CLI
  const isMCPServer = process.argv.includes('--mcp-server') || 
                      process.env.NODE_ENV === 'mcp' ||
                      !process.stdin.isTTY;

  if (isMCPServer) {
    console.error('Starting Rootstock Passbook MCP Server...');
    await runMCPServer();
  } else {
    await runCLI();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
# TRBTC Agent

A specialized MCP agent that can send funds when users ask to buy TRBTC using your Pluto MCP server.

## Features

- 🤖 AI-powered agent that understands natural language requests to buy TRBTC
- 🔗 Connects to your Pluto MCP server for blockchain operations
- 💰 Executes `send_funds` transactions automatically
- 🛡️ Validates addresses and amounts before sending
- 📝 Provides clear feedback on transaction status

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

Or using uv (recommended):

```bash
uv add "mcp-agent"
```

### 2. Configure API Keys

Edit `mcp_agent.secrets.yaml` and add your Google Gemini API key:

```yaml
google:
  api_key: "your-actual-google-api-key-here"
```

### 3. Ensure Your MCP Server is Ready

Make sure your Pluto MCP server at `/Users/sohamvijay/Desktop/Pluto/src/main.ts` is working and has the `send_funds` tool available.

## Usage

### Run the Agent

```bash
python trbtc_agent.py
```

### Example Interactions

The agent will prompt you for input. You can ask things like:

- "I want to buy TRBTC"
- "Send 0.1 TRBTC to 0x742d35Cc6634C0532925a3b8D4C8db4C4C8db4C4"
- "Transfer funds to my friend's wallet"

### Example Conversation

```
🤖 Ask me to buy TRBTC or send funds (type 'quit' to exit): I want to buy 0.5 TRBTC

✅ Agent Response: I can help you buy TRBTC by sending funds. To proceed, I need:
1. The receiver address (wallet address where you want to send the TRBTC)
2. The amount to send (you mentioned 0.5 TRBTC)

Could you please provide the receiver address?

🤖 Ask me to buy TRBTC or send funds (type 'quit' to exit): Send to 0x742d35Cc6634C0532925a3b8D4C8db4C4C8db4C4

✅ Agent Response: Perfect! I'll send 0.5 TRBTC to address 0x742d35Cc6634C0532925a3b8D4C8db4C4C8db4C4.

[Calls send_funds tool with the provided parameters]

Transaction completed successfully! Hash: 0x...
```

## Configuration Files

### `mcp_agent.config.yaml`
- Defines the MCP servers (including your Pluto server)
- Sets up Google Gemini as the LLM provider
- Configures logging

### `mcp_agent.secrets.yaml`
- Contains sensitive information like API keys
- Should be kept secure and not committed to version control

### `trbtc_agent.py`
- Main agent script
- Defines the agent's behavior and instructions
- Handles the interactive loop

## How It Works

1. **Agent Initialization**: The agent connects to your Pluto MCP server and lists available tools
2. **User Input**: You provide natural language requests about buying TRBTC
3. **LLM Processing**: Google Gemini 2.0 Flash processes your request and determines if it needs to call the `send_funds` tool
4. **Tool Execution**: If needed, the agent calls your MCP server's `send_funds` tool with the appropriate parameters
5. **Response**: The agent provides feedback about the transaction

## Tool Parameters

The `send_funds` tool accepts:
- `receiverAddress`: Valid HyperEVM address (0x format)
- `amountToSend`: Amount as a string (e.g., "0.1")
- `maxFeePerGas`: Optional, defaults to "20"
- `maxPriorityFeePerGas`: Optional, defaults to "2"

## Security Notes

- Keep your `mcp_agent.secrets.yaml` file secure
- The agent will validate addresses before sending funds
- Always verify transaction details before confirming

## Troubleshooting

1. **MCP Server Connection Issues**: Ensure your Pluto server is running and accessible
2. **API Key Issues**: Verify your Google Gemini API key is correct in the secrets file
3. **Tool Not Found**: Check that your MCP server exposes the `send_funds` tool correctly

## Extending the Agent

You can modify `trbtc_agent.py` to:
- Add more sophisticated transaction logic
- Implement additional safety checks
- Add support for other cryptocurrencies
- Integrate with price feeds for better UX

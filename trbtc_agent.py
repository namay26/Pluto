import asyncio
import os
from mcp_agent.app import MCPApp
from mcp_agent.agents.agent import Agent
from mcp_agent.workflows.llm.augmented_llm_google import GoogleAugmentedLLM

app = MCPApp(name="trbtc_agent")

async def main():
    """
    TRBTC Agent - An agent that can send funds when users ask to buy TRBTC
    """
    async with app.run() as mcp_agent_app:
        logger = mcp_agent_app.logger
        logger.info("Starting TRBTC Agent...")
        
        # Create an agent that can access your Pluto MCP server
        trbtc_agent = Agent(
            name="trbtc_trader",
            instruction="""You are a TRBTC trading agent. When users ask to buy TRBTC or send funds, 
            you can help them by using the send_funds tool. You should:
            
            1. Ask for the receiver address if not provided
            2. Ask for the amount to send if not provided  
            3. Use the send_funds tool to execute the transaction
            4. Provide clear feedback about the transaction status
            
            Always be helpful and explain what you're doing step by step.""",
            server_names=["pluto"],  # This matches the server name in config
        )

        async with trbtc_agent:
            # List available tools to verify connection
            tools = await trbtc_agent.list_tools()
            logger.info(f"Available tools: {[tool['name'] if isinstance(tool, dict) else str(tool) for tool in tools]}")
            
            # Attach Google Gemini LLM to the agent
            llm = await trbtc_agent.attach_llm(GoogleAugmentedLLM)
            
            logger.info("TRBTC Agent is ready! You can now interact with it.")
            
            # Interactive loop
            while True:
                try:
                    user_input = input("\n🤖 Ask me to buy TRBTC or send funds (type 'quit' to exit): ")
                    
                    if user_input.lower() in ['quit', 'exit', 'q']:
                        logger.info("Goodbye!")
                        break
                    
                    if not user_input.strip():
                        continue
                    
                    # Process the user request
                    logger.info(f"Processing request: {user_input}")
                    result = await llm.generate_str(message=user_input)
                    
                    print(f"\n✅ Agent Response: {result}")
                    
                except KeyboardInterrupt:
                    logger.info("Interrupted by user. Goodbye!")
                    break
                except Exception as e:
                    logger.error(f"Error processing request: {e}")
                    print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())

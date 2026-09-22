import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ 
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

async function setupMCPServer() {
  console.log("Starting Playwright MCP Server...");
  
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["-y", "@playwright/mcp@latest", "--headless"],
  });

  const client = new Client(
    { name: "playwright-portfolio-agent", version: "1.0.0" },
    { capabilities: {} }
  );

  await client.connect(transport);
  const tools = await client.listTools();
  
  return { client, mcpTools: tools.tools };
}

async function runAutonomousAgent(instruction: string) {
  const { client, mcpTools } = await setupMCPServer();

  // 1. Map Playwright MCP tools into OpenAI's tool format
  const openAiTools = mcpTools.map((tool: any) => ({
    type: "function" as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema,
    },
  }));

  const messages: any[] = [
    {
      role: "system",
      content: "You are an autonomous QA agent. Use the provided tools to navigate the browser and complete instructions based on the accessibility tree. Return a final summary when finished."
    },
    { role: "user", content: instruction }
  ];

  console.log(`\n🤖 Instruction: "${instruction}"\n`);

  // 2. The Execution Loop
  while (true) {
    // Pause for 12 seconds to respect the free tier rate limit
    console.log("⏳ Pausing for 12 seconds to prevent API rate limiting...");
    await new Promise(resolve => setTimeout(resolve, 12000));

    const response = await openai.chat.completions.create({
      model: "gemini-3.5-flash-lite", 
      messages: messages,
      tools: openAiTools,
    });

    const message = response.choices[0].message;
    messages.push(message);

    // If the LLM decides no more tools are needed, it returns a text response
    if (!message.tool_calls || message.tool_calls.length === 0) {
      console.log(`\n🏁 Agent Finished:\n${message.content}`);
      break;
    }

    // 3. Execute the tools requested by the LLM
    for (const toolCall of message.tool_calls) {
      // Type guard added to handle OpenAI's strict discriminating unions
      if (toolCall.type !== 'function') continue;

      console.log(`🛠️ Action: ${toolCall.function.name}`);
      
      try {
        const args = JSON.parse(toolCall.function.arguments);
        
        // Pass the action to the Playwright browser
        const mcpResponse: any = await client.callTool({
          name: toolCall.function.name,
          arguments: args,
        });

        // Extract the browser's response (e.g., the DOM state after clicking)
        const content = mcpResponse.content && mcpResponse.content.length > 0 
          ? mcpResponse.content.map((c: any) => c.text).join('\n')
          : "Tool executed successfully.";

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: content,
        });
        
      } catch (error: any) {
        console.error(`❌ Error with ${toolCall.function.name}:`, error.message);
        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: `Error: ${error.message}`,
        });
      }
    }
  }
}

// 4. Test the agent against the demo site
runAutonomousAgent("Go to https://www.saucedemo.com/, log in with username 'standard_user' and password 'secret_sauce', and tell me the name of the first product on the page.")
  .catch(console.error);
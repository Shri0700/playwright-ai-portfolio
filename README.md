🤖 Autonomous AI QA Agent

An advanced, AI-driven browser automation project showcasing the future of Software Quality Engineering. This repository demonstrates the seamless integration of traditional deterministic testing with self-reasoning, autonomous AI agents.

Unlike traditional automation scripts that break when UI elements change, this agent uses the Model Context Protocol (MCP) to read the browser's accessibility tree, reason about its next steps, and execute commands dynamically using large language models.

🚀 Key Features

Autonomous Navigation: The agent receives natural language instructions and determines the exact clicks, typing, and navigation steps required to complete the task.

Self-Healing Automation: By relying on the accessibility tree instead of rigid pixel-based locators or strict CSS selectors, the script dynamically adapts to UI changes.

Cost-Effective AI Integration: Powered by Google's Gemini 3.5 Flash Lite API, optimizing for high-speed reasoning while maintaining strict free-tier rate limits via programmed execution delays.

Hybrid QA Architecture: Includes both traditional deterministic UI/API tests and non-deterministic AI agent loops.

🛠️ Technology Stack

Core: Node.js, TypeScript

Automation: Playwright

AI Orchestration: Model Context Protocol (MCP), OpenAI SDK Wrapper

LLM: Google Gemini API (gemini-3.5-flash-lite)

⚙️ Installation & Setup

Clone the repository:

git clone https://github.com/Shri0700/playwright-ai-portfolio.git
cd playwright-ai-portfolio


Install dependencies:

npm install


Configure Environment Variables:
Create a .env file in the root directory and add your Gemini API key:

GEMINI_API_KEY=your_google_gemini_api_key_here


💻 Usage

Run the Autonomous Agent

Execute the AI agent to watch it autonomously reason through a login flow and extract product information from the SauceDemo testing site:

npx tsx agent.ts


Note: The agent includes a built-in 12-second delay between actions to respect Gemini's free-tier rate limits. For production enterprise use, this delay can be removed by upgrading to a pay-as-you-go API tier.

Run Deterministic Tests

To execute the standard Playwright UI and API health checks:

npx playwright test


🧠 How the Agent Works

Initialization: The script spins up a headless Playwright browser via the MCP server.

Tool Mapping: Playwright's native actions (navigate, click, fill, snapshot) are mapped as functional tools for the LLM.

The Execution Loop:

The Gemini model evaluates the current browser state.

It selects a tool to execute (e.g., browser_fill_form).

The MCP server performs the action and returns the new DOM state.

This loop continues until the original natural language instruction is successfully fulfilled.
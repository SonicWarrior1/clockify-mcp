import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import registerProjectTools from "./tools/project.js";
import registerReportTools from "./tools/reports.js";
import registerUserTools from "./tools/users.js";
import registerTaskTools from "./tools/tasks.js";
import registerClientTools from "./tools/clients.js";
import registerTimeEntryTools from "./tools/timeEntry.js";
import registerTagsTools from "./tools/tags.js";
import dotenv from "dotenv";

dotenv.config();

// Create server instance
const server = new McpServer({
  name: "mcp-server",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Projects Tool
registerProjectTools(server);

// Reports Tool
registerReportTools(server);

// Users Tool
registerUserTools(server);

// Tasks Tool
registerTaskTools(server);

// Clients Tool
registerClientTools(server);

// Time Entries Tool
registerTimeEntryTools(server);

// Tags Tool
registerTagsTools(server);

// Start the server with stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio");
}

// Run the main function and catch any unhandled errors
main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

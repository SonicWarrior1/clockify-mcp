# Clockify MCP Server

A Model Context Protocol (MCP) server that provides integration with the Clockify time tracking API. This server enables AI assistants to interact with Clockify workspaces, projects, tasks, time entries, reports, users, clients, and tags.

## Features

- 🕐 **Time Entries**: Create, read, update, and delete time entries
- 📋 **Projects**: Manage projects, assign users, and configure settings
- 📊 **Reports**: Generate detailed and summary reports
- 👥 **Users**: Manage workspace users and their permissions
- 🏢 **Clients**: Handle client information and project associations
- 🏷️ **Tags**: Organize time entries with custom tags
- ✅ **Tasks**: Create and manage project tasks

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- A Clockify account and API key
- Clockify workspace ID

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SonicWarrior1/clockify-mcp
   cd mcp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   CLOCKIFY_API_KEY=your_clockify_api_key_here
   CLOCKIFY_WORKSPACE_ID=your_workspace_id_here
   ```

   To get your Clockify API key:
   - Log in to your Clockify account
   - Go to User Settings → API
   - Generate a new API key

   To get your workspace ID:
   - Go to your Clockify workspace
   - The workspace ID is in the URL: `https://app.clockify.me/workspaces/{WORKSPACE_ID}/dashboard`

4. **Build the project**
   ```bash
   npm run build
   ```

## Usage

### Running the MCP Server

```bash
npm run build
npx @modelcontextprotocol/inspector node ./build/index.js
```

Or directly:
```bash
node ./build/index.js
```

### Available Tools

#### Project Management
- `get_projects` - Retrieve all projects with optional filters
- `get_project_by_id` - Get detailed project information
- `add_project` - Create a new project
- `update_project` - Modify existing project
- `delete_project` - Remove a project
- `mangage_users_project` - Assign/remove users from projects

#### Time Tracking
- `get_time_entries` - Retrieve time entries with filters
- `get_time_entry_by_id` - Get specific time entry details
- `add_time_entry` - Create new time entries
- `update_time_entry` - Modify existing time entries
- `delete_time_entry` - Remove time entries

#### Reporting
- `get_detailed_report` - Generate comprehensive reports
- `get_summary_report` - Get summary statistics

#### User Management
- `get_users` - List workspace users
- `get_user_by_id` - Get user details
- `add_user` - Invite new users
- `update_user` - Modify user information
- `delete_user` - Remove users

#### Client Management
- `get_clients` - List all clients
- `get_client_by_id` - Get client details
- `add_client` - Create new clients
- `update_client` - Modify client information
- `delete_client` - Remove clients

#### Task Management
- `get_tasks` - Retrieve project tasks
- `get_task_by_id` - Get task details
- `add_task` - Create new tasks
- `update_task` - Modify tasks
- `delete_task` - Remove tasks

#### Tag Management
- `get_tags` - List available tags
- `add_tag` - Create new tags
- `update_tag` - Modify tags
- `delete_tag` - Remove tags

## Development

### Project Structure

```
mcp/
├── src/                    # TypeScript source code
│   ├── tools/             # Individual tool implementations
│   │   ├── clients.ts     # Client management tools
│   │   ├── project.ts     # Project management tools
│   │   ├── reports.ts     # Reporting tools
│   │   ├── tags.ts        # Tag management tools
│   │   ├── tasks.ts       # Task management tools
│   │   ├── timeEntry.ts   # Time entry tools
│   │   └── users.ts       # User management tools
│   ├── constants.ts       # API constants
│   ├── env.d.ts          # Environment type definitions
│   ├── index.ts          # Main server entry point
│   ├── types.ts          # Shared TypeScript types
│   └── utils.ts          # Utility functions
├── build/                 # Compiled JavaScript output
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

### Building

```bash
npm run build
```

This compiles TypeScript files from `src/` to `build/` directory.

### Inspection

Use the MCP Inspector to test and debug your server:

```bash
npm run inspect
```

This opens the MCP Inspector interface where you can test individual tools and examine their responses.

## Testing with Claude for Desktop

You can test your Clockify MCP server directly with Claude for Desktop. This allows you to interact with your Clockify workspace through natural language conversations.

### Prerequisites

1. **Install Claude for Desktop** - Download the latest version from [Claude Desktop](https://claude.ai/download)
2. **Ensure your server is built** - Run `npm run build` to compile your TypeScript code

### Configuration

1. **Open Claude Desktop configuration file**:

   **Windows:**
   ```powershell
   code $env:AppData\Claude\claude_desktop_config.json
   ```

   **macOS/Linux:**
   ```bash
   code ~/Library/Application\ Support/Claude/claude_desktop_config.json
   ```

   *Note: Create the file if it doesn't exist.*

2. **Add your Clockify MCP server configuration**:

   ```json
   {
     "mcpServers": {
       "clockify": {
         "command": "node",
         "args": ["C:\\PATH\\TO\\PARENT\\FOLDER\\mcp\\build\\index.js"]
       }
     }
   }
   ```

   **Important:** Replace the path with the absolute path to your compiled `index.js` file and add your actual Clockify credentials.

3. **Save the file and restart Claude for Desktop**

### Using the Server

Once configured, you can interact with your Clockify workspace through Claude. The MCP tools will be available when you chat with Claude. For example, you can ask:

- "Show me all my projects in Clockify"
- "Create a new time entry for 2 hours on the website project"
- "Generate a summary report for this week"
- "List all users in my workspace"
- "Add a new task to my project"

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues related to:
- **Clockify API**: Check [Clockify API Documentation](https://clockify.me/developers-api)
- **MCP Protocol**: Visit [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- **This Server**: Create an issue in this repository

# MCP File Assistant Server

[![npm version](https://img.shields.io/npm/v/vpbhaskar-mcp-fileassistant.svg)](https://www.npmjs.com/package/vpbhaskar-mcp-fileassistant)
[![npm](https://img.shields.io/npm/dm/vpbhaskar-mcp-fileassistant.svg)](https://www.npmjs.com/package/vpbhaskar-mcp-fileassistant)

A **Model Context Protocol (MCP)** server that provides AI assistants with powerful file management capabilities. This server enables AI tools like Cursor IDE to read, write, edit, list, and delete files within a designated workspace folder through a standardized protocol.

**📦 Available on npm:** [`vpbhaskar-mcp-fileassistant`](https://www.npmjs.com/package/vpbhaskar-mcp-fileassistant) (v1.0.4)  
**🔗 GitHub Repository:** [iamvpbhaskar/mcp-fileAssistant](https://github.com/iamvpbhaskar/mcp-fileAssistant)

## 🎯 What is This Project?

This project implements an **MCP Server** that acts as a bridge between AI assistants and your file system. Instead of AI assistants directly accessing your files (which could be a security risk), this server provides controlled, safe access to a specific workspace directory.

### Why MCP?

**Model Context Protocol (MCP)** is an open protocol developed by Anthropic that standardizes how AI assistants interact with external tools and data sources. By creating an MCP server, you're building a reusable tool that any MCP-compatible AI assistant can use.

### What Can You Build With This?

With this MCP server, you can:
- **Create file management workflows** - Let AI assistants help you organize, create, and manage files
- **Build content generation tools** - Generate documents, code files, configurations, etc.
- **Automate file operations** - Batch edits, file transformations, content updates
- **Create AI-powered file assistants** - Let AI read, analyze, and modify files based on natural language instructions

## ✨ Features

This MCP server provides six core file management tools:

- 📋 **List Files** - List all files in the workspace directory
- 📖 **Read File** - Read the contents of any file in the workspace
- ✍️ **Write File** - Create new files or overwrite existing ones
- ✏️ **Edit File** - Edit specific lines in existing files (line-by-line editing)
- 🗑️ **Delete File** - Remove files from the workspace
- 📋 **Sync File** - Copy files from project root directory to workspace folder

## 🏗️ Project Structure

```
mcp-fileAssistant/
├── index.js              # Main MCP server implementation
├── package.json          # Project dependencies and metadata
├── workspace/            # Directory where all file operations occur
│   └── test.txt         # Example file (safe workspace)
├── README.md            # This file
└── .gitignore           # Git ignore file (excludes node_modules, etc.)
```


## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Cursor IDE** (or any MCP-compatible client)

### Installation

#### Option 1: Install from npm (Recommended)

```bash
npm install -g vpbhaskar-mcp-fileassistant
```

Or install locally in your project:
```bash
npm install vpbhaskar-mcp-fileassistant
```

#### Option 2: Clone from GitHub

1. **Clone the repository:**
```bash
git clone https://github.com/iamvpbhaskar/mcp-fileAssistant.git
cd mcp-fileAssistant
```

2. **Install dependencies:**
```bash
npm install
```

3. **Test the server (optional):**
```bash
node index.js
```
You should see: `✅ File MCP Server started successfully!`

## ⚙️ Configuration for Cursor IDE

To use this MCP server with Cursor IDE, you need to configure it in your MCP settings file.

### Step 1: Locate MCP Configuration File

The MCP configuration file is located at:
- **Windows:** `C:\Users\<YourUsername>\.cursor\mcp.json`
- **macOS/Linux:** `~/.cursor/mcp.json`

### Step 2: Add Server Configuration

Open `mcp.json` and add the following configuration:

#### If installed via npm (Global):
```json
{
  "mcpServers": {
    "vpbhaskar-mcp-fileassistant": {
      "command": "node",
      "args": ["<npm-global-path>/node_modules/vpbhaskar-mcp-fileassistant/index.js"],
      "env": {}
    }
  }
}
```

#### If installed locally or cloned from GitHub:
```json
{
  "mcpServers": {
    "vpbhaskar-mcp-fileassistant": {
      "command": "node",
      "args": ["<absolute-path-to-project>/vpbhaskar-mcp-fileassistant/index.js"],
      "env": {}
    }
  }
}
```

**Example for Windows (local installation):**
```json
{
  "mcpServers": {
    "vpbhaskar-mcp-fileassistant": {
      "command": "node",
      "args": ["C:\\Users\\YourUsername\\Desktop\\mcp-fileAssistant\\index.js"],
      "env": {}
    }
  }
}
```

**Example for macOS/Linux (local installation):**
```json
{
  "mcpServers": {
    "vpbhaskar-mcp-fileassistant": {
      "command": "node",
      "args": ["/Users/username/projects/vpbhaskar-mcp-fileassistant/index.js"],
      "env": {}
    }
  }
}
```

**Note:** To find your npm global path, run: `npm root -g`
### Step 3: Restart Cursor IDE

After adding the configuration, restart Cursor IDE to load the MCP server.

### Step 4: Verify Installation

Once Cursor restarts, you should see the MCP server tools available. You can verify by:
1. Opening Cursor's chat/command palette
2. The AI assistant should now have access to file management tools
3. Try asking: "List all files in the workspace" or "Create a new file called example.txt"

## 📖 How It Works

### Architecture

```
┌─────────────┐         MCP Protocol         ┌──────────────────┐
│             │ ◄──────────────────────────► │                  │
│ Cursor IDE  │     (JSON-RPC over stdio)   │  MCP File Server │
│  (Client)   │                              │   (This Project) │
│             │                              │                  │
└─────────────┘                              └──────────────────┘
                                                      │
                                                      │ File Operations
                                                      ▼
                                              ┌───────────────┐
                                              │   workspace/  │
                                              │   Directory   │
                                              └───────────────┘
```

1. **Cursor IDE** sends requests via MCP protocol (JSON-RPC over stdio)
2. **MCP Server** receives the request and validates it using Zod schemas
3. **File System** operations are performed in the `workspace/` directory
4. **Response** is sent back to Cursor IDE with results

### Security

- ✅ All file operations are **scoped to the `workspace/` directory** only
- ✅ No access to files outside the workspace (prevents accidental deletion/modification)
- ✅ Input validation using Zod schemas
- ✅ Error handling for invalid operations

## 🔧 API Reference

### Tool: `list_files`

Lists all files in the workspace directory.

**Output:**
```json
{
  "files": ["file1.txt", "file2.js", "example.md"]
}
```

### Tool: `read_file`

Reads the content of a file.

**Input:**
```json
{
  "filename": "example.txt"
}
```

**Output:**
```json
{
  "content": "File content here..."
}
```

### Tool: `write_file`

Creates or overwrites a file with the given content.

**Input:**
```json
{
  "filename": "example.txt",
  "content": "New file content"
}
```

**Output:**
```json
{
  "success": true
}
```

### Tool: `edit_file`

Edits specific lines in an existing file. Useful for making targeted changes without rewriting entire files.

**Input:**
```json
{
  "filename": "example.txt",
  "edits": [
    { "line": 1, "newText": "Updated line 1" },
    { "line": 3, "newText": "Updated line 3" }
  ]
}
```

**Output:**
```json
{
  "success": true,
  "message": "Edited 2 line(s)."
}
```

### Tool: `delete_file`

Deletes a file from the workspace.

**Input:**
```json
{
  "filename": "example.txt"
}
```

**Output:**
```json
{
  "success": true
}
```

### Tool: `sync_file`

Copies a file from the project root directory to the workspace folder. Useful for syncing files like `resume.html` to the workspace.

**Input:**
```json
{
  "filename": "resume.html"
}
```

**Output:**
```json
{
  "success": true,
  "message": "Successfully synced resume.html to workspace folder."
}
```

## 💡 Use Cases

### 1. **Document Generation**
Ask Cursor: *"Create a README.md file for my project with installation instructions"*

### 2. **Code File Management**
Ask Cursor: *"Create a new React component file called Button.jsx with basic structure"*

### 3. **Content Editing**
Ask Cursor: *"Edit line 5 of config.json to change the port to 3000"*

### 4. **File Organization**
Ask Cursor: *"List all files in the workspace and create a summary document"*

### 5. **Batch Operations**
Ask Cursor: *"Read all .txt files and create a combined document"*

## 🛠️ Development

### Project Dependencies

- **`@modelcontextprotocol/sdk`** - Official MCP SDK for Node.js
  - Provides server infrastructure, transport layer, and protocol handling
- **`zod`** - Schema validation library
  - Used for validating input/output schemas in MCP tools

### Code Structure

```javascript
// Server initialization
const server = new McpServer({
  name: "File MCP Server",
  version: "1.0.4",
  description: "File management capabilities"
});

// Tool registration
server.registerTool(
  "tool_name",
  {
    description: "Tool description",
    inputSchema: z.object({ ... }),  // Input validation
    outputSchema: z.object({ ... })  // Output validation
  },
  async (params) => {
    // Tool implementation
  }
);

// Start server
await server.connect(new StdioServerTransport());
```

### Extending the Server

To add new tools, simply register them:

```javascript
server.registerTool(
  "new_tool",
  {
    description: "Description of new tool",
    inputSchema: z.object({ param: z.string() }),
    outputSchema: z.object({ result: z.string() })
  },
  async ({ param }) => {
    // Your tool logic here
    return { structuredContent: { result: "success" } };
  }
);
```

## 🔒 Security Considerations

- **Workspace Isolation**: All operations are limited to the `workspace/` directory
- **Input Validation**: All inputs are validated using Zod schemas
- **Error Handling**: Proper error handling prevents crashes and information leakage
- **No External Network**: This server doesn't make external network calls

## 📦 NPM Package

This package is published on npm and can be installed globally or locally:

```bash
# Global installation
npm install -g vpbhaskar-mcp-fileassistant

# Local installation
npm install vpbhaskar-mcp-fileassistant
```

**Package:** [vpbhaskar-mcp-fileassistant](https://www.npmjs.com/package/vpbhaskar-mcp-fileassistant)  
**Version:** 1.0.4  
**Author:** Ved Prakash Bhaskar

## 📝 License

ISC

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add new file management tools
- Improve error handling
- Add support for additional file operations
- Enhance security features

## 📚 Learn More

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [MCP SDK Documentation](https://github.com/modelcontextprotocol/sdk)
- [Cursor IDE MCP Guide](https://docs.cursor.com/)

## 🎓 What We Built Together

During development, this MCP server was used to:
- Create structured documentation files
- Generate interview preparation materials
- Build professional resume templates
- Demonstrate file management capabilities

The server proved its value by enabling natural language file operations through AI assistants, making file management more intuitive and efficient.

---

**Built with ❤️ using Model Context Protocol**

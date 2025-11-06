// index.js
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory where index.js is located (not process.cwd())
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.join(__dirname, "workspace");
if (!fs.existsSync(ROOT_DIR)) fs.mkdirSync(ROOT_DIR);


const server = new McpServer({
 name: "File MCP Server",
 version: "1.0.0",
 description: "A simple MCP server to read, write, edit, and list files inside a folder."
});


// 🧾 TOOL 1: List files
server.registerTool(
 "list_files",
 {
   description: "List all files inside the workspace folder",
   outputSchema: { files: z.array(z.string()) },
 },
 async () => {
   const files = fs.readdirSync(ROOT_DIR);
   return { structuredContent: { files } };
 }
);


// 📖 TOOL 2: Read a file
server.registerTool(
 "read_file",
 {
   description: "Read content of a file",
   inputSchema: { filename: z.string() },
   outputSchema: { content: z.string() },
 },
 async ({ filename }) => {
   const filePath = path.join(ROOT_DIR, filename);
   if (!fs.existsSync(filePath)) throw new Error("File not found");
   const content = fs.readFileSync(filePath, "utf-8");
   return { structuredContent: { content } };
 }
);


// ✍️ TOOL 3: Write or overwrite file
server.registerTool(
 "write_file",
 {
   description: "Create or overwrite a file with given content",
   inputSchema: { filename: z.string(), content: z.string() },
   outputSchema: { success: z.boolean() },
 },
 async ({ filename, content }) => {
   const filePath = path.join(ROOT_DIR, filename);
   fs.writeFileSync(filePath, content, "utf-8");
   return { structuredContent: { success: true } };
 }
);


// 🧠 TOOL 4: Edit specific lines
server.registerTool(
 "edit_file",
 {
   description: "Edit specific lines in an existing file",
   inputSchema: {
     filename: z.string(),
     edits: z.array(z.object({ line: z.number().min(1), newText: z.string() })),
   },
   outputSchema: { success: z.boolean(), message: z.string() },
 },
 async ({ filename, edits }) => {
   const filePath = path.join(ROOT_DIR, filename);
   if (!fs.existsSync(filePath)) throw new Error("File not found");


   const lines = fs.readFileSync(filePath, "utf-8").split("\n");


   edits.forEach(({ line, newText }) => {
     const idx = line - 1;
     if (idx < 0 || idx >= lines.length) throw new Error(`Invalid line number: ${line}`);
     lines[idx] = newText;
   });


   fs.writeFileSync(filePath, lines.join("\n"), "utf-8");
   return { structuredContent: { success: true, message: `Edited ${edits.length} line(s).` } };
 }
);


// 🗑️ TOOL 5: Delete a file
server.registerTool(
 "delete_file",
 {
   description: "Delete a file by name",
   inputSchema: { filename: z.string() },
   outputSchema: { success: z.boolean() },
 },
 async ({ filename }) => {
   const filePath = path.join(ROOT_DIR, filename);
   if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
   return { structuredContent: { success: true } };
 }
);


// 📋 TOOL 6: Sync file from root to workspace
server.registerTool(
 "sync_file",
 {
   description: "Copy a file from the project root directory to the workspace folder. Use this to sync files like resume.html to workspace.",
   inputSchema: { filename: z.string() },
   outputSchema: { success: z.boolean(), message: z.string() },
 },
 async ({ filename }) => {
   const sourcePath = path.join(__dirname, filename);
   const destPath = path.join(ROOT_DIR, filename);
   
   if (!fs.existsSync(sourcePath)) {
     throw new Error(`File not found in root directory: ${filename}`);
   }
   
   fs.copyFileSync(sourcePath, destPath);
   return { 
     structuredContent: { 
       success: true, 
       message: `Successfully synced ${filename} to workspace folder.` 
     } 
   };
 }
);


// 🚀 Start the server over stdio transport
await server.connect(new StdioServerTransport());
console.log("✅ File MCP Server started successfully!");


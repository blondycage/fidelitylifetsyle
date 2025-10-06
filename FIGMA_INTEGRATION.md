# Figma Developer MCP Integration

This project is now configured with `figma-developer-mcp` to give your coding agent access to Figma data for implementing designs in your Next.js application.

## 🚀 Quick Start

### 1. Get Your Figma API Key

1. Go to [Figma Account Settings](https://www.figma.com/settings)
2. Scroll down to "Personal Access Tokens"
3. Click "Create new token"
4. Give it a name (e.g., "Detty December MCP")
5. Copy the generated token

### 2. Configure Your API Key

Edit the `.env.figma` file and replace `your_figma_api_key_here` with your actual API key:

```bash
FIGMA_API_KEY=figd_your_actual_api_key_here
```

### 3. Start the MCP Server

You can start the Figma MCP server in two ways:

**Option A: Using npm script (recommended)**
```bash
npm run figma:mcp
```

**Option B: Direct command**
```bash
npm run figma:start
```

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `npm run figma:mcp` | Start MCP server with custom script (includes better error handling) |
| `npm run figma:start` | Start MCP server directly |

## 🔧 Configuration

The MCP server runs on port `3001` by default. You can change this in `.env.figma`:

```bash
MCP_PORT=3001
```

## 📋 What You Can Do

With the Figma MCP server running, your coding agent can:

- **Access Figma files** - Read design data from your Figma files
- **Download assets** - Get images, icons, and other assets from Figma
- **Extract design tokens** - Get colors, typography, spacing, and other design system values
- **Implement designs** - Generate code that matches your Figma designs
- **Sync components** - Keep your React components in sync with Figma designs

## 🔗 Connecting to Your AI Assistant

To use this with Cursor or other AI assistants that support MCP:

1. Start the MCP server: `npm run figma:mcp`
2. Configure your AI assistant to connect to the MCP server at `localhost:3001`
3. Provide your Figma file URLs when asking for design implementation

## 📁 File Structure

```
├── .env.figma                 # Figma API configuration
├── scripts/
│   └── figma-mcp.js          # MCP server startup script
├── FIGMA_INTEGRATION.md      # This documentation
└── package.json              # Updated with figma scripts
```

## 🐛 Troubleshooting

### Server won't start
- Make sure you have `figma-developer-mcp` installed globally: `npm install -g figma-developer-mcp`
- Check that your API key is correctly set in `.env.figma`
- Verify the port 3001 is not already in use

### Can't access Figma files
- Ensure your Figma API key has the correct permissions
- Check that the file URLs you're using are accessible with your account
- Verify the MCP server is running and accessible

### Permission errors
- Make sure the script is executable: `chmod +x scripts/figma-mcp.js`
- Check that you have the necessary permissions to run the MCP server

## 📚 Additional Resources

- [Figma Developer MCP Documentation](https://www.framelink.ai)
- [Figma API Documentation](https://www.figma.com/developers/api)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io)

## 🎯 Next Steps

1. Set up your Figma API key
2. Start the MCP server
3. Connect your AI assistant to the MCP server
4. Start implementing designs from Figma in your Next.js app!
#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Configuration
const config = {
  port: process.env.MCP_PORT || 3001,
  envFile: path.join(__dirname, '..', '.env.figma')
};

// Build the command
const args = [
  '--env', config.envFile,
  '--port', config.port.toString()
];

// Add API key if provided via environment variable
if (process.env.FIGMA_API_KEY) {
  args.push('--figma-api-key', process.env.FIGMA_API_KEY);
}

if (process.env.FIGMA_OAUTH_TOKEN) {
  args.push('--figma-oauth-token', process.env.FIGMA_OAUTH_TOKEN);
}

console.log('🚀 Starting Figma Developer MCP Server...');
console.log(`📁 Environment file: ${config.envFile}`);
console.log(`🔌 Port: ${config.port}`);
console.log('');

// Start the MCP server
const mcpProcess = spawn('figma-developer-mcp', args, {
  stdio: 'inherit',
  shell: true
});

mcpProcess.on('error', (error) => {
  console.error('❌ Failed to start Figma MCP server:', error.message);
  console.error('');
  console.error('Make sure you have:');
  console.error('1. Installed figma-developer-mcp globally: npm install -g figma-developer-mcp');
  console.error('2. Set your FIGMA_API_KEY in .env.figma file');
  console.error('3. Get your API key from: https://www.figma.com/developers/api#access-tokens');
  process.exit(1);
});

mcpProcess.on('close', (code) => {
  console.log(`\n🛑 Figma MCP server stopped with code ${code}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Figma MCP server...');
  mcpProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down Figma MCP server...');
  mcpProcess.kill('SIGTERM');
});
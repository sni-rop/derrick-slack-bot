# Derrick Slack Bot

A Slack bot for interacting with OpenClaw AI agents specialized in oil and gas operations.

## Features

- Thread-based conversations when mentioned in channels
- Direct message support for private queries
- Slash command (`/derrick help`) for usage instructions
- Routes queries to OpenClaw AI agents
- Built with [Slack Bolt](https://slack.dev/bolt/ts-tutorial) for TypeScript

## Setup Instructions

### Prerequisites

1. Node.js (v16 or higher)
2. npm or yarn
3. A Slack workspace
4. A Slack App created in your workspace
5. An OpenClaw instance running (local or deployed)

### Slack App Configuration

1. Go to https://api.slack.com/apps and create your app
2. Under "OAuth & Permissions", add these Bot Token Scopes:
   - `app_mentions:read`
   - `channels:history`
   - `channels:read`
   - `chat:write`
   - `groups:history`
   - `groups:read`
   - `im:history`
   - `im:read`
   - `im:write`
   - `mpim:history`
   - `reactions:read`
   - `reactions:write`
3. Click "Install to Workspace" and authorize
4. Copy the **Bot User OAuth Token** (starts with `xoxb-`)
5. Go to "Basic Information" and copy the **Signing Secret**

### Environment Variables

Create a `.env` file in the root directory with:

```
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_SIGNING_SECRET=your-signing-secret-here
OPENACLAW_API_URL=http://your-openclaw-instance:port  # Optional, defaults to localhost:3000
PORT=3000  # Optional, defaults to 3000
```

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

### Deployment to Railway

1. Push this repository to GitHub
2. In Railway, create a new project and connect to your GitHub repo
3. Railway will auto-detect the Node.js project
4. Add the environment variables:
   - `SLACK_BOT_TOKEN`: Your bot token
   - `SLACK_SIGNING_SECRET`: Your signing secret
   - `OPENACLAW_API_URL`: URL to your OpenClaw instance
5. Deploy!

## Usage

Once deployed and installed in your workspace:

- Mention @Derrick Bot in any channel to ask questions
- Send direct messages to the bot for private conversations
- Use `/derrick help` to see available commands

## Example Queries

- "@Derrick Bot What's the current mud weight recommendation for shale formations?"
- "@Derrick Bot Check AER Directive 020 for surface casing vent flow requirements"
- Direct message: "Help me understand hydraulic fracturing stages"

The bot routes your questions to OpenClaw AI agents specialized in oil and gas operations including drilling, completions, production, HSE, and regulatory compliance.

## License

MIT
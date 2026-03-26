import { App } from '@slack/bolt';
import * as dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config();

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// OpenClaw API endpoint (adjust this to your actual endpoint)
const OPENACLAW_API_URL = process.env.OPENACLAW_API_URL || 'http://localhost:3000';

// Helper function to call OpenClaw API
// FIXED: Properly handle Slack event types to avoid TS errors
async function callOpenClawAgent(message: string, context: string = ''): Promise<string> {
  try {
    const response = await axios.post(`${OPENACLAW_API_URL}/agent/query`, {
      message,
      context
    }, {
      timeout: 30000 // 30 second timeout
    });
    return response.data.response || 'No response from agent';
  } catch (error) {
    console.error('Error calling OpenClaw API:', error);
    return 'Sorry, I encountered an error while processing your request.';
  }
}

// Listen for app_mentions (when someone mentions @yourbot)
////// RAILWAY DEPLOYMENT TEST - IF YOU SEE THIS COMMENT, THE FIX IS ACTIVE //////
app.event('app_mention', async ({ event, say }) => {
  try {
    console.log('Received app_mention event:', { 
      user: 'user' in event && typeof event.user === 'string' ? event.user : 'unknown',
      text: 'text' in event && typeof event.text === 'string' ? event.text.substring(0, 50) + '...' : 'no text'
    });

    // Acknowledge the event immediately
    await say({
      text: `_Processing your request..._`
    });

    // Extract text safely - handle different event types
    const messageText = 'text' in event && typeof event.text === 'string' ? event.text : '';
    const userId = 'user' in event && typeof event.user === 'string' ? event.user : '';

    console.log('Processing message from user:', userId, '| Text length:', messageText.length);

    // Call OpenClaw agent with the message
    const response = await callOpenClawAgent(messageText, `Slack user ${userId} mentioned the bot`);

    console.log('Received response from OpenClaw, sending to Slack');

    // Send the response in a thread
    await say({
      text: response
      // Note: thread_ts is handled automatically when responding to app_mention
    });
    
    console.log('Response sent successfully to Slack');
  } catch (error) {
    console.error('Error handling app_mention:', error);
    await say({
      text: 'Sorry, I encountered an error while processing your request.'
    });
  }
});

// Listen for direct messages
app.message(async ({ message, say }) => {
  // Ignore messages from bots to prevent loops
  if (message.subtype && message.subtype === 'bot_message') {
    return;
  }

  try {
    // Acknowledge immediately
    await say({
      text: `_Processing your request..._`
    });

    // Extract text and user ID safely
    const messageText = 'text' in message && typeof message.text === 'string' ? message.text : '';
    const userId = 'user' in message && typeof message.user === 'string' ? message.user : '';

    console.log('Received direct message:', { 
      user: userId,
      text: messageText.substring(0, 50) + (messageText.length > 50 ? '...' : '')
    });

    // Call OpenClaw agent
    const response = await callOpenClawAgent(messageText, `Direct message from Slack user ${userId}`);

    console.log('Received response from OpenClaw, sending to Slack');

    // Send the response
    await say({
      text: response
    });
    
    console.log('Direct message response sent successfully');
  } catch (error) {
    console.error('Error handling direct message:', error);
    await say({
      text: 'Sorry, I encountered an error while processing your request.'
    });
  }
});

// Slash command: /derrick help
app.command('/derrick', async ({ command, ack, say }) => {
  // Acknowledge command request
  await ack();

  const helpText = `
*Derrick Bot Commands:*
• \`/derrick help\` - Show this help message
• \*Mention me\` with @Derrick Bot to ask questions
• \*Direct message\` me for private conversations
• \*In any channel\`, mention me to get AI assistance

*Examples:*
• "@Derrick Bot What's the current mud weight recommendation for shale formations?"
• "@Derrick Bot Check AER Directive 020 for surface casing vent flow requirements"
• Direct message: "Help me understand hydraulic fracturing stages"

Powered by OpenClaw AI agents specializing in oil and gas operations.
  `;

  await say({
    text: helpText
    // Removed response_type: 'ephemeral' as it's not needed for slash command responses
  });
});

// Error handler
app.error(async (error) => {
  console.error('Slack Bolt error:', error);
  console.error('Error details:', {
    message: error.message,
    code: 'code' in error ? error.code : 'no code',
    name: 'name' in error ? error.name : 'no name'
  });
});

// Start the app
(async () => {
  const port = process.env.PORT || 3000;
  await app.start(port);
  console.log(`⚡️ Derrick Bot is running on port ${port}!`);
})();
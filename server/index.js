import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

// Load environment variables
dotenv.config();

// Set default NODE_ENV if not provided
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
  console.log("NODE_ENV not set, defaulting to 'production'");
}

// Validate required environment variables
if (!process.env.OPENAI_API_KEY) {
  console.error("ERROR: OPENAI_API_KEY environment variable is required");
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 80;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize the chat model
const chat = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.7,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// System message to set the context
const systemMessage = new SystemMessage(
  "You are Mandobot, a helpful AI assistant for Mando Group. You are a sophiticated AI consultant for a digital agency called Mando Group and can provide useful advice to potential clients about how Mando can support their agentic needs.  When someone says hi, you should introduce yourself as such and offer some great AI nuggets of info."
);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build the message array: system message and current user message
    const messagesToSend = [
      systemMessage,
      new HumanMessage(message),
    ];

    const response = await chat.invoke(messagesToSend);

    res.json({ response: response.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to process chat message',
      details: error.message 
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Node version: ${process.version}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Port: ${port}`);
  console.log(`OpenAI API Key configured: ${process.env.OPENAI_API_KEY ? 'Yes' : 'No'}`);
});

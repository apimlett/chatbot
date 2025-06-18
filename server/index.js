import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize the chat model
const chat = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.7,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Initialize the in-memory vector store for RAG
const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }));

// System message to set the context
const systemMessage = new SystemMessage(
  "You are Mandobot, a helpful AI assistant for Mando Group. You are a sophiticated AI consultant for a digital agency called Mando Group and can provide useful advice to potential clients about how Mando can support their agentic needs.  When someone says hi, you should introduce yourself as such and offer some great AI nuggets of info."
);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Add the new user message to the vector store
    await vectorStore.addDocuments([{ pageContent: message, metadata: { role: "user" } }]);

    // Retrieve the top 5 most relevant previous messages for context
    const relevantDocs = await vectorStore.similaritySearch(message, 5);
    const contextMessages = relevantDocs.map(doc => new HumanMessage(doc.pageContent));

    // Build the message array: system, context, current user message
    const messagesToSend = [
      systemMessage,
      ...contextMessages,
      new HumanMessage(message),
    ];

    const response = await chat.invoke(messagesToSend);

    // Add the assistant's response to the vector store as well
    await vectorStore.addDocuments([{ pageContent: response.content, metadata: { role: "assistant" } }]);

    res.json({ response: response.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

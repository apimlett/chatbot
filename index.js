const { ChatOpenAI } = require("@langchain/openai");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");
const dotenv = require("dotenv");
const readline = require("readline");

// Load environment variables
dotenv.config();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Initialize the chat model
const chat = new ChatOpenAI({
  modelName: "gpt-3.5-turbo",
  temperature: 0.7,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// System message to set the context
const systemMessage = new SystemMessage(
  "You are a helpful AI assistant. You provide clear, concise, and accurate responses."
);

async function chatLoop() {
  console.log("Chatbot initialized! Type 'exit' to end the conversation.");
  
  while (true) {
    const userInput = await new Promise((resolve) => {
      rl.question("You: ", resolve);
    });

    if (userInput.toLowerCase() === "exit") {
      console.log("Goodbye!");
      rl.close();
      break;
    }

    try {
      const response = await chat.invoke([
        systemMessage,
        new HumanMessage(userInput),
      ]);

      console.log("\nAssistant:", response.content, "\n");
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
}

// Start the chat loop
chatLoop().catch(console.error); 
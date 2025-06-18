const OpenAI = require("openai");
const dotenv = require("dotenv");
const readline = require("readline");

// Load environment variables
dotenv.config();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System message to set the context
const systemMessage = {
  role: "system",
  content: "You are a helpful AI assistant. You provide clear, concise, and accurate responses."
};

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
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          systemMessage,
          { role: "user", content: userInput }
        ],
        temperature: 0.7,
      });

      const response = completion.choices[0].message.content;
      console.log("\nAssistant:", response, "\n");
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
}

// Start the chat loop
chatLoop().catch(console.error); 
# LangChain Chatbot

A simple command-line chatbot implementation using LangChain and OpenAI.

## Prerequisites

- Node.js (v14 or higher)
- OpenAI API key

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your-api-key-here
   ```

## Usage

Run the chatbot:
```bash
npm start
```

- Type your messages and press Enter to chat with the AI
- Type 'exit' to end the conversation

## Features

- Uses GPT-3.5-turbo model
- Simple command-line interface
- Configurable system message
- Error handling for API calls 
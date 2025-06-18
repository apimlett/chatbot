<template>
  <div class="chat-container">
    <!-- Status Bar -->
    <div class="status-bar">
      <div class="time">{{ currentTime }}</div>
      <div class="status-icons">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M1 9l3-3 3 3M20 9l-3-3-3 3M2 15h20M2 19h20"/>
        </svg>
      </div>
    </div>

    <!-- Chat Header -->
    <Header @clear-chat="handleClearChat" />

    <!-- Filter Pills -->
    <div class="filter-container">
      <button class="filter-pill active">All types</button>
      <button class="filter-pill">Questions</button>
      <button class="filter-pill">Analysis</button>
      <button class="filter-pill">Code</button>
    </div>

    <!-- Messages -->
    <div class="messages-container">
      <!-- Date Separator -->
      <div class="date-separator">
        <span class="date-text">Today</span>
      </div>

      <div v-for="message in messages" :key="message.id" class="message" :class="message.type">
        <!-- Bot Avatar for received messages -->
        <div v-if="message.type === 'received'" class="bot-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
        </div>

        <div class="message-content">
          {{ message.text }}
          <div v-if="message.file" class="file-card">
            <div class="file-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                <polyline points="13 2 13 9 20 9"/>
              </svg>
            </div>
            <div class="file-info">
              <div class="file-name">{{ message.file.name }}</div>
              <div class="file-size">{{ message.file.size }}</div>
            </div>
          </div>
        </div>
        <div class="message-timestamp">{{ message.timestamp }}</div>
      </div>

      <!-- Loading Indicator -->
      <div v-if="isLoading" class="message received">
        <div class="message-content loading">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="input-container">
      <div class="input-wrapper">
        <button class="attachment-button" aria-label="Add attachment">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
          </svg>
        </button>
        <input 
          type="text" 
          v-model="newMessage" 
          @keyup.enter="sendMessage"
          placeholder="Ask anything here..."
          class="message-input"
          :disabled="isLoading"
        >
        <button class="send-button" @click="sendMessage" :disabled="!newMessage.trim() || isLoading">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 2L11 13"/>
            <path d="M22 2l-7 20-4-9-9-4 20-7z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import axios from 'axios'

export default {
  name: 'App',
  components: {
    Header
  },
  data() {
    return {
      messages: [
        { id: 1, text: 'Hello! How can I help you today?', type: 'received', timestamp: '10:00 AM' }
      ],
      newMessage: '',
      isLoading: false,
      currentTime: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: false 
      })
    }
  },
  created() {
    // Update time every minute
    setInterval(this.updateTime, 60000);
  },
  methods: {
    updateTime() {
      this.currentTime = new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: false 
      });
    },
    handleClearChat() {
      this.messages = [
        { id: 1, text: 'Hello! How can I help you today?', type: 'received', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ];
    },
    async sendMessage() {
      if (!this.newMessage.trim() || this.isLoading) return;

      // Add user message
      const userMessage = {
        id: this.messages.length + 1,
        text: this.newMessage,
        type: 'sent',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      this.messages.push(userMessage);
      
      // Clear input and set loading state
      const messageText = this.newMessage;
      this.newMessage = '';
      this.isLoading = true;

      try {
        // Make API call to the server
        const response = await axios.post('http://localhost:3001/api/chat', {
          message: messageText
        });

        // Add bot response
        this.messages.push({
          id: this.messages.length + 1,
          text: response.data.response,
          type: 'received',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      } catch (error) {
        console.error('Error:', error);
        // Add error message
        this.messages.push({
          id: this.messages.length + 1,
          text: 'Sorry, I encountered an error. Please try again.',
          type: 'received',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style>
:root {
  /* Dark theme colors */
  --bg-primary: #1A1B26;
  --bg-secondary: #232534;
  --bg-tertiary: #2A2C3E;
  --accent-purple: #7C5DFA;
  --accent-mint: #84F0D6;
  --text-primary: #FFFFFF;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --text-tertiary: rgba(255, 255, 255, 0.5);
  --border-color: rgba(255, 255, 255, 0.1);
  --shadow-color: rgba(0, 0, 0, 0.3);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
}

#app {
  height: 100vh;
  height: 100dvh;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  background: var(--bg-primary);
  position: relative;
}

/* Status Bar */
.status-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  background: var(--bg-primary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  padding-top: env(safe-area-inset-top);
  z-index: 100;
}

.time {
  font-weight: 600;
  font-size: 14px;
}

.status-icons {
  display: flex;
  gap: 4px;
}

/* Messages Container */
.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  padding-top: calc(44px + env(safe-area-inset-top) + 1rem);
  scroll-behavior: smooth;
}

.date-separator {
  text-align: center;
  margin: 24px 0;
  position: relative;
}

.date-text {
  background: var(--bg-secondary);
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 13px;
  color: var(--text-secondary);
  display: inline-block;
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 85%;
  margin-bottom: 1.5rem;
  animation: fadeIn 0.3s ease-out;
}

.message.received {
  align-self: flex-start;
  margin-right: auto;
  margin-left: 0;
}

.message.sent {
  align-self: flex-end;
  margin-left: auto;
  margin-right: 0;
}

.message-content {
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 15px;
  line-height: 1.4;
  position: relative;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.message.received .message-content {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-radius: 18px 18px 18px 6px;
  margin-left: 0;
  text-align: left;
}

.message.sent .message-content {
  background: var(--accent-purple);
  color: white;
  border-radius: 18px 18px 6px 18px;
  margin-right: 0;
  text-align: right;
}

.message-timestamp {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-top: 6px;
  padding: 0 8px;
}

/* Bot Avatar */
.bot-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--accent-purple);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.bot-avatar svg {
  width: 20px;
  height: 20px;
  color: white;
}

/* File Card */
.file-card {
  background: var(--bg-tertiary);
  border-radius: 12px;
  padding: 12px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-icon {
  width: 40px;
  height: 40px;
  background: var(--accent-purple);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.file-info {
  flex: 1;
}

.file-name {
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.file-size {
  font-size: 12px;
  color: var(--text-secondary);
}

/* Input Area */
.input-container {
  padding: 16px;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--bg-secondary);
  border-radius: 24px;
  padding: 8px 16px;
}

.message-input {
  flex: 1;
  border: none;
  padding: 8px 0;
  font-size: 15px;
  background: transparent;
  outline: none;
  color: var(--text-primary);
}

.message-input::placeholder {
  color: var(--text-tertiary);
}

.attachment-button,
.send-button {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--accent-purple);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border-radius: 50%;
}

.attachment-button:hover,
.send-button:hover {
  background: rgba(124, 93, 250, 0.1);
}

/* Loading Animation */
.loading {
  display: flex;
  gap: 4px;
  justify-content: center;
  padding: 8px;
}

.dot {
  width: 6px;
  height: 6px;
  background-color: var(--accent-purple);
  border-radius: 50%;
  opacity: 0.6;
  animation: bounce 1.4s infinite ease-in-out;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); } 
  40% { transform: scale(1.0); }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-input:disabled,
.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Filter Pills */
.filter-container {
  display: flex;
  gap: 8px;
  padding: 16px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.filter-pill {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.filter-pill.active {
  background: var(--accent-purple);
  color: white;
}

@media (max-width: 640px) {
  .message {
    max-width: 90%;
  }
  
  .input-wrapper {
    margin: 0;
  }
}
</style>

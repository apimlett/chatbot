<template>
  <div class="chat-app">
    <div class="header">
      <h1>FitBot</h1>
    </div>
    <div class="message-list" ref="messageList">
      <div v-for="message in messages" :key="message.id" class="message-item" :class="message.type">
        <div class="message-content">
          <p>{{ message.text }}</p>
        </div>
      </div>
       <div v-if="isLoading" class="message-item received">
          <div class="message-content loading">
            <span class="dot"></span><span class="dot"></span><span class="dot"></span>
          </div>
       </div>
    </div>
    <div class="message-form">
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." :disabled="isLoading" />
      <button @click="sendMessage" :disabled="isLoading">Send</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

if (import.meta.env.PROD) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || window.location.origin;
}

export default {
  name: 'App',
  data() {
    return {
      messages: [
        { id: 1, text: "Hello! I'm FitBot. How can I help you today?", type: 'received' }
      ],
      newMessage: '',
      isLoading: false,
    }
  },
  methods: {
    async sendMessage() {
      if (!this.newMessage.trim() || this.isLoading) return;

      this.messages.push({
        id: Date.now(),
        text: this.newMessage,
        type: 'sent',
      });
      
      const messageText = this.newMessage;
      this.newMessage = '';
      this.isLoading = true;
      this.scrollToBottom();

      try {
        const response = await axios.post('/api/chat', { message: messageText });
        this.messages.push({
          id: Date.now(),
          text: response.data.response,
          type: 'received',
        });
      } catch (error) {
        console.error('Error sending message:', error);
        this.messages.push({
          id: Date.now(),
          text: 'Sorry, I encountered an error. Please try again.',
          type: 'received',
        });
      } finally {
        this.isLoading = false;
        this.scrollToBottom();
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const list = this.$refs.messageList;
        if (list) {
          list.scrollTop = list.scrollHeight;
        }
      });
    }
  },
  mounted() {
    this.scrollToBottom();
  }
}
</script>

<style scoped>
.chat-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background: #fff;
  font-family: "DM Sans", sans-serif;
}
.header {
  padding: 1rem;
  background: #f7f7f7;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
  text-align: center;
}
.header h1 {
  font-size: 1.2rem;
  margin: 0;
  color: #333;
}
.message-list {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
}
.message-item {
  margin-bottom: 1rem;
  display: flex;
}
.message-item.sent {
  justify-content: flex-end;
}
.message-item.received {
  justify-content: flex-start;
}
.message-content {
  padding: 0.75rem 1rem;
  border-radius: 1.25rem;
  max-width: 75%;
  line-height: 1.5;
}
.message-item.sent .message-content {
  background: #0070f0;
  color: white;
  border-bottom-right-radius: 0.25rem;
}
.message-item.received .message-content {
  background: #e9e9eb;
  color: #333;
  border-bottom-left-radius: 0.25rem;
}
.message-form {
  display: flex;
  padding: 1rem;
  border-top: 1px solid #e0e0e0;
  background: #f7f7f7;
  flex-shrink: 0;
}
.message-form input {
  flex-grow: 1;
  border: 1px solid #ccc;
  padding: 0.75rem;
  border-radius: 2rem;
  font-size: 1rem;
}
.message-form button {
  margin-left: 1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  background: #0070f0;
  color: white;
  border: none;
  font-size: 1rem;
  cursor: pointer;
}
.message-form button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading {
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.dot {
  width: 8px;
  height: 8px;
  background-color: #333;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}
.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }
@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1.0); }
}
</style>
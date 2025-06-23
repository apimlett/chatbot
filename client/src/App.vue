<template>
  <!-- Welcome Screen -->
  <HomePage v-if="currentView === 'welcome'" @start-chat="startNewChat" />
  
  <!-- Chat Interface -->
  <div v-else class="chat-container" :style="{ height: viewportHeight + 'px' }">
    <!-- Gradient Header -->
    <div class="header-section">
      <div class="header-content">
        <div class="header-top">
          <div class="logo-container">
            <div class="logo-icon">
              <!-- Cogbot Robot SVG -->
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Robot Head -->
                <rect x="8" y="10" width="20" height="16" rx="4" fill="#4629f2" stroke="white" stroke-width="1.5"/>
                <!-- Robot Eyes -->
                <circle cx="14" cy="16" r="2" fill="white"/>
                <circle cx="22" cy="16" r="2" fill="white"/>
                <circle cx="14" cy="16" r="1" fill="#4629f2"/>
                <circle cx="22" cy="16" r="1" fill="#4629f2"/>
                <!-- Robot Mouth -->
                <rect x="16" y="20" width="4" height="2" rx="1" fill="white"/>
                <!-- Robot Antennas -->
                <circle cx="12" cy="8" r="1.5" fill="#4629f2"/>
                <line x1="12" y1="10" x2="12" y2="8" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                <circle cx="24" cy="8" r="1.5" fill="#4629f2"/>
                <line x1="24" y1="10" x2="24" y2="8" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                <!-- Robot Body -->
                <rect x="12" y="26" width="12" height="8" rx="2" fill="#4629f2" stroke="white" stroke-width="1.5"/>
                <!-- Robot Arms -->
                <circle cx="6" cy="30" r="2" fill="#4629f2" stroke="white" stroke-width="1.5"/>
                <line x1="8" y1="30" x2="12" y2="30" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                <circle cx="30" cy="30" r="2" fill="#4629f2" stroke="white" stroke-width="1.5"/>
                <line x1="24" y1="30" x2="28" y2="30" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
          </div>
          <div class="header-buttons">
            <button @click="showClearDialog = true" class="header-btn" title="Clear conversation">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button @click="showExitChatDialog" class="header-btn" title="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="header-text">
          <h1 class="app-title">Cogbot</h1>
          <p class="app-description">Your friendly AI assistant ready to help with questions, conversations, and tasks. Powered by Cogfusion technology.</p>
        </div>
      </div>
    </div>
    <!-- Chat Messages Area -->
    <div class="messages-container" ref="messageList">
      <div class="messages-content">
        <ChatMessage v-for="message in messages" :key="message.id" :message="message" />
        <div v-if="isLoading" class="loading-message">
          <div class="assistant-info">
            <div class="assistant-avatar">
              <!-- Pink Cogbot SVG -->
              <svg width="24" height="24" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Robot Head -->
                <rect x="8" y="10" width="20" height="16" rx="4" fill="#ec4899" stroke="white" stroke-width="1.5"/>
                <!-- Robot Eyes -->
                <circle cx="14" cy="16" r="2" fill="white"/>
                <circle cx="22" cy="16" r="2" fill="white"/>
                <circle cx="14" cy="16" r="1" fill="#ec4899"/>
                <circle cx="22" cy="16" r="1" fill="#ec4899"/>
                <!-- Robot Mouth -->
                <rect x="16" y="20" width="4" height="2" rx="1" fill="white"/>
                <!-- Robot Antennas -->
                <circle cx="12" cy="8" r="1.5" fill="#ec4899"/>
                <line x1="12" y1="10" x2="12" y2="8" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                <circle cx="24" cy="8" r="1.5" fill="#ec4899"/>
                <line x1="24" y1="10" x2="24" y2="8" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                <!-- Robot Body -->
                <rect x="12" y="26" width="12" height="8" rx="2" fill="#ec4899" stroke="white" stroke-width="1.5"/>
                <!-- Robot Arms -->
                <circle cx="6" cy="30" r="2" fill="#ec4899" stroke="white" stroke-width="1.5"/>
                <line x1="8" y1="30" x2="12" y2="30" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
                <circle cx="30" cy="30" r="2" fill="#ec4899" stroke="white" stroke-width="1.5"/>
                <line x1="24" y1="30" x2="28" y2="30" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="assistant-details">
              <div class="assistant-name">Cogbot</div>
              <div class="typing-indicator">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Input Area -->
    <div class="input-divider"></div>
    <div class="input-container">
      <div class="input-content">
        <div class="input-left">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.6)" stroke-width="2"/>
            <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <input 
            v-model="newMessage" 
            @keyup.enter="sendMessage" 
            placeholder="Reply ..." 
            :disabled="isLoading"
            class="message-input"
          />
        </div>
        <div class="input-right">
          <button 
            @click="sendMessage" 
            :disabled="isLoading"
            class="send-button"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Clear Conversation Confirmation Dialog -->
    <div v-if="showClearDialog" class="dialog-overlay" @click="showClearDialog = false">
      <div class="dialog" @click.stop>
        <div class="dialog-header">
          <h3>Clear Conversation</h3>
        </div>
        <div class="dialog-content">
          <p>Are you sure you want to clear the entire conversation? This action cannot be undone.</p>
        </div>
        <div class="dialog-actions">
          <button @click="showClearDialog = false" class="dialog-btn dialog-btn-cancel">Cancel</button>
          <button @click="clearConversation" class="dialog-btn dialog-btn-confirm">Clear</button>
        </div>
      </div>
    </div>

    <!-- Exit Chat Confirmation Dialog -->
    <div v-if="showExitDialog" class="dialog-overlay" @click="showExitDialog = false">
      <div class="dialog" @click.stop>
        <div class="dialog-header">
          <h3>End Chat Session</h3>
        </div>
        <div class="dialog-content">
          <p>Are you sure you want to end this chat session? Your conversation will be lost.</p>
        </div>
        <div class="dialog-actions">
          <button @click="showExitDialog = false" class="dialog-btn dialog-btn-cancel">Cancel</button>
          <button @click="exitChat" class="dialog-btn dialog-btn-confirm">End Chat</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useChatStore } from './stores/chat.js'
import ChatMessage from './components/ChatMessage.vue'
import HomePage from './components/HomePage.vue'
import axios from 'axios';

if (import.meta.env.PROD) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || window.location.origin;
}

export default {
  name: 'App',
  components: {
    ChatMessage,
    HomePage
  },
  setup() {
    const chatStore = useChatStore()
    return { chatStore }
  },
  data() {
    return {
      currentView: 'welcome', // 'welcome' or 'chat'
      newMessage: '',
      viewportHeight: window.innerHeight,
      showClearDialog: false,
      showExitDialog: false,
    }
  },
  computed: {
    messages() {
      return this.chatStore.displayMessages
    },
    isLoading() {
      return this.chatStore.isLoading
    }
  },
  methods: {
    async sendMessage() {
      if (!this.newMessage.trim()) return;
      
      const messageText = this.newMessage;
      this.newMessage = '';
      this.scrollToBottom();

      await this.chatStore.sendMessage(messageText);
      this.scrollToBottom();
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const list = this.$refs.messageList;
        if (list) {
          list.scrollTop = list.scrollHeight;
        }
      });
    },
    updateViewportHeight() {
      this.viewportHeight = window.innerHeight;
    },
    clearConversation() {
      this.chatStore.clearConversation();
      this.showClearDialog = false;
      this.scrollToBottom();
    },
    startNewChat() {
      this.currentView = 'chat';
      this.chatStore.initializeSession();
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    showExitChatDialog() {
      this.showExitDialog = true;
    },
    exitChat() {
      this.currentView = 'welcome';
      this.showExitDialog = false;
      this.chatStore.clearConversation();
    }
  },
  mounted() {
    // Update viewport height when window resizes (address bar shows/hides)
    window.addEventListener('resize', this.updateViewportHeight);
    window.addEventListener('orientationchange', this.updateViewportHeight);
    
    // Initial timeout to get correct height after page load
    setTimeout(() => {
      this.updateViewportHeight();
    }, 100);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateViewportHeight);
    window.removeEventListener('orientationchange', this.updateViewportHeight);
  }
}
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  font-family: 'Source Sans Pro', sans-serif;
  background: #0d082c;
  color: white;
  box-shadow: 0px 30px 60px 0px rgba(70, 41, 242, 0.14);
  border-radius: 8px;
  overflow: hidden;
}

/* Header Section */
.header-section {
  background: linear-gradient(135deg, #4629f2 0%, #3950f5 8.724%, #2d78f9 17.448%, #209ffc 26.172%, #13c6ff 34.896%, #28b7fe 38.021%, #3da8fe 41.146%, #668afd 47.396%, #8f6cfc 53.646%, #b94dfb 59.896%, #ff53ee 81.771%, #fc6cca 86.328%, #f986a7 90.885%, #f69f84 95.443%, #f3b960 100%);
  border-radius: 8px 8px 0 0;
  backdrop-filter: blur(25px);
  position: relative;
}

.header-content {
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-container {
  width: 60px;
  height: 60px;
}

.logo-icon {
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: #4629f2;
  padding: 2px;
}

.header-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

.header-btn {
  width: 35px;
  height: 35px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.header-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.app-title {
  font-size: 30px;
  font-weight: bold;
  color: white;
  margin: 0;
  line-height: normal;
}

.app-description {
  font-size: 16px;
  color: white;
  margin: 0;
  line-height: 28px;
  max-width: 370px;
}

/* Messages Container */
.messages-container {
  flex: 1;
  overflow-y: auto;
  background: #0d082c;
}

.messages-content {
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 35px;
}

/* Loading Message */
.loading-message {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.assistant-info {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.assistant-avatar {
  width: 40px;
  height: 40px;
  background: #666;
  border-radius: 50%;
  flex-shrink: 0;
}

.assistant-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.assistant-name {
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.typing-indicator {
  background: #1d1748;
  border-radius: 0 10px 10px 10px;
  padding: 10px 15px;
  display: flex;
  gap: 4px;
  align-items: center;
  width: 91px;
  height: 35px;
}

.typing-indicator .dot {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator .dot:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator .dot:nth-child(2) {
  animation-delay: -0.16s;
}

.typing-indicator .dot:nth-child(3) {
  animation-delay: 0s;
}

@keyframes typing {
  0%, 80%, 100% {
    opacity: 0.4;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1);
  }
}

/* Input Section */
.input-divider {
  height: 1px;
  background: #181045;
  width: 100%;
}

.input-container {
  background: #0d082c;
  border-radius: 0 0 8px 8px;
}

.input-content {
  padding: 20px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.input-left {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.message-input {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  outline: none;
  flex: 1;
  font-family: 'Source Sans Pro', sans-serif;
}

.message-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.input-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.send-button {
  width: 40px;
  height: 40px;
  background: #4629f2;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.send-button:hover:not(:disabled) {
  background: #3520d9;
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Dialog Styles */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background: #1d1748;
  border-radius: 12px;
  padding: 0;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.dialog-header {
  padding: 20px 24px 0 24px;
}

.dialog-header h3 {
  margin: 0;
  color: white;
  font-size: 18px;
  font-weight: 600;
}

.dialog-content {
  padding: 16px 24px 24px 24px;
}

.dialog-content p {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  line-height: 1.5;
}

.dialog-actions {
  padding: 0 24px 24px 24px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.dialog-btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.dialog-btn-cancel {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.dialog-btn-cancel:hover {
  background: rgba(255, 255, 255, 0.15);
}

.dialog-btn-confirm {
  background: #dc2626;
  color: white;
}

.dialog-btn-confirm:hover {
  background: #b91c1c;
}
</style>

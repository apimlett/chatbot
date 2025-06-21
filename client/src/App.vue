<template>
  <div class="flex flex-col w-full bg-white font-sans" :style="{ height: viewportHeight + 'px' }">
    <div class="flex-shrink-0 p-4 bg-gray-50 border-b border-gray-200 text-center">
      <h1 class="text-xl font-medium text-gray-800 m-0">Cogfusion.ai</h1>
    </div>
    <div class="flex-1 overflow-y-auto p-4" ref="messageList">
      <ChatMessage v-for="message in messages" :key="message.id" :message="message" />
      <div v-if="isLoading" class="mb-4 flex justify-start">
        <div class="px-4 py-3 rounded-[1.25rem] max-w-[75%] leading-relaxed bg-gray-200 text-gray-800 rounded-bl-sm">
          <div class="flex gap-1 items-center justify-center h-full">
            <span class="w-2 h-2 bg-gray-800 rounded-full animate-bounce [animation-delay:-0.32s]"></span>
            <span class="w-2 h-2 bg-gray-800 rounded-full animate-bounce [animation-delay:-0.16s]"></span>
            <span class="w-2 h-2 bg-gray-800 rounded-full animate-bounce"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-shrink-0 flex p-4 border-t border-gray-200 bg-gray-50">
      <input 
        v-model="newMessage" 
        @keyup.enter="sendMessage" 
        placeholder="Type a message..." 
        :disabled="isLoading"
        class="flex-1 border border-gray-300 px-3 py-3 rounded-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
      />
      <button 
        @click="sendMessage" 
        :disabled="isLoading"
        class="ml-4 px-6 py-3 rounded-full bg-blue-500 text-white border-none text-base cursor-pointer hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send
      </button>
    </div>
  </div>
</template>

<script>
import { useChatStore } from './stores/chat.js'
import ChatMessage from './components/ChatMessage.vue'
import axios from 'axios';

if (import.meta.env.PROD) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || window.location.origin;
}

export default {
  name: 'App',
  components: {
    ChatMessage
  },
  setup() {
    const chatStore = useChatStore()
    return { chatStore }
  },
  data() {
    return {
      newMessage: '',
      viewportHeight: window.innerHeight,
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
    }
  },
  mounted() {
    // Initialize chat session
    this.chatStore.initializeSession();
    
    this.scrollToBottom();
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


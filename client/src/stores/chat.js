import { defineStore } from 'pinia'
import axios from 'axios'

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [
      { id: 1, text: "Hello! I'm Cogfusion.ai. How can I help you today?", type: 'received', timestamp: new Date() }
    ],
    isLoading: false,
    error: null,
    sessionId: null,
    conversationHistory: []
  }),

  getters: {
    // Get messages formatted for display  
    displayMessages: (state) => state.messages,
    
    // Get conversation context for API calls (excludes initial welcome message)
    conversationContext: (state) => {
      return state.messages
        .filter(msg => msg.id !== 1) // Exclude welcome message
        .map(msg => ({
          role: msg.type === 'sent' ? 'user' : 'assistant',
          content: msg.text
        }))
    },

    // Check if there's an active conversation
    hasConversation: (state) => state.messages.length > 1,

    // Get last user message for retry functionality
    lastUserMessage: (state) => {
      const userMessages = state.messages.filter(msg => msg.type === 'sent')
      return userMessages.length > 0 ? userMessages[userMessages.length - 1] : null
    }
  },

  actions: {
    // Generate unique message ID
    generateMessageId() {
      return Date.now() + Math.random()
    },

    // Add message to conversation
    addMessage(text, type) {
      const message = {
        id: this.generateMessageId(),
        text,
        type,
        timestamp: new Date()
      }
      this.messages.push(message)
      return message
    },

    // Send message and get response
    async sendMessage(messageText) {
      if (!messageText.trim() || this.isLoading) return

      // Add user message
      this.addMessage(messageText, 'sent')
      this.isLoading = true
      this.error = null

      try {
        const response = await axios.post('/api/chat', { 
          message: messageText,
          conversationHistory: this.conversationContext
        })
        
        // Add bot response
        this.addMessage(response.data.response, 'received')
        
      } catch (error) {
        console.error('Error sending message:', error)
        this.error = error
        this.addMessage('Sorry, I encountered an error. Please try again.', 'received')
      } finally {
        this.isLoading = false
      }
    },

    // Retry last message
    async retryLastMessage() {
      const lastMessage = this.lastUserMessage
      if (lastMessage && !this.isLoading) {
        // Remove the last error message if it exists
        if (this.messages[this.messages.length - 1]?.text.includes('Sorry, I encountered an error')) {
          this.messages.pop()
        }
        await this.sendMessage(lastMessage.text)
      }
    },

    // Clear conversation
    clearConversation() {
      this.messages = [
        { id: 1, text: "Hello! I'm Cogfusion.ai. How can I help you today?", type: 'received', timestamp: new Date() }
      ]
      this.error = null
      this.sessionId = null
      this.conversationHistory = []
    },

    // Set error state
    setError(error) {
      this.error = error
    },

    // Clear error state
    clearError() {
      this.error = null
    },

    // Initialize or resume session
    initializeSession(sessionId = null) {
      this.sessionId = sessionId || this.generateMessageId().toString()
    }
  }
})
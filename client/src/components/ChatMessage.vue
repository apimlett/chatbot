<template>
  <!-- User Message -->
  <div v-if="message.type === 'sent'" class="user-message">
    <div class="user-bubble">
      <div class="user-text">{{ message.text }}</div>
    </div>
    <div class="user-timestamp">
      {{ formatTimestamp(message.timestamp) }}
    </div>
  </div>
  
  <!-- Assistant Message -->
  <div v-else class="assistant-message">
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
      <div class="assistant-content">
        <div class="assistant-name">Cogbot</div>
        <div class="assistant-bubble">
          <div class="assistant-text prose prose-sm max-w-none" v-html="renderMarkdown(message.text)"></div>
        </div>
        <div class="assistant-timestamp">
          {{ formatTimestamp(message.timestamp) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { marked } from 'marked'

export default {
  name: 'ChatMessage',
  props: {
    message: {
      type: Object,
      required: true,
      validator(value) {
        return value && typeof value.text === 'string' && typeof value.type === 'string'
      }
    }
  },
  methods: {
    renderMarkdown(text) {
      try {
        // Configure marked for safe HTML
        marked.setOptions({
          breaks: true,
          gfm: true,
          sanitize: false, // We'll handle sanitization manually
          smartLists: true,
          smartypants: false
        })
        
        const rendered = marked.parse(text)
        
        // Simple sanitization - remove script tags and on* attributes
        return rendered
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/\son\w+="[^"]*"/g, '')
          .replace(/\son\w+='[^']*'/g, '')
          .replace(/javascript:/gi, '')
      } catch (error) {
        console.error('Markdown rendering error:', error)
        return text
      }
    },
    
    formatTimestamp(timestamp) {
      if (!timestamp) return ''
      
      const now = new Date()
      const messageTime = new Date(timestamp)
      const diffMs = now - messageTime
      const diffMinutes = Math.floor(diffMs / (1000 * 60))
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      
      if (diffMinutes < 1) {
        return 'Just now'
      } else if (diffMinutes < 60) {
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`
      } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
      } else if (diffDays < 7) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
      } else {
        // For older messages, show date
        return messageTime.toLocaleDateString()
      }
    }
  }
}
</script>

<style scoped>
/* User Messages */
.user-message {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
}

.user-bubble {
  background: #4629f2;
  border-radius: 10px 10px 10px 10px;
  max-width: 75%;
}

.user-text {
  padding: 10px 15px;
  color: white;
  font-size: 16px;
  line-height: 24px;
  word-wrap: break-word;
}

.user-timestamp {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
  text-align: right;
}

/* Assistant Messages */
.assistant-message {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.assistant-info {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  width: 100%;
}

.assistant-avatar {
  width: 40px;
  height: 40px;
  background: rgba(236, 72, 153, 0.1);
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.assistant-content {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  max-width: calc(100% - 50px);
}

.assistant-name {
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.assistant-bubble {
  background: #1d1748;
  border-radius: 0 10px 10px 10px;
  width: 100%;
}

.assistant-text {
  padding: 10px 15px;
  color: white;
  font-size: 16px;
  line-height: 24px;
  word-wrap: break-word;
}

.assistant-timestamp {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
  text-align: right;
}

/* Markdown styling for bot messages */
.prose {
  color: inherit;
}

.prose p {
  margin: 0.5em 0;
}

.prose p:first-child {
  margin-top: 0;
}

.prose p:last-child {
  margin-bottom: 0;
}

.prose strong, .prose b {
  font-weight: 600;
}

.prose em, .prose i {
  font-style: italic;
}

.prose code {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.875em;
  color: #e2e8f0;
}

.prose pre {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.75rem;
  border-radius: 0.375rem;
  overflow-x: auto;
  margin: 0.5rem 0;
}

.prose pre code {
  background-color: transparent;
  padding: 0;
}

.prose ul, .prose ol {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.prose li {
  margin: 0.25rem 0;
}

.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
  font-weight: 600;
  margin: 0.75rem 0 0.5rem 0;
  color: white;
}

.prose h1 { font-size: 1.25rem; }
.prose h2 { font-size: 1.125rem; }
.prose h3 { font-size: 1rem; }
.prose h4, .prose h5, .prose h6 { font-size: 0.875rem; }

.prose blockquote {
  border-left: 4px solid rgba(255, 255, 255, 0.2);
  padding-left: 1rem;
  margin: 0.5rem 0;
  font-style: italic;
  color: rgba(255, 255, 255, 0.8);
}
</style>
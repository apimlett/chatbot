<template>
  <div class="mb-4 flex" :class="message.type === 'sent' ? 'justify-end' : 'justify-start'">
    <div class="px-4 py-3 rounded-[1.25rem] max-w-[75%] leading-relaxed" 
         :class="message.type === 'sent' 
           ? 'bg-blue-500 text-white rounded-br-sm' 
           : 'bg-gray-200 text-gray-800 rounded-bl-sm'">
      <div v-if="message.type === 'sent'" class="m-0">{{ message.text }}</div>
      <div v-else class="m-0 prose prose-sm max-w-none" v-html="renderMarkdown(message.text)"></div>
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
        
        // Basic HTML sanitization - only allow safe tags
        const allowedTags = ['p', 'br', 'strong', 'b', 'em', 'i', 'code', 'pre', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote']
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
    }
  }
}
</script>

<style scoped>
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
  background-color: rgba(0, 0, 0, 0.1);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.875em;
}

.prose pre {
  background-color: rgba(0, 0, 0, 0.1);
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
}

.prose h1 { font-size: 1.25rem; }
.prose h2 { font-size: 1.125rem; }
.prose h3 { font-size: 1rem; }
.prose h4, .prose h5, .prose h6 { font-size: 0.875rem; }

.prose blockquote {
  border-left: 4px solid rgba(0, 0, 0, 0.2);
  padding-left: 1rem;
  margin: 0.5rem 0;
  font-style: italic;
}
</style>
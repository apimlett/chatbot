<template>
  <div class="app-container" :style="{ height: viewportHeight + 'px' }">
    <header class="app-header">
      <h1>Vue.js + Express Template</h1>
      <p>A clean starting point for full-stack applications</p>
    </header>
    
    <main class="app-main">
      <div class="content-section">
        <h2>Welcome to Your New Project</h2>
        <p>This is a vanilla Vue.js frontend with an Express.js backend.</p>
        
        <div class="example-section">
          <h3>Example API Integration</h3>
          <button @click="testApiConnection" :disabled="loading" class="test-button">
            {{ loading ? 'Testing...' : 'Test API Connection' }}
          </button>
          
          <div v-if="apiResponse" class="api-response">
            <strong>API Response:</strong>
            <pre>{{ apiResponse }}</pre>
          </div>
          
          <div v-if="error" class="error-message">
            <strong>Error:</strong> {{ error }}
          </div>
        </div>
      </div>
    </main>
    
    <footer class="app-footer">
      <p>Built with Vue.js 3 + Express.js + Vite</p>
    </footer>
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
      viewportHeight: window.innerHeight,
      loading: false,
      apiResponse: null,
      error: null
    }
  },
  methods: {
    async testApiConnection() {
      this.loading = true;
      this.error = null;
      this.apiResponse = null;
      
      try {
        const response = await axios.get('/api/health');
        this.apiResponse = response.data;
      } catch (error) {
        console.error('API connection failed:', error);
        this.error = error.response?.data?.message || error.message || 'Connection failed';
      } finally {
        this.loading = false;
      }
    },
    updateViewportHeight() {
      this.viewportHeight = window.innerHeight;
    }
  },
  mounted() {
    // Update viewport height when window resizes
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
.app-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  overflow: hidden;
}

.app-header {
  padding: 2rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.app-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2.5rem;
  font-weight: 600;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.app-header p {
  margin: 0;
  font-size: 1.2rem;
  opacity: 0.9;
}

.app-main {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-section {
  max-width: 600px;
  text-align: center;
}

.content-section h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.content-section p {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.example-section {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.example-section h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 500;
}

.test-button {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
}

.test-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.test-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.api-response, .error-message {
  text-align: left;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
}

.api-response {
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.3);
}

.error-message {
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.3);
}

.api-response pre {
  margin: 0.5rem 0 0 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.app-footer {
  padding: 1rem 2rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
  opacity: 0.8;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .app-header {
    padding: 1.5rem 1rem;
  }
  
  .app-header h1 {
    font-size: 2rem;
  }
  
  .app-main {
    padding: 1rem;
  }
  
  .content-section h2 {
    font-size: 1.5rem;
  }
  
  .example-section {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .app-header h1 {
    font-size: 1.5rem;
  }
  
  .content-section h2 {
    font-size: 1.25rem;
  }
  
  .example-section {
    padding: 1rem;
  }
}
</style>
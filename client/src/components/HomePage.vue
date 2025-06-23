<template>
  <div class="homepage-container" :style="{ height: viewportHeight + 'px' }">
    <!-- Cogbot Avatar and Text - Top Third -->
    <div class="hero-section">
      <div class="avatar-container">
        <!-- Cogbot Robot SVG -->
        <div class="avatar-circle">
          <svg width="120" height="120" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <h1 class="hero-title">Cogbot</h1>
        <p class="hero-subtitle">Your friendly AI assistant ready to help with questions, conversations, and tasks.</p>
      </div>
    </div>

    <!-- New Chat Button - Bottom Third -->
    <div class="action-section">
      <button @click="startNewChat" class="new-chat-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 9v4M12 17h.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        New Chat
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      viewportHeight: window.innerHeight,
    }
  },
  methods: {
    startNewChat() {
      this.$emit('start-chat')
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
.homepage-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  font-family: 'Source Sans Pro', sans-serif;
  background: linear-gradient(135deg, #4629f2 0%, #3950f5 8.724%, #2d78f9 17.448%, #209ffc 26.172%, #13c6ff 34.896%, #28b7fe 38.021%, #3da8fe 41.146%, #668afd 47.396%, #8f6cfc 53.646%, #b94dfb 59.896%, #ff53ee 81.771%, #fc6cca 86.328%, #f986a7 90.885%, #f69f84 95.443%, #f3b960 100%);
  color: white;
  box-shadow: 0px 30px 60px 0px rgba(70, 41, 242, 0.14);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

/* Hero Section - Top Third */
.hero-section {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 20px;
}

.avatar-circle {
  width: 160px;
  height: 160px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 20px;
}

.hero-title {
  font-size: 48px;
  font-weight: bold;
  color: white;
  margin: 0;
  line-height: normal;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 28px;
  max-width: 400px;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
}

/* Action Section - Bottom Third */
.action-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.new-chat-button {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  padding: 16px 32px;
  color: white;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.new-chat-button:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
}

.new-chat-button:active {
  transform: translateY(0);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .hero-section {
    padding: 20px;
  }
  
  .avatar-circle {
    width: 120px;
    height: 120px;
    padding: 15px;
  }
  
  .hero-title {
    font-size: 36px;
  }
  
  .hero-subtitle {
    font-size: 16px;
    max-width: 300px;
  }
  
  .action-section {
    padding: 20px;
  }
  
  .new-chat-button {
    padding: 14px 28px;
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .avatar-circle {
    width: 100px;
    height: 100px;
    padding: 12px;
  }
  
  .hero-title {
    font-size: 28px;
  }
  
  .hero-subtitle {
    font-size: 14px;
    line-height: 24px;
  }
}
</style>
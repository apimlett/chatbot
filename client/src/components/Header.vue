<template>
  <header class="chat-header">
    <div class="header-content">
      <button class="back-button" aria-label="Go back">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      
      <div class="user-info">
        <div class="user-avatar">
          <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="robotHeadGradient" cx="50%" cy="40%" r="70%">
                <stop offset="0%" stop-color="#B8A1FF"/>
                <stop offset="100%" stop-color="#7C5DFA"/>
              </radialGradient>
            </defs>
            <!-- Antenna -->
            <rect x="22" y="4" width="4" height="8" rx="2" fill="#7C5DFA"/>
            <circle cx="24" cy="4" r="2" fill="#84F0D6" stroke="#7C5DFA" stroke-width="1"/>
            <!-- Head -->
            <ellipse cx="24" cy="20" rx="14" ry="12" fill="url(#robotHeadGradient)"/>
            <!-- Face -->
            <ellipse cx="24" cy="24" rx="10" ry="7" fill="#fff" fill-opacity="0.9"/>
            <!-- Eyes -->
            <ellipse cx="20" cy="24" rx="2" ry="2.2" fill="#232534"/>
            <ellipse cx="28" cy="24" rx="2" ry="2.2" fill="#232534"/>
            <ellipse cx="20.7" cy="23.3" rx="0.5" ry="0.7" fill="#fff"/>
            <ellipse cx="28.7" cy="23.3" rx="0.5" ry="0.7" fill="#fff"/>
            <!-- Smile -->
            <path d="M21 27 Q24 30 27 27" stroke="#232534" stroke-width="1.5" fill="none" stroke-linecap="round"/>
            <!-- Cheeks -->
            <ellipse cx="18.5" cy="26.5" rx="1" ry="0.5" fill="#FFC2AC"/>
            <ellipse cx="29.5" cy="26.5" rx="1" ry="0.5" fill="#FFC2AC"/>
            <!-- Body -->
            <ellipse cx="24" cy="36" rx="9" ry="5" fill="#7C5DFA"/>
            <!-- Shoulders -->
            <ellipse cx="12" cy="34" rx="2.5" ry="1.5" fill="#7C5DFA"/>
            <ellipse cx="36" cy="34" rx="2.5" ry="1.5" fill="#7C5DFA"/>
          </svg>
        </div>
        <div class="user-details">
          <h1 class="user-name">AI Assistant</h1>
          <div class="status">
            <span class="status-dot"></span>
            <span class="status-text">Online</span>
          </div>
        </div>
      </div>

      <div class="menu-wrapper">
        <button class="menu-button" aria-label="Menu" @click="toggleMenu">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="1"/>
            <circle cx="12" cy="5" r="1"/>
            <circle cx="12" cy="19" r="1"/>
          </svg>
        </button>
        <div v-if="showMenu" class="menu-dropdown">
          <button class="dropdown-item" @click="clearChat">Clear Chat</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      showMenu: false
    }
  },
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    clearChat() {
      this.showMenu = false;
      this.$emit('clear-chat');
    }
  }
}
</script>

<style scoped>
.chat-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  padding-top: calc(44px + env(safe-area-inset-top));
  z-index: 50;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
}

.back-button,
.menu-button {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.back-button:hover,
.menu-button:hover {
  background: var(--bg-secondary);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: var(--accent-mint);
  border-radius: 50%;
}

.status-text {
  font-size: 13px;
  color: var(--text-secondary);
}

@media (max-width: 640px) {
  .chat-header {
    padding-top: env(safe-area-inset-top);
  }
  
  .header-content {
    padding: 8px 12px;
  }
}

.menu-wrapper {
  position: relative;
}
.menu-dropdown {
  position: absolute;
  top: 120%;
  right: 0;
  background: var(--bg-secondary);
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
  min-width: 140px;
  z-index: 100;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
}
.dropdown-item {
  background: none;
  border: none;
  color: var(--text-primary);
  text-align: left;
  padding: 10px 20px;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.2s;
}
.dropdown-item:hover {
  background: var(--accent-purple);
  color: #fff;
}
</style> 
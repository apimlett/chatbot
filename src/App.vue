<template>
  <div class="widget-container">
    <div class="widget-frame">
      <Header />
      <main class="widget-content">
        <!-- Chat content here -->
      </main>
    </div>
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
</script>

<style>
:root {
  --widget-width: 380px;
  --widget-height: 600px;
  --header-height: 64px;
  --content-height: calc(var(--widget-height) - var(--header-height));
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.widget-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: var(--widget-width);
  height: var(--widget-height);
  z-index: 9999;
}

.widget-frame {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #FFC2AC 0%, #FFF9DE 100%);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.widget-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  padding-top: calc(var(--header-height) + 1rem);
  scrollbar-width: thin;
  scrollbar-color: var(--teal) transparent;
}

.widget-content::-webkit-scrollbar {
  width: 6px;
}

.widget-content::-webkit-scrollbar-track {
  background: transparent;
}

.widget-content::-webkit-scrollbar-thumb {
  background-color: #2A7A83;
  border-radius: 3px;
}

@media (max-width: 480px) {
  .widget-container {
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
  }

  .widget-frame {
    border-radius: 0;
  }
}

@supports (padding: env(safe-area-inset-bottom)) {
  .widget-container {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style> 
<template>
  <header class="header">
    <div class="header-content">
      <Logo class="header-logo" :width="120" />
    </div>
  </header>
</template>

<script setup>
import Logo from './Logo.vue';
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  z-index: 100;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(42, 122, 131, 0.1);
}

.header-content {
  height: 100%;
  padding: 0 1rem;
  display: flex;
  align-items: center;
}

.header-logo {
  height: auto;
}

@supports (padding: env(safe-area-inset-top)) {
  .header {
    padding-top: env(safe-area-inset-top);
  }
}
</style> 
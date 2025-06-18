<template>
  <div class="chat-container">
    <div class="messages">
      <div v-for="(msg, i) in messages" :key="i" :class="msg.sender">
        <strong>{{ msg.sender === 'user' ? 'You' : 'Assistant' }}:</strong>
        {{ msg.text }}
      </div>
    </div>
    <form @submit.prevent="sendMessage">
      <input v-model="input" placeholder="Type a message..." />
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const messages = ref([]);
const input = ref("");

const sendMessage = async () => {
  if (!input.value.trim()) return;

  messages.value.push({ sender: "user", text: input.value });

  try {
    const { data } = await axios.post("http://localhost:3001/api/chat", {
      message: input.value,
    });
    messages.value.push({ sender: "assistant", text: data.response });
  } catch (err) {
    messages.value.push({ sender: "assistant", text: "Error: " + err.message });
  }

  input.value = "";
};
</script>

<style scoped>
.chat-container {
  max-width: 600px;
  margin: auto;
  padding: 1rem;
}
.messages {
  margin-bottom: 1rem;
  max-height: 400px;
  overflow-y: auto;
}
.user {
  text-align: right;
  color: blue;
}
.assistant {
  text-align: left;
  color: green;
}
input {
  width: 80%;
  padding: 0.5rem;
}
button {
  padding: 0.5rem;
}
</style>

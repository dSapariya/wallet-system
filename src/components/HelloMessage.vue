<template>
  <div class="hello-message">
    <div class="message-card">
      <h2>{{ greeting }}</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Reactive data
const greeting = ref('Hello World')
const currentTime = ref('')
let timer: number | null = null

const updateTime = (): void => {
  currentTime.value = new Date().toLocaleTimeString()
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.hello-message {
  display: flex;
  justify-content: center;
  align-items: center;
}

.message-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

h2 {
  margin: 0 0 16px 0;
  font-size: 2rem;
  font-weight: 600;
}

p {
  margin: 0 0 24px 0;
  font-size: 1.1rem;
  line-height: 1.6;
  opacity: 0.9;
}

.btn {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 16px;
}

.btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.timestamp {
  font-size: 0.9rem;
  opacity: 0.7;
  margin: 0;
}
</style> 
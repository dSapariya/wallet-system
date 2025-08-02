<template>
  <div id="app">
    <header>
      <h1>{{ title }}</h1>
    </header>
    <main>
      <HelloMessage />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HelloMessage from './components/HelloMessage.vue'

const title = ref('Wallet System')
</script>

<style scoped>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 40px;
}

h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin: 0;
}

main {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}
</style> 
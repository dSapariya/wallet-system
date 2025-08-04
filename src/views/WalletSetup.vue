<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Wallet System</h1>
        <p class="text-gray-600">Manage your digital wallet with ease</p>
      </div>

      <div v-if="walletStore.loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <WalletSetup
        v-if="!walletStore.wallet && !walletStore.loading" 
        @wallet-created="handleWalletCreated" 
      />

      <div v-else-if="walletStore.wallet" class="space-y-6">
        <WalletSummary :wallet="walletStore.wallet" />
        <TransactionForm 
          :wallet-id="walletStore.wallet.id" 
          @transaction-completed="handleTransactionCompleted" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useWalletStore } from '../stores/useWalletStore'
import WalletSetup from '../components/WalletSetup.vue'
import WalletSummary from '../components/WalletSummary.vue'
import TransactionForm from '../components/TransactionForm.vue'

const walletStore = useWalletStore()

onMounted(async () => {
  await walletStore.initializeWallet()
})

const handleWalletCreated = () => {
  console.log('Wallet created successfully')
}

const handleTransactionCompleted = () => {
  console.log('Transaction completed successfully')
}
</script> 
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

      <div v-else-if="walletStore.error" class="card mb-6">
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Error</h3>
              <p class="text-sm text-red-700 mt-1">{{ walletStore.error }}</p>
            </div>
          </div>
        </div>
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
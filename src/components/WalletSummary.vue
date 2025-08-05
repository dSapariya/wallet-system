<template>
  <div class="card">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-semibold text-gray-900">Wallet Summary</h2>
      <router-link 
        to="/transactions" 
        class="btn-secondary flex items-center space-x-2"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <span>View Transactions</span>
      </router-link>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Wallet User Name</label>
          <p class="text-lg font-semibold text-gray-900">{{ wallet.name }}</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Created Date</label>
          <p class="text-sm text-gray-900">{{ formatDate(wallet.date) }}</p>
        </div>
      </div>

      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
        <div class="text-center">
          <h3 class="text-lg font-medium mb-2">Current Balance</h3>
          <div class="text-3xl font-bold mb-2">
            ${{ formatCurrency(wallet.balance) }}
          </div>
          <div class="text-blue-100 text-sm">
            Last updated: {{ formatDate(wallet.date) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { type Wallet } from '../services/api'

const props = defineProps<{
  wallet: Wallet
}>()

const formatDate = (dateString: string): string => {
  return dayjs(dateString).format('MMM DD, YYYY h:mm A')
}

const formatCurrency = (amount: number): string => {
  return amount.toFixed(4)
}
</script> 
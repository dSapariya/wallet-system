<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Transaction History</h1>
          <p class="text-gray-600 text-sm sm:text-base">View and manage your wallet transactions</p>
        </div>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-0">
          <router-link to="/" class="btn-secondary flex items-center justify-center space-x-2 w-full sm:w-auto">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span>Back to Wallet</span>
          </router-link>
          <button 
            @click="exportCSV" 
            class="btn-primary flex items-center justify-center space-x-2 w-full sm:w-auto"
            :disabled="loading || transactions.length === 0"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Transactions Table -->
      <div v-else-if="transactions.length > 0" class="card">
        <!-- Table Controls -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <!-- Combined Group: Sort by, Order, and Items per page -->
          <div class="flex flex-wrap items-center gap-x-4 gap-y-2"> <!-- flex-wrap to allow wrapping on small screens -->
            <label class="text-sm font-medium text-gray-700">Sort by:</label>
            <select 
              v-model="sortBy" 
              @change="fetchTransactions"
              class="input-field w-full sm:w-auto" 
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
            </select>
            
            <label class="text-sm font-medium text-gray-700">Order:</label>
            <select 
              v-model="order" 
              @change="fetchTransactions"
              class="input-field w-full sm:w-auto" 
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            
            <label class="text-sm font-medium text-gray-700">Items per page:</label>
            <select 
              v-model="pagination.limit" 
              @change="onLimitChange"
              class="input-field w-full sm:w-auto"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>

          <!-- Right Group: Showing X of Y -->
          <div class="text-sm text-gray-600 text-center sm:text-right w-full sm:w-auto mt-2 sm:mt-0"> <!-- Ensure it moves to right on larger screens -->
            Showing {{ pagination.skip + 1 }}-{{ Math.min(pagination.skip + pagination.limit, totalTransactions) }} of {{ totalTransactions }} transactions
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="transaction in transactions" :key="transaction.id" class="hover:bg-gray-50">
                <td class="px-3 py-2 whitespace-nowrap">
                  <span :class="transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'" class="font-medium">
                    {{ transaction.amount >= 0 ? '+' : '' }}${{ Math.abs(transaction.amount).toFixed(2) }}
                  </span>
                </td>
                <td class="px-3 py-2 whitespace-nowrap">
                  <span :class="transaction.amount >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ transaction.amount >= 0 ? 'Credit' : 'Debit' }}
                  </span>
                </td>
                <td class="px-3 py-2">
                  <div class="text-sm text-gray-900">{{ transaction.description }}</div>
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                  ${{ transaction.balance.toFixed(2) }}
                </td>
                <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(transaction.date) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex flex-col sm:flex-row items-center justify-between mt-6 space-y-4 sm:space-y-0">
          <div class="flex items-center space-x-2">
            <button 
              @click="previousPage" 
              :disabled="pagination.skip === 0"
              class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              
            </button>
            
            <!-- Page Numbers -->
            <div class="flex items-center space-x-1">
              <button 
                v-for="page in getPageNumbers()" 
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'px-3 py-1 text-sm rounded-md',
                  page === getCurrentPage() 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                ]"
              >
                {{ page }}
              </button>
            </div>
            
            <button 
              @click="nextPage" 
              :disabled="pagination.skip + pagination.limit >= totalTransactions"
              class="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
          
          <div class="text-sm text-gray-600 text-center sm:text-right">
            Page {{ getCurrentPage() }} of {{ getTotalPages() }} 
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="card text-center py-12 px-4 sm:px-6">
        <svg class="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <h3 class="mt-2 text-base sm:text-lg font-medium text-gray-900">No transactions</h3>
        <p class="mt-1 text-sm sm:text-base text-gray-500">Get started by creating your first transaction.</p>
        <div class="mt-6">
          <router-link to="/" class="btn-primary">
            Go to Wallet
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiService } from '../services/api'
import dayjs from 'dayjs'

import type { Transaction } from '../services/api'

const loading = ref(false)
const transactions = ref<Transaction[]>([])
const totalTransactions = ref(0)
const sortBy = ref('date')
const order = ref<'asc' | 'desc'>('desc')

const pagination = ref({
  skip: 0,
  limit: 10
})

const fetchTransactions = async () => {
  const walletId = localStorage.getItem('walletId')
  if (!walletId) {
    return
  }

  loading.value = true

  try {
    const response = await apiService.getTransactions(
      walletId,
      pagination.value.skip,
      pagination.value.limit,
      sortBy.value,
      order.value
    )

    if (response.success && response.data) {
      transactions.value = response.data.transactions   
      totalTransactions.value = response.data.total     
    }
  } catch (err: any) {
    console.error('Error fetching transactions:', err)
  } finally {
    loading.value = false
  }
}

const exportCSV = async () => {
  const walletId = localStorage.getItem('walletId')
  if (!walletId) return

  try {
    const response = await apiService.getAllTransactions(walletId,true)

    if (response.success && response.data) {
      const csvContent = generateCSV(response.data.transactions)
      downloadCSV(csvContent, `transactions-${walletId}.csv`)
    } 
  } catch (err: any) {
    console.error('Error exporting CSV:', err)
  }
}

const generateCSV = (data: Transaction[]): string => {
  const headers = ['Amount', 'Type', 'Description', 'Balance', 'Date']
  const rows = data.map(t => [
    t.amount.toFixed(2),
    t.amount >= 0 ? 'Credit' : 'Debit',
    t.description,
    t.balance.toFixed(2),
    dayjs(t.date).format('YYYY-MM-DD HH:mm:ss')
  ])
  
  return [headers, ...rows].map(row => row.join(',')).join('\n')
}

const downloadCSV = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

const previousPage = () => {
  if (pagination.value.skip > 0) {
    pagination.value.skip -= pagination.value.limit
    fetchTransactions()
  }
}

const nextPage = () => {
  if (pagination.value.skip + pagination.value.limit < totalTransactions.value) {
    pagination.value.skip += pagination.value.limit
    fetchTransactions()
  }
}

const onLimitChange = () => {
  pagination.value.skip = 0 
  fetchTransactions()
}

const getCurrentPage = (): number => {
  return Math.floor(pagination.value.skip / pagination.value.limit) + 1
}

const getTotalPages = (): number => {
  return Math.ceil(totalTransactions.value / pagination.value.limit)
}

const getPageNumbers = (): number[] => {
  const currentPage = getCurrentPage()
  const totalPages = getTotalPages()
  const pages: number[] = []
  
  const start = Math.max(1, currentPage - 2)
  const end = Math.min(totalPages, currentPage + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
}

const goToPage = (page: number) => {
  pagination.value.skip = (page - 1) * pagination.value.limit
  fetchTransactions()
}

const formatDate = (dateString: string): string => {
  return dayjs(dateString).format('MMM DD, YYYY h:mm A')
}

onMounted(() => {
  fetchTransactions()
})
</script> 
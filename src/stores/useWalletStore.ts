import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiService, type Wallet, type ApiResponse } from '../services/api'
import { storage } from '../config'

export const useWalletStore = defineStore('wallet', () => {
  const wallet = ref<Wallet | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Initialize wallet from localStorage
  const initializeWallet = async (): Promise<void> => {
    const walletId = localStorage.getItem(storage.walletId)
    if (walletId) {
      await fetchWallet(walletId)
    }
  }

  // Fetch wallet data from API
  const fetchWallet = async (walletId: string): Promise<void> => {
    loading.value = true
    error.value = null
    
    const response: ApiResponse<Wallet> = await apiService.getWallet(walletId)
    
    if (response.success && response.data) {
      wallet.value = response.data
    } else {
      error.value = response.error || 'Failed to fetch wallet'
    }
    
    loading.value = false
  }

  // Setup new wallet
  const setupWallet = async (name: string, balance?: string): Promise<boolean> => {
    loading.value = true
    error.value = null
    
    const initialBalance = balance ? parseFloat(balance) : 0
    const response: ApiResponse<Wallet> = await apiService.setupWallet(name, initialBalance)
    
    if (response.success && response.data) {
      // Save to localStorage and store
      localStorage.setItem(storage.walletId, response.data.id)
      wallet.value = response.data
      return true
    } else {
      error.value = response.error || 'Failed to setup wallet'
      return false
    }
    
    loading.value = false
  }

  // Update wallet balance after transaction
  const updateBalance = async (walletId: string, amount: number, description: string): Promise<boolean> => {
    const response: ApiResponse<{ balance: number }> = await apiService.updateWalletBalance(walletId, amount, description)
    
    if (response.success && response.data && wallet.value) {
      wallet.value.balance = response.data.balance
      return true
    } else {
      error.value = response.error || 'Failed to update balance'
      return false
    }
  }

  // Clear wallet data (for logout/reset)
  const clearWallet = (): void => {
    localStorage.removeItem(storage.walletId)
    wallet.value = null
    error.value = null
  }

  return {
    wallet,
    loading,
    error,
    initializeWallet,
    fetchWallet,
    setupWallet,
    updateBalance,
    clearWallet
  }
}) 
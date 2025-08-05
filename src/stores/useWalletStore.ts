import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiService, type Wallet, type ApiResponse } from '../services/api'
import { storage } from '../config'
import { showErrorToast } from '../plugins/notification' 

export const useWalletStore = defineStore('wallet', () => {
  const wallet = ref<Wallet | null>(null)
  const loading = ref(false)

  const initializeWallet = async (): Promise<void> => {
    const walletId = localStorage.getItem(storage.walletId)
    if (walletId) {
      await fetchWallet(walletId)
    }
  }

  const fetchWallet = async (walletId: string): Promise<void> => {
    loading.value = true
    
    try { 
      const response: ApiResponse<Wallet> = await apiService.getWallet(walletId)
      
      if (response.success && response.data) {
        wallet.value = response.data
      } else {
        // If wallet data fetch fails, clear walletId and reload
        showErrorToast('Failed to load wallet data. Please set up your wallet again.')
        localStorage.removeItem(storage.walletId)
        wallet.value = null 
        setTimeout(() => { 
          window.location.reload()
        }, 3000)
      }
    } catch (error) {
      console.error('Error fetching wallet:', error)
      showErrorToast('An unexpected error occurred while fetching wallet data. Please set up your wallet again.')
      localStorage.removeItem(storage.walletId)
      wallet.value = null
      setTimeout(() => { 
        window.location.reload()
      }, 3000)
    } finally {
      loading.value = false
    }
  }

  const setupWallet = async (name: string, balance?: string): Promise<boolean> => {
    loading.value = true
    
    const initialBalance = balance ? parseFloat(balance) : 0
    const response: ApiResponse<Wallet> = await apiService.setupWallet(name, initialBalance)
    
    if (response.success && response.data) {
      // Save to localStorage and store
      localStorage.setItem(storage.walletId, response.data.id)
      wallet.value = response.data
      loading.value = false
      return true
    } else {
      loading.value = false
      return false
    }
    
   
  }

  const updateBalance = async (walletId: string, amount: number, description: string): Promise<boolean> => {
    const response: ApiResponse<{ balance: number }> = await apiService.updateWalletBalance(walletId, amount, description)
    
    if (response.success && response.data && wallet.value) {
      wallet.value.balance = response.data.balance
      return true
    } else {
      return false
    }
  }

  const clearWallet = (): void => {
    localStorage.removeItem(storage.walletId)
    wallet.value = null
  }

  return {
    wallet,
    loading,
    initializeWallet,
    fetchWallet,
    setupWallet,
    updateBalance,
    clearWallet
  }
}) 
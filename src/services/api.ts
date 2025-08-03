import axios, { AxiosResponse, AxiosError } from 'axios'
import { api } from '../config'

const apiClient = axios.create({
  baseURL: api.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error: AxiosError) => {
    console.error('Response error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export interface Wallet {
  id: string
  name: string
  balance: number
  date: string
}

export interface Transaction {
  total: number;
  transactions: Transaction[];
}

export interface TransactionListResponse {
  total: number;
  transactions: Transaction[];
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

class ApiService {

  async setupWallet(name: string, balance: number = 0): Promise<ApiResponse<Wallet>> {
    try {
      const response = await apiClient.post('/setup', { name, balance })
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to setup wallet'
      }
    }
  }

  async getWallet(walletId: string): Promise<ApiResponse<Wallet>> {
    try {
      const response = await apiClient.get(`/wallet/${walletId}`)
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch wallet'
      }
    }
  }

  async updateWalletBalance(walletId: string, amount: number, description: string = 'Transaction'): Promise<ApiResponse<{ balance: number }>> {
    try {
      const response = await apiClient.post(`/transact/${walletId}`, {
        amount,
        description
      })
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update balance'
      }
    }
  }

  async getTransactions(
    walletId: string, 
    skip: number = 0, 
    limit: number = 10, 
    sortBy: string = 'date', 
    order: 'asc' | 'desc' = 'asc'
  ): Promise<ApiResponse<TransactionListResponse>> {
    try {
      const response = await apiClient.get(`/transactions`, {
        params: {
          walletId,
          skip,
          limit,
          sortBy,
          order
        }
      })
      return {
        success: true,
        data: {
          total: response.data.total,
          transactions: response.data.transactions
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch transactions'
      }
    }
  }

  async getAllTransactions(walletId: string): Promise<ApiResponse<Transaction[]>> {
    try {
      const response = await apiClient.get(`/transactions`, {
        params: { walletId }
      })
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch all transactions'
      }
    }
  }
}

export const apiService = new ApiService() 
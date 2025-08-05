import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { api } from '../config'
import { showSuccessToast, showErrorToast } from '../plugins/notification'

const realApiClient = axios.create({
  baseURL: api.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

realApiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

realApiClient.interceptors.response.use(
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
  id: string;
  walletId: string;
  amount: number;
  balance: number;
  description: string;
  date: string; 
  type: 'CREDIT' | 'DEBIT';
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

export class ApiService {
  constructor(private axiosInstance: AxiosInstance = realApiClient) {}

  async setupWallet(name: string, balance: number = 0): Promise<ApiResponse<Wallet>> {
    try {
      const response = await this.axiosInstance.post('/setup', { name, balance })
      showSuccessToast('Wallet setup successfully!')
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to setup wallet'
      showErrorToast(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  async getWallet(walletId: string): Promise<ApiResponse<Wallet>> {
    try {
      const response = await this.axiosInstance.get(`/wallet/${walletId}`)
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch wallet'
      showErrorToast(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  async updateWalletBalance(walletId: string, amount: number, description: string = 'Transaction'): Promise<ApiResponse<{ balance: number }>> {
    try {
      const response = await this.axiosInstance.post(`/transact/${walletId}`, {
        amount,
        description
      })
      showSuccessToast('Balance updated successfully!')
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update balance'
      showErrorToast(errorMessage)
      return {
        success: false,
        error: errorMessage
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
      const response = await this.axiosInstance.get(`/transactions`, {
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
      const errorMessage = error.response?.data?.message || 'Failed to fetch transactions'
      showErrorToast(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  async getAllTransactions(walletId: string,exportAll: boolean): Promise<ApiResponse<TransactionListResponse>> {
    try {
      const response = await this.axiosInstance.get(`/transactions`, {
        params: { walletId, exportAll }
      })
      return {
        success: true,
        data: response.data
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch all transactions'
      showErrorToast(errorMessage)
      return {
        success: false,
        error: errorMessage
      }
    }
  }
}

export const apiService = new ApiService() 
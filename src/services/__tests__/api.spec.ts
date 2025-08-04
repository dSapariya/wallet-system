import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ApiService } from '../api'
import { showSuccessToast, showErrorToast } from '../../plugins/notification'

// Mock toast notifications
vi.mock('../../plugins/notification', () => ({
  showSuccessToast: vi.fn(),
  showErrorToast: vi.fn()
}))

// Create a single mock axios instance
const mockAxiosInstance = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } }
}

let apiService: ApiService

beforeEach(() => {
  vi.clearAllMocks()
  apiService = new ApiService(mockAxiosInstance as any)
})

describe('ApiService', () => {
  it('setupWallet success', async () => {
    mockAxiosInstance.post.mockResolvedValueOnce({
      data: { id: 'wallet-id-1', name: 'Test Wallet', balance: 0, date: '2023-01-01' }
    })
    const response = await apiService.setupWallet('Test Wallet', 0)
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/setup', { name: 'Test Wallet', balance: 0 })
    expect(response.success).toBe(true)
    expect(response.data).toEqual({ id: 'wallet-id-1', name: 'Test Wallet', balance: 0, date: '2023-01-01' })
    expect(showSuccessToast).toHaveBeenCalledWith('Wallet setup successfully!')
    expect(showErrorToast).not.toHaveBeenCalled()
  })

  it('setupWallet error', async () => {
    mockAxiosInstance.post.mockRejectedValueOnce({
      response: { data: { message: 'Wallet setup failed' } }
    })
    const response = await apiService.setupWallet('Test Wallet', 0)
    expect(response.success).toBe(false)
    expect(response.error).toBe('Wallet setup failed')
    expect(showErrorToast).toHaveBeenCalledWith('Wallet setup failed')
    expect(showSuccessToast).not.toHaveBeenCalled()
  })

  it('getWallet success', async () => {
    mockAxiosInstance.get.mockResolvedValueOnce({
      data: { id: 'wallet-id-1', name: 'Test Wallet', balance: 100, date: '2023-01-01' }
    })
    const response = await apiService.getWallet('wallet-id-1')
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/wallet/wallet-id-1')
    expect(response.success).toBe(true)
    expect(response.data).toEqual({ id: 'wallet-id-1', name: 'Test Wallet', balance: 100, date: '2023-01-01' })
    expect(showSuccessToast).not.toHaveBeenCalled()
    expect(showErrorToast).toHaveBeenCalledTimes(0)
  })

  it('getWallet error', async () => {
    mockAxiosInstance.get.mockRejectedValueOnce({
      response: { data: { message: 'Wallet with ID non-existent-id not found' } }
    })
    const response = await apiService.getWallet('non-existent-id')
    expect(response.success).toBe(false)
    expect(response.error).toBe('Wallet with ID non-existent-id not found')
    expect(showErrorToast).toHaveBeenCalledWith('Wallet with ID non-existent-id not found')
    expect(showSuccessToast).not.toHaveBeenCalled()
  })

  it('updateWalletBalance success', async () => {
    mockAxiosInstance.post.mockResolvedValueOnce({
      data: { balance: 150 }
    })
    const response = await apiService.updateWalletBalance('wallet-id-1', 50, 'Credit')
    expect(mockAxiosInstance.post).toHaveBeenCalledWith(
      '/transact/wallet-id-1',
      { amount: 50, description: 'Credit' }
    )
    expect(response.success).toBe(true)
    expect(response.data).toEqual({ balance: 150 })
    expect(showSuccessToast).toHaveBeenCalledWith('Balance updated successfully!')
    expect(showErrorToast).not.toHaveBeenCalled()
  })

  it('updateWalletBalance error', async () => {
    mockAxiosInstance.post.mockRejectedValueOnce({
      response: { data: { message: 'Wallet with ID wallet-id-1 not found' } }
    })
    const response = await apiService.updateWalletBalance('wallet-id-1', -200, 'Debit')
    expect(response.success).toBe(false)
    expect(response.error).toBe('Wallet with ID wallet-id-1 not found')
    expect(showErrorToast).toHaveBeenCalledWith('Wallet with ID wallet-id-1 not found')
    expect(showSuccessToast).not.toHaveBeenCalled()
  })

  it('getTransactions success', async () => {
    const mockTransactions = [
      { id: 't1', amount: 10, balance: 10, description: 'Desc1', date: 'd1', type: 'CREDIT' }
    ]
    mockAxiosInstance.get.mockResolvedValueOnce({
      data: { total: 1, transactions: mockTransactions }
    })
    const response = await apiService.getTransactions('wallet-id-1', 0, 10, 'date', 'asc')
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/transactions', {
      params: { walletId: 'wallet-id-1', skip: 0, limit: 10, sortBy: 'date', order: 'asc' }
    })
    expect(response.success).toBe(true)
    expect(response.data).toEqual({ total: 1, transactions: mockTransactions })
    expect(showSuccessToast).not.toHaveBeenCalled()
    expect(showErrorToast).not.toHaveBeenCalled()
  })

  it('getTransactions error', async () => {
    mockAxiosInstance.get.mockRejectedValueOnce({
      response: { data: { message: 'Wallet with ID wallet-id-1 not found' } }
    })
    const response = await apiService.getTransactions('wallet-id-1', 0, 10, 'date', 'asc')
    expect(response.success).toBe(false)
    expect(response.error).toBe('Wallet with ID wallet-id-1 not found')
    expect(showErrorToast).toHaveBeenCalledWith('Wallet with ID wallet-id-1 not found')
    expect(showSuccessToast).not.toHaveBeenCalled()
  })

  it('getAllTransactions success', async () => {
    const mockTransactions = [
      { id: 't1', amount: 10, balance: 10, description: 'Desc1', date: 'd1', type: 'CREDIT' },
      { id: 't2', amount: -5, balance: 5, description: 'Desc2', date: 'd2', type: 'DEBIT' }
    ]
    mockAxiosInstance.get.mockResolvedValueOnce({
      data: { total: 2, transactions: mockTransactions }
    })
    const response = await apiService.getAllTransactions('wallet-id-1')
    expect(mockAxiosInstance.get).toHaveBeenCalledWith(
      `/transactions`,
      { params: { walletId: 'wallet-id-1' } }
    )
    expect(response.success).toBe(true)
    expect(response.data).toEqual({ total: 2, transactions: mockTransactions })
    expect(showSuccessToast).not.toHaveBeenCalled()
    expect(showErrorToast).not.toHaveBeenCalled()
  })

  it('getAllTransactions error', async () => {
    mockAxiosInstance.get.mockRejectedValueOnce({
      response: { data: { message: 'Wallet with ID wallet-id-1 not found' } }
    })
    const response = await apiService.getAllTransactions('wallet-id-1')
    expect(response.success).toBe(false)
    expect(response.error).toBe('Wallet with ID wallet-id-1 not found')
    expect(showErrorToast).toHaveBeenCalledWith('Wallet with ID wallet-id-1 not found')
    expect(showSuccessToast).not.toHaveBeenCalled()
  })
})
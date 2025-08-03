// Environment configuration
export const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002',
  },
  
  // App Configuration
  app: {
    name: 'Wallet System',
    version: '1.0.0',
  },
  
  // Local Storage Keys
  storage: {
    walletId: 'walletId',
    userPreferences: 'userPreferences',
  },
} as const

// Type for the config object
export type Config = typeof config

// Helper function to validate required environment variables
export const validateEnvironment = (): void => {
  const requiredEnvVars = ['VITE_API_BASE_URL']
  
  for (const envVar of requiredEnvVars) {
    if (!import.meta.env[envVar]) {
      console.warn(`Warning: ${envVar} is not set. Using default value.`)
    }
  }
}

export const { api, app, storage } = config 
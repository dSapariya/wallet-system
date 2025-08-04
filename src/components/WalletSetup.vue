<template>
  <div class="card">
    <div class="text-center mb-6">
      <h2 class="text-2xl font-semibold text-gray-900 mb-2">Create Your Wallet</h2>
      <p class="text-gray-600">Set up your digital wallet to start managing transactions</p>
    </div>

    <Form @submit="handleSubmit" v-slot="{ errors, isSubmitting }" class="space-y-6">
      <div>
        <label for="walletName" class="block text-sm font-medium text-gray-700 mb-2">
          Wallet User Name <span class="text-red-500">*</span>
        </label>
        <Field
          id="walletName"
          v-model="form.walletName"
          name="walletName"
          type="text"
          :rules="fieldRules.walletName"
          :class="[
            'input-field',
            { 'border-red-500 focus:ring-red-500': errors.walletName }
          ]"
          placeholder="Enter wallet user name"
          :disabled="loading"
        />
        <ErrorMessage name="walletName" class="text-red-500 text-sm mt-1" />
      </div>

      <div>
        <label for="balance" class="block text-sm font-medium text-gray-700 mb-2">
          Initial Balance (Optional)
        </label>
        <Field
          id="balance"
          v-model="form.balance"
          name="balance"
          type="number"
          step="0.01"
          min="0"
          :rules="fieldRules.balance"
          class="input-field"
          placeholder="0.00"
          :disabled="loading"
        />
        <p class="text-sm text-gray-500 mt-1">
          Leave empty to start with zero balance
        </p>
        <ErrorMessage name="balance" class="text-red-500 text-sm mt-1" />
      </div>

      <div class="flex justify-center">
        <button
          type="submit"
          class="btn-primary w-full max-w-xs"
          :disabled="loading || isSubmitting"
        >
          <span v-if="loading || isSubmitting" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Wallet...
          </span>
          <span v-else>Create Wallet</span>
        </button>
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { useWalletStore } from '../stores/useWalletStore'
import { fieldRules } from '../plugins/validation'

const emit = defineEmits<{
  walletCreated: []
}>()

const walletStore = useWalletStore()
const loading = ref(false)

const form = ref({
  walletName: '',
  balance: ''
})

const handleSubmit = async (values: any, { resetForm }: any) => {
  loading.value = true
  
  try {
    const success = await walletStore.setupWallet(
      values.walletName.trim(),
      values.balance || undefined
    )
    
    if (success) {
      resetForm()
      form.value = {
        walletName: '',
        balance: ''
      }
      emit('walletCreated')
     
    }
  } finally {
    loading.value = false
  }
}
</script> 
<template>
  <div class="card">
    <h2 class="text-2xl font-semibold text-gray-900 mb-6">New Transaction</h2>

    <Form @submit="handleSubmit" v-slot="{ errors, isSubmitting }" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">Transaction Type</label>
        <div class="flex space-x-4">
          <label class="flex items-center">
            <input
              v-model="form.type"
              type="radio"
              value="credit"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              :disabled="loading"
            />
            <span class="ml-2 text-sm font-medium text-gray-700">Credit</span>
          </label>
          <label class="flex items-center">
            <input
              v-model="form.type"
              type="radio"
              value="debit"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              :disabled="loading"
            />
            <span class="ml-2 text-sm font-medium text-gray-700">Debit</span>
          </label>
        </div>
      </div>

      <div>
        <label for="amount" class="block text-sm font-medium text-gray-700 mb-2">
          Amount <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            $
          </span>
          <Field
            id="amount"
            v-model="form.amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            :rules="fieldRules.amount"
            :class="[
              'input-field pl-8',
              { 'border-red-500 focus:ring-red-500': errors.amount }
            ]"
            placeholder="0.00"
            :disabled="loading"
          />
        </div>
        <ErrorMessage name="amount" class="text-red-500 text-sm mt-1" />
      </div>

      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
          Description <span class="text-red-500">*</span>
        </label>
        <Field
          id="description"
          v-model="form.description"
          name="description"
          type="text"
          :rules="fieldRules.description"
          :class="[
            'input-field',
            { 'border-red-500 focus:ring-red-500': errors.description }
          ]"
          placeholder="Enter transaction description"
          :disabled="loading"
        />
        <ErrorMessage name="description" class="text-red-500 text-sm mt-1" />
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
            Processing...
          </span>
          <span v-else>Submit Transaction</span>
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
  transactionCompleted: []
}>()

const props = defineProps<{
  walletId: string
}>()

const walletStore = useWalletStore()
const loading = ref(false)

const form = ref({
  type: 'credit',
  amount: '',
  description: ''
})

const handleSubmit = async (values: any, { resetForm }: any) => {
  loading.value = true
  
  try {

    let amount = parseFloat(values.amount)
    if (form.value.type === 'debit') {
      amount = -amount
    }

    const success = await walletStore.updateBalance(props.walletId, amount,values.description)
    
    if (success) {
      resetForm()
      form.value = {
        type: 'credit',
        amount: '',
        description: ''
      }
      emit('transactionCompleted')
    }
  } finally {
    loading.value = false
  }
}
</script> 
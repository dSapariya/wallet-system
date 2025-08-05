import { configure, defineRule } from 'vee-validate';
import {
  required,
  min,
  max,
  min_value,
  max_value,
  alpha_spaces,
} from '@vee-validate/rules';

export const decimal = (value: any): boolean | string => {
  if (value === undefined || value === null || value === '') return true;
  const stringValue = String(value);
  if (!/^-?\d*\.?\d*$/.test(stringValue)) {
    return 'You can add only numbers';
  }
  if (!/^-?\d+(\.\d{1,4})?$/.test(stringValue)) {
    return 'Must be a valid decimal (up to 4 digits)';
  }
  return true;
};

export const amountValidation = (value: any, context?: { isInitialBalance?: boolean }): boolean | string => {
  if (value === undefined || value === null || value === '') return true;

  const stringValue = String(value);

  if (!/^-?\d+(\.\d+)?$/.test(stringValue)) {
    return 'You can add only numbers';
  }

  const num = parseFloat(stringValue);

  if (isNaN(num)) {
    return 'You can add only numbers';
  }

  if (num < 0) {
    return 'Use only positive numbers';
  }

  const parts = stringValue.split('.');
  if (parts.length === 2 && parts[1].length > 4) {
    return 'Must be a valid decimal (up to 4 digits)';
  }

  if (!context?.isInitialBalance && num < 0.0001) { 
    return 'Amount must be at least $0.0001'; 
  }
  if (num > 999999.99) {
    return 'Amount cannot exceed $999,999.99';
  }
  return true;
};

defineRule('required', required);
defineRule('min', min);
defineRule('max', max);
defineRule('min_value', min_value);
defineRule('max_value', max_value);
defineRule('decimal', decimal);
defineRule('amountValidation', amountValidation);
defineRule('alpha_spaces', alpha_spaces);

configure({
  validateOnInput: true,
  validateOnBlur: true,
  validateOnChange: true,
  validateOnModelUpdate: true,
  generateMessage: (ctx: any) => {
    const { field, rule, params } = ctx;
    const fieldNames: Record<string, string> = {
      walletName: 'Wallet name',
      balance: 'Balance',
      amount: 'Amount',
      description: 'Description',
    };
    const fieldName = fieldNames[field] || field;
    const messages: Record<string, string> = {
      required: `${fieldName} is required field`,
      min: `${fieldName} must be at least ${params?.length || params?.min} characters`,
      max: `${fieldName} must be no more than ${params?.length || params?.max} characters`,
      min_value: `${fieldName} must be at least ${params?.min}`,
      max_value: `${fieldName} must be no more than ${params?.max}`,
      decimal: `${fieldName} must be a valid decimal (up to 4 digits)`,
      amountValidation: `Balance should be positive numbers`,
      alpha_spaces: `${fieldName} may only contain alphabetic characters and spaces`,
    };
    return messages[rule] || `${fieldName} is required field`;
  }
});

export const fieldRules = {
  walletName: 'required|min:2|max:50|alpha_spaces',
  balance: 'amountValidation:isInitialBalance', 
  amount: 'required|amountValidation',
  description: 'required|min:3|max:100',
};

export const validationSchemas = {
  walletSetup: {
    walletName: 'required|min:2|max:50|alpha_spaces',
    balance: 'amountValidation:isInitialBalance'
  },
  transaction: {
    amount: 'required|amountValidation',
    description: 'required|min:3|max:100'
  },
};

export const getFieldRule = (fieldName: keyof typeof fieldRules): string => {
  return fieldRules[fieldName];
};

export const isFieldRequired = (fieldName: keyof typeof fieldRules): boolean => {
  return fieldRules[fieldName].includes('required');
};

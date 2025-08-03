import { configure, defineRule } from 'vee-validate';
import {
  required,
  min,
  max,
  min_value,
  max_value,
  alpha_spaces,
  email,
  confirmed
} from '@vee-validate/rules';

const decimal = (value: any): boolean | string => {
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

const positiveNumber = (value: any): boolean | string => {
  if (value === undefined || value === null || value === '') return true;
  const num = parseFloat(value);
  if (isNaN(num)) return 'You can add only numbers';
  if (num < 0) return 'Use only positive numbers';
  return true;
};

const amountValidation = (value: any): boolean | string => {
  if (value === undefined || value === null || value === '') return true;
  const stringValue = String(value);
  if (!/^\d*\.?\d*$/.test(stringValue)) {
    return 'You can add only numbers';
  }
  if (!/^\d+(\.\d{1,4})?$/.test(stringValue)) {
    return 'Must be a valid decimal (up to 4 digits)';
  }
  const num = parseFloat(value);
  if (num < 0) return 'Use only positive numbers';
  if (num < 0.01) return 'Amount must be at least $0.01';
  if (num > 999999.99) return 'Amount cannot exceed $999,999.99';
  return true;
};

defineRule('required', required);
defineRule('min', min);
defineRule('max', max);
defineRule('min_value', min_value);
defineRule('max_value', max_value);
defineRule('decimal', decimal);
defineRule('positiveNumber', positiveNumber);
defineRule('amountValidation', amountValidation);
defineRule('alpha_spaces', alpha_spaces);
defineRule('email', email);
defineRule('confirmed', confirmed);

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
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm password'
    };
    const fieldName = fieldNames[field] || field;
    const messages: Record<string, string> = {
      required: `${fieldName} is required field`,
      min: `${fieldName} must be at least ${params?.length || params?.min} characters`,
      max: `${fieldName} must be no more than ${params?.length || params?.max} characters`,
      min_value: `${fieldName} must be at least ${params?.min}`,
      max_value: `${fieldName} must be no more than ${params?.max}`,
      decimal: `${fieldName} must be a valid decimal (up to 4 digits)`,
      positiveNumber: `${fieldName} must be a positive number`,
      amountValidation: `${fieldName} is invalid`,
      alpha_spaces: `${fieldName} may only contain alphabetic characters and spaces`,
      email: `${fieldName} must be a valid email`,
      confirmed: `${fieldName} confirmation does not match`,
    };
    return messages[rule] || `${fieldName} is required field`;
  }
});

export const fieldRules = {
  walletName: 'required|min:2|max:50|alpha_spaces',
  balance: 'decimal|min_value:0|max_value:999999.99',
  amount: 'required|amountValidation',
  description: 'required|min:3|max:100',
  email: 'required|email',
  password: 'required|min:8|max:50',
  confirmPassword: 'required|confirmed:@password'
};

export const validationSchemas = {
  walletSetup: {
    walletName: 'required|min:2|max:50|alpha_spaces',
    balance: 'decimal|min_value:0|max_value:999999.99'
  },
  transaction: {
    amount: 'required|amountValidation',
    description: 'required|min:3|max:100'
  },
  userRegistration: {
    email: 'required|email',
    password: 'required|min:8|max:50',
    confirmPassword: 'required|confirmed:@password'
  }
};

export const getFieldRule = (fieldName: keyof typeof fieldRules): string => {
  return fieldRules[fieldName];
};

export const isFieldRequired = (fieldName: keyof typeof fieldRules): boolean => {
  return fieldRules[fieldName].includes('required');
};

import { describe, expect, it } from 'vitest'
import { decimal, amountValidation, getFieldRule, isFieldRequired } from '../validation'

describe('Validation Rules', () => {
  describe('decimal', () => {
    it('should return true for valid decimal numbers', () => {
      expect(decimal(123)).toBe(true)
      expect(decimal(123.45)).toBe(true)
      expect(decimal('123')).toBe(true)
      expect(decimal('123.45')).toBe(true)
      expect(decimal('0.1234')).toBe(true)
      expect(decimal('-123')).toBe(true)
      expect(decimal('-123.45')).toBe(true)
      expect(decimal(0)).toBe(true)
      expect(decimal('')).toBe(true)
      expect(decimal(null)).toBe(true)
      expect(decimal(undefined)).toBe(true)
    })

    it('should return an error message for invalid characters', () => {
      expect(decimal('123a')).toBe('You can add only numbers')
      expect(decimal('abc')).toBe('You can add only numbers')
    })

    it('should return an error message for more than 4 decimal places', () => {
      expect(decimal('123.12345')).toBe('Must be a valid decimal (up to 4 digits)')
    })
  })

  describe('amountValidation', () => {
    it('should return true for valid amount numbers', () => {
      expect(amountValidation(10)).toBe(true)
      expect(amountValidation(0.0001)).toBe(true)
      expect(amountValidation(999999.99)).toBe(true)
      expect(amountValidation('123.45')).toBe(true)
      expect(amountValidation('')).toBe(true)
      expect(amountValidation(null)).toBe(true)
      expect(amountValidation(undefined)).toBe(true)
    })

    it('should return an error message for invalid characters', () => {
      expect(amountValidation('100a')).toBe('You can add only numbers')
    })

    it('should return an error message for negative numbers', () => {
      expect(amountValidation(-10)).toBe('Use only positive numbers')
    })

    it('should return an error message for amount less than 0.0001', () => {
      expect(amountValidation(0)).toBe('Amount must be at least $0.0001')
      expect(amountValidation(0.000001)).toBe('Amount must be at least $0.0001')
    })

    it('should return true for valid amounts including 0.0001', () => {
      expect(amountValidation(0.0001)).toBe(true)
      expect(amountValidation(100)).toBe(true)
      expect(amountValidation(999999.99)).toBe(true)
      expect(amountValidation(0.0005)).toBe(true)
    })

    it('should return an error message for amount exceeding 999999.99', () => {
      expect(amountValidation(1000000)).toBe('Amount cannot exceed $999,999.99')
    })

    it('should return an error message for more than 4 decimal places', () => {
      expect(amountValidation('10.12345')).toBe('Must be a valid decimal (up to 4 digits)')
    })
  })

  describe('getFieldRule', () => {
    it('should return the correct rule string for a given field name', () => {
      expect(getFieldRule('walletName')).toBe('required|min:2|max:50|alpha_spaces')
      expect(getFieldRule('amount')).toBe('required|amountValidation')
    })
  })

  describe('isFieldRequired', () => {
    it('should return true if the field rule includes required', () => {
      expect(isFieldRequired('walletName')).toBe(true)
    })

    it('should return false if the field rule does not include required', () => {
      expect(isFieldRequired('balance')).toBe(false)
    })
  })
})
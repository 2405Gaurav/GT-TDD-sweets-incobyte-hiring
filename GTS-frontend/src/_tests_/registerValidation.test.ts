import { describe, it, expect } from 'vitest'
import { Register } from '../pages/Register'

describe('Register', () => {
  it('fails when name is empty', () => {
    expect(
      Register('', 'a@b.com', '123456')
    ).toBe('Name is required')
  })

  it('fails when email is empty', () => {
    expect(
      Register('John', '', '123456')
    ).toBe('Email is required')
  })

  it('fails when password is empty', () => {
    expect(
      Register('John', 'a@b.com', '')
    ).toBe('Password is required')
  })

  it('fails when password is too short', () => {
    expect(
      Register('John', 'a@b.com', '123')
    ).toBe('Password must be at least 6 characters')
  })

  it('passes when all inputs are valid', () => {
    expect(
      Register('John', 'a@b.com', '123456')
    ).toBeNull()
  })
})

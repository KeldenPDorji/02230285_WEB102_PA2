/**
 * Input validation utilities
 */

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validates email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates password requirements
 * - Minimum 6 characters
 */
export function validatePassword(password: string): boolean {
  return Boolean(password && password.length >= 6);
}

/**
 * Validates Pokémon name
 * - Only alphanumeric characters and hyphens
 * - Length between 1 and 50 characters
 */
export function validatePokemonName(name: string): boolean {
  const nameRegex = /^[a-zA-Z0-9-]{1,50}$/;
  return nameRegex.test(name);
}

/**
 * Validates and sanitizes user registration input
 */
export function validateRegistrationInput(email: string, password: string): void {
  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  if (!validateEmail(email)) {
    throw new ValidationError('Invalid email format');
  }

  if (!validatePassword(password)) {
    throw new ValidationError('Password must be at least 6 characters long');
  }
}

/**
 * Validates and sanitizes login input
 */
export function validateLoginInput(email: string, password: string): void {
  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  if (!validateEmail(email)) {
    throw new ValidationError('Invalid email format');
  }
}

/**
 * Validates catch Pokémon input
 */
export function validateCatchPokemonInput(name: string): void {
  if (!name) {
    throw new ValidationError('Pokémon name is required');
  }

  if (!validatePokemonName(name)) {
    throw new ValidationError('Invalid Pokémon name format');
  }
}

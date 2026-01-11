/**
 * Type definitions for the application
 */

import type { JwtVariables } from 'hono/jwt';

export type Variables = JwtVariables;

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CatchPokemonRequest {
  name: string;
}

export interface JWTPayload {
  sub: string;
  exp: number;
}

export interface ErrorResponse {
  message: string;
  error?: string;
}

export interface SuccessResponse<T = unknown> {
  message: string;
  data?: T;
  token?: string;
}

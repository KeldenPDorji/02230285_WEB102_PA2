/**
 * Application Configuration
 * Centralized configuration for environment variables
 */

export const config = {
  jwt: {
    secret: Bun.env.JWT_SECRET || 'mySecretKey',
    expiry: Bun.env.JWT_EXPIRY || '1h',
  },
  server: {
    port: parseInt(Bun.env.PORT || '3000', 10),
    env: Bun.env.NODE_ENV || 'development',
  },
  database: {
    url: Bun.env.DATABASE_URL || 'file:./prisma/dev.db',
  },
  bcrypt: {
    cost: 10,
  },
} as const;

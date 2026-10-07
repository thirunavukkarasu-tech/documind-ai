import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5000),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),
  MONGODB_URI: z.string().default('mongodb://root:password@localhost:27017/documind-ai?authSource=admin'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),

  // Authentication (Phase 2)
  JWT_ACCESS_SECRET: z.string().default('your_access_token_secret_change_this_in_production'),
  JWT_REFRESH_SECRET: z.string().default('your_refresh_token_secret_change_this_in_production'),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  // Future phases
  OLLAMA_BASE_URL: z.string().url().optional(),
  QDRANT_URL: z.string().url().optional(),
  QDRANT_COLLECTION_NAME: z.string().default('documind-embeddings'),
});

export type Environment = z.infer<typeof EnvSchema>;

let cachedEnv: Environment | null = null;

export function getEnvironment(): Environment {
  if (cachedEnv) {
    return cachedEnv;
  }

  const result = EnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.errors);
    process.exit(1);
  }

  cachedEnv = result.data;
  return cachedEnv;
}

export const env = getEnvironment();

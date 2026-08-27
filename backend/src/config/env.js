const REQUIRED = ['MONGO_URI', 'JWT_SECRET'];

export function validateEnv() {
  const missing = REQUIRED.filter((key) => !process.env[key] || !String(process.env[key]).trim());
  if (missing.length) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  if (process.env.JWT_SECRET === 'change_this_to_a_long_random_string' || process.env.JWT_SECRET.length < 16) {
    console.warn('Warning: JWT_SECRET looks weak. Use a long random string in production.');
  }

  if (!process.env.OPENROUTER_API_KEY) {
    console.warn('Warning: OPENROUTER_API_KEY is not set. AI features will be unavailable.');
  }
}

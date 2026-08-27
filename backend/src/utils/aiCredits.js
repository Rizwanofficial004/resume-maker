import User from '../models/User.js';

export function ensureAiConfigured() {
  if (!process.env.OPENROUTER_API_KEY) {
    const error = new Error('OpenRouter API key is not configured on the server');
    error.statusCode = 503;
    throw error;
  }
}

/** Atomically reserve one credit. Throws 402 if none left. */
export async function reserveCredit(userId) {
  const updated = await User.findOneAndUpdate(
    { _id: userId, aiCredits: { $gt: 0 } },
    { $inc: { aiCredits: -1 } },
    { new: true }
  );
  if (!updated) {
    const error = new Error('You have no AI credits left. Please upgrade your plan.');
    error.statusCode = 402;
    throw error;
  }
  return updated;
}

export async function refundCredit(userId) {
  await User.findByIdAndUpdate(userId, { $inc: { aiCredits: 1 } });
}

/**
 * Run an AI call: reserve credit first (atomic), call provider, refund on failure.
 * Returns { result, aiCredits }.
 */
export async function withCredit(user, fn) {
  ensureAiConfigured();
  const afterReserve = await reserveCredit(user._id);
  try {
    const result = await fn();
    return { result, aiCredits: afterReserve.aiCredits };
  } catch (err) {
    await refundCredit(user._id);
    throw err;
  }
}


// Check if we're in development and use a fallback key if .env is not set up
const getOpenRouterApiKey = () => {
  const envKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  
  // Fallback for development only - do not rely on this in production
  const fallbackKey = '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';
  
  return envKey || fallbackKey;
};

export const OPENROUTER_API_KEY = getOpenRouterApiKey();

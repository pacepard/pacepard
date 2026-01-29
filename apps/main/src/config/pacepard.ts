import { Pacepard } from '@pacepard/sdk';

/**
 * Get API base URL from environment or use default
 */
const getApiBaseUrl = () => {
  // Check environment variable
  if ((import.meta as any).env && (import.meta as any).env.VITE_APP_API_URL) {
    return (import.meta as any).env.VITE_APP_API_URL as string;
  }
  throw new Error('VITE_APP_API_URL is not set');
};

// Initialize Pacepard SDK with API base URL
export const PacepardAPI = new Pacepard(getApiBaseUrl());

// Also export as PacepardAPI for consistency//
//export { pacepardAPI as PacepardAPI };

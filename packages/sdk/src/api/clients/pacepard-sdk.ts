import AxiosService from '../core/axios';
import PacepardAPIClient from './pacepard';

/**
 * PacepardAPI - Main SDK class for interacting with the Pacepard API
 * 
 * Follows the same pattern as Paystack and Stripe SDKs.
 * 
 * @example
 * ```ts
 * import PacepardAPI from '@pacepard/sdk';
 * 
 * const pacepard = new PacepardAPI('http://localhost:5015/api/v1');
 * 
 * // Use the SDK
 * const result = await pacepard.auth.loginUser({
 *   email: 'user@example.com',
 *   password: 'password123'
 * });
 * ```
 */
class Pacepard extends PacepardAPIClient {
  constructor(baseUrl: string) {
    const axiosService = new AxiosService(baseUrl);
    super(axiosService);
    // Set global instance for hooks to access
    setGlobalInstance(this);
  }
}

// Global instance for internal SDK use (hooks, etc.)
let globalInstance: PacepardAPIClient | null = null;

function setGlobalInstance(instance: PacepardAPIClient): void {
  globalInstance = instance;
}

export function getGlobalInstance(): PacepardAPIClient {
  if (!globalInstance) {
    throw new Error('Pacepard SDK not initialized. Please create an instance with: new PacepardAPI(baseUrl)');
  }
  return globalInstance;
}

export default Pacepard;

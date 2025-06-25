
import { API_CONFIG } from '../../config/api';

export class HealthApiService {
  private static baseUrl = API_CONFIG.BACKEND_BASE_URL;

  static async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Backend is not responding');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Health Check Error:', error);
      throw error;
    }
  }
}

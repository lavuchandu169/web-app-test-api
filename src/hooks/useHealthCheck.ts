
import { useState, useEffect } from 'react';
import { HealthApiService } from '../services/api/healthApi';

export const useHealthCheck = () => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkHealth = async () => {
    try {
      await HealthApiService.checkHealth();
      setIsHealthy(true);
      setLastChecked(new Date());
    } catch (error) {
      console.warn('Backend health check failed:', error);
      setIsHealthy(false);
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    checkHealth();
    
    // Check health every 5 minutes
    const interval = setInterval(checkHealth, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { isHealthy, lastChecked, checkHealth };
};

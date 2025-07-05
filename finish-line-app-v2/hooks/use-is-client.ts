import { useEffect, useState } from 'react';

/**
 * Hook to ensure client-side only rendering for components that use browser APIs
 * or time-dependent calculations that might cause hydration mismatches
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

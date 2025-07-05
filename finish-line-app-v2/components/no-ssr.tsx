import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

interface NoSSRProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component that only renders its children on the client side
 * Useful for preventing hydration mismatches with components that use browser APIs
 */
function NoSSRComponent({ children, fallback = null }: NoSSRProps) {
  return <>{children}</>;
}

export const NoSSR = dynamic(() => Promise.resolve(NoSSRComponent), {
  ssr: false,
});

export default NoSSR;

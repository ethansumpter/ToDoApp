# Hydration Error Fixes

This document outlines the fixes applied to resolve Next.js hydration errors in the application.

## Issues Fixed

### 1. Window Object Access (sign-up-form.tsx)

**Problem**: Direct access to `window.location.origin` during SSR
```tsx
// ❌ Causes hydration mismatch
emailRedirectTo: `${window.location.origin}/dashboard`
```

**Solution**: Check for client-side environment
```tsx
// ✅ Safe for SSR
const origin = typeof window !== 'undefined' ? window.location.origin : '';
emailRedirectTo: `${origin}/dashboard`
```

### 2. Date Object Inconsistencies

**Problem**: Date calculations can differ between server and client
```tsx
// ❌ Can cause hydration mismatch
const today = new Date();
```

**Solution**: Use `useIsClient` hook for date-dependent rendering
```tsx
// ✅ Client-side only rendering
const isClient = useIsClient();
// Render different content based on isClient state
```

## Utilities Created

### 1. `useIsClient` Hook

Location: `/hooks/use-is-client.ts`

Ensures components only render time-sensitive content on the client side.

```tsx
const isClient = useIsClient();

return (
  <span>
    {isClient ? `Due ${getDaysUntilDue(dueDate)} days` : "Loading..."}
  </span>
);
```

### 2. `NoSSR` Component

Location: `/components/no-ssr.tsx`

Completely disables SSR for wrapped components.

```tsx
import NoSSR from '@/components/no-ssr';

<NoSSR fallback={<div>Loading...</div>}>
  <ComponentWithBrowserAPIs />
</NoSSR>
```

## Common Hydration Causes

1. **Browser APIs**: `window`, `document`, `localStorage`, `sessionStorage`
2. **Date/Time**: Current timestamps, timezone differences
3. **Random Values**: `Math.random()`, `UUID` generation
4. **User Agents**: Browser detection
5. **Dynamic IDs**: Auto-generated IDs that differ between server/client

## Best Practices

1. **Always check for client environment** when using browser APIs
2. **Use loading states** for content that depends on client-side calculations
3. **Normalize date objects** to avoid timezone issues
4. **Use `useEffect`** for client-side only operations
5. **Consider `NoSSR` wrapper** for complex components with many browser dependencies

## Testing

To verify hydration issues are resolved:

1. Build the application: `npm run build`
2. Start in production mode: `npm start`
3. Check browser console for hydration warnings
4. Test with JavaScript disabled to ensure SSR works
5. Use React DevTools Profiler to check for unnecessary re-renders

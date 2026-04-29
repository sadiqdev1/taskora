# Error Boundary Usage Guide

## Quick Start

Wrap any component that might throw errors:

```jsx
import ErrorBoundary from '@/components/error-boundary-wrapper';

function App() {
  return (
    <ErrorBoundary>
      <YourComponent />
    </ErrorBoundary>
  );
}
```

## Recommended Usage Locations

### 1. Admin Dashboard Tabs
```jsx
// resources/js/src/admin/Dashboard.jsx
<ErrorBoundary>
  <ActiveTab searchQuery={globalSearch} />
</ErrorBoundary>
```

### 2. User Feed
```jsx
// resources/js/pages/home.jsx
<ErrorBoundary>
  <Feed serverMemes={serverMemes} serverTab={serverTab} />
</ErrorBoundary>
```

### 3. Profile Page
```jsx
// resources/js/pages/profile.jsx
<ErrorBoundary>
  <ProfileContent />
</ErrorBoundary>
```

### 4. Meme Detail
```jsx
// resources/js/pages/meme-detail.jsx
<ErrorBoundary>
  <MemeDetailContent />
</ErrorBoundary>
```

## Advanced Usage

### Custom Fallback UI
```jsx
<ErrorBoundary
  fallback={(error, reset) => (
    <div className="custom-error">
      <h2>Oops! {error.message}</h2>
      <button onClick={reset}>Retry</button>
    </div>
  )}
>
  <YourComponent />
</ErrorBoundary>
```

### Show Error Details (Development Only)
```jsx
<ErrorBoundary showDetails={import.meta.env.DEV}>
  <YourComponent />
</ErrorBoundary>
```

### Multiple Boundaries (Recommended)
```jsx
function Dashboard() {
  return (
    <div>
      <ErrorBoundary>
        <Header />
      </ErrorBoundary>
      
      <ErrorBoundary>
        <Sidebar />
      </ErrorBoundary>
      
      <ErrorBoundary>
        <MainContent />
      </ErrorBoundary>
    </div>
  );
}
```

## Best Practices

1. **Granular Boundaries** - Wrap individual features, not the entire app
2. **User-Friendly Messages** - Use custom fallbacks for better UX
3. **Error Logging** - Connect to a service like Sentry
4. **Recovery Actions** - Provide clear "Try Again" or "Go Home" options
5. **Development Details** - Show error details only in dev mode

## What Errors Are Caught?

✅ **Caught:**
- Component render errors
- Lifecycle method errors
- Constructor errors
- Child component errors

❌ **Not Caught:**
- Event handlers (use try-catch)
- Async code (use try-catch)
- Server-side rendering errors
- Errors in the error boundary itself

## Example: Event Handler Error Handling

```jsx
function MyComponent() {
  const handleClick = async () => {
    try {
      await riskyOperation();
    } catch (error) {
      console.error('Operation failed:', error);
      // Show user-friendly message
      toast.error('Something went wrong. Please try again.');
    }
  };

  return <button onClick={handleClick}>Click Me</button>;
}
```

## Integration with Error Logging

```jsx
// In error-boundary-wrapper.jsx
componentDidCatch(error, errorInfo) {
  // Log to your error tracking service
  if (window.Sentry) {
    Sentry.captureException(error, { extra: errorInfo });
  }
  
  // Or use your custom logging
  logErrorToBackend({
    error: error.toString(),
    stack: errorInfo.componentStack,
    timestamp: new Date().toISOString(),
  });
}
```

## Testing Error Boundaries

```jsx
// Create a component that throws for testing
function ErrorThrower() {
  throw new Error('Test error');
  return null;
}

// Test it
<ErrorBoundary>
  <ErrorThrower />
</ErrorBoundary>
```

## Common Patterns

### Pattern 1: Section-Level Boundaries
```jsx
<div className="dashboard">
  <ErrorBoundary>
    <StatsSection />
  </ErrorBoundary>
  
  <ErrorBoundary>
    <ChartsSection />
  </ErrorBoundary>
  
  <ErrorBoundary>
    <TableSection />
  </ErrorBoundary>
</div>
```

### Pattern 2: Route-Level Boundaries
```jsx
<Routes>
  <Route path="/admin" element={
    <ErrorBoundary>
      <AdminDashboard />
    </ErrorBoundary>
  } />
  
  <Route path="/profile" element={
    <ErrorBoundary>
      <Profile />
    </ErrorBoundary>
  } />
</Routes>
```

### Pattern 3: Feature-Level Boundaries
```jsx
<ErrorBoundary>
  <CommentSection />
</ErrorBoundary>

<ErrorBoundary>
  <ReactionPicker />
</ErrorBoundary>
```

## Troubleshooting

### Error Boundary Not Catching Errors?

1. **Check if it's an event handler** - Use try-catch instead
2. **Check if it's async** - Use try-catch in async functions
3. **Check boundary placement** - Must be parent of error source
4. **Check React version** - Error boundaries require React 16+

### Error Boundary Itself Crashing?

1. **Don't throw in componentDidCatch** - Use try-catch
2. **Don't throw in render of fallback** - Keep fallback simple
3. **Check for infinite loops** - Avoid state updates that cause re-renders

## Performance Considerations

- Error boundaries have minimal performance impact
- Only active when errors occur
- No overhead in normal operation
- Safe to use multiple boundaries

## Accessibility

The default error boundary includes:
- ✅ Proper heading hierarchy
- ✅ Keyboard-accessible buttons
- ✅ Screen reader friendly messages
- ✅ Focus management on error

## Summary

**Do:**
- ✅ Use multiple boundaries for isolation
- ✅ Provide clear recovery actions
- ✅ Log errors for debugging
- ✅ Show user-friendly messages
- ✅ Test error scenarios

**Don't:**
- ❌ Wrap the entire app in one boundary
- ❌ Rely on boundaries for event handlers
- ❌ Show technical errors to users
- ❌ Forget to test error states
- ❌ Ignore error logs

---

**Need Help?** Check the React documentation on Error Boundaries:
https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary

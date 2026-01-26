// Conditionally suppress errors - only on non-admin pages
if (typeof window !== 'undefined') {
  const isAdminPage = window.location.pathname.startsWith('/admin');
  
  if (!isAdminPage) {
    // Only suppress hydration errors on public pages
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    console.error = function(...args) {
      const message = args.join(' ');
      if (message.includes('Hydration') || message.includes('hydration')) {
        return; // Suppress hydration errors only
      }
      originalConsoleError.apply(console, args);
    };
    
    console.warn = function(...args) {
      const message = args.join(' ');
      if (message.includes('Hydration') || message.includes('hydration')) {
        return; // Suppress hydration warnings only
      }
      originalConsoleWarn.apply(console, args);
    };
  }
  // On admin pages, keep all console methods enabled for debugging
}

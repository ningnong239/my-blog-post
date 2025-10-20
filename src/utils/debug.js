// Debug utility functions
export const debugLog = (message, data = null, level = 'info') => {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
  
  switch (level) {
    case 'error':
      console.error(`${prefix} ${message}`, data);
      break;
    case 'warn':
      console.warn(`${prefix} ${message}`, data);
      break;
    case 'debug':
      console.log(`${prefix} ${message}`, data);
      break;
    default:
      console.log(`${prefix} ${message}`, data);
  }
};

// API Debug helper
export const debugAPI = {
  request: (url, method, data) => {
    debugLog(`🌐 API ${method} ${url}`, data, 'debug');
  },
  response: (url, status, data) => {
    const level = status >= 400 ? 'error' : 'debug';
    debugLog(`📥 API Response ${status} ${url}`, data, level);
  },
  error: (url, error) => {
    debugLog(`❌ API Error ${url}`, error, 'error');
  }
};

// Component Debug helper
export const debugComponent = (componentName, action, data = null) => {
  debugLog(`[${componentName}] ${action}`, data, 'debug');
};

// Performance Debug helper
export const debugPerformance = (label, startTime) => {
  const endTime = performance.now();
  const duration = endTime - startTime;
  debugLog(`⏱️ Performance: ${label}`, `${duration.toFixed(2)}ms`, 'debug');
};

// State Debug helper
export const debugState = (stateName, oldState, newState) => {
  debugLog(`🔄 State Change: ${stateName}`, {
    old: oldState,
    new: newState,
    changed: oldState !== newState
  }, 'debug');
};

// Network Debug helper
export const debugNetwork = {
  online: () => {
    debugLog('🌐 Network Status: Online', null, 'info');
  },
  offline: () => {
    debugLog('🌐 Network Status: Offline', null, 'warn');
  },
  slow: (url, duration) => {
    debugLog(`🐌 Slow Request: ${url}`, `${duration}ms`, 'warn');
  }
};

// Error Debug helper
export const debugError = (error, context = '') => {
  debugLog(`💥 Error${context ? ` in ${context}` : ''}`, {
    message: error.message,
    stack: error.stack,
    name: error.name
  }, 'error');
};

// Development mode check
export const isDev = process.env.NODE_ENV === 'development';

// Conditional debug logging
export const devLog = (message, data = null) => {
  if (isDev) {
    debugLog(message, data, 'debug');
  }
};

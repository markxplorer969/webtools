'use client';

import { usePersistentState, clearPersistentStatesByPrefix } from './usePersistentState';

/**
 * Custom hook specifically for tool state management
 * Provides easy cleanup and reset functionality for individual tools
 */
export function useToolState<T>(
  toolName: string,
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const fullKey = `${toolName}_${key}`;
  const [state, setState] = usePersistentState(fullKey, defaultValue);

  // Reset function for this specific tool state
  const reset = () => {
    setState(defaultValue);
  };

  return [state, setState, reset];
}

/**
 * Hook to manage all states for a specific tool
 * Provides batch operations for cleanup
 */
export function useToolStateManager(toolName: string) {
  // Clear all persistent states for this tool
  const clearAllStates = () => {
    clearPersistentStatesByPrefix(`${toolName}_`);
  };

  // Get all keys for this tool
  const getToolKeys = (): string[] => {
    if (typeof window === 'undefined') return [];
    
    const allKeys = Object.keys(window.localStorage);
    return allKeys.filter(key => key.startsWith(`${toolName}_`));
  };

  // Export tool data as JSON
  const exportData = (): string => {
    const keys = getToolKeys();
    const data: Record<string, any> = {};
    
    keys.forEach(key => {
      const value = window.localStorage.getItem(key);
      if (value) {
        try {
          data[key] = JSON.parse(value);
        } catch {
          data[key] = value;
        }
      }
    });
    
    return JSON.stringify(data, null, 2);
  };

  // Import tool data from JSON
  const importData = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      
      Object.keys(data).forEach(key => {
        if (key.startsWith(`${toolName}_`)) {
          window.localStorage.setItem(key, JSON.stringify(data[key]));
        }
      });
      
      return true;
    } catch (error) {
      console.error('Failed to import tool data:', error);
      return false;
    }
  };

  return {
    clearAllStates,
    getToolKeys,
    exportData,
    importData
  };
}

export default useToolState;
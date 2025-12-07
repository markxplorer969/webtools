'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook for persistent state management with localStorage
 * Automatically saves and restores state values across browser sessions
 * 
 * @template T - Type of the state value
 * @param key - Unique localStorage key for storing the value
 * @param defaultValue - Default value to use if no stored value exists
 * @returns [value, setValue] tuple similar to useState
 */
export function usePersistentState<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // Logika Pemuatan (Load) dengan Lazy Initializer
  const [state, setState] = useState<T>(() => {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      // Try to get stored value from localStorage
      const item = window.localStorage.getItem(key);
      
      // If item exists, parse and return it
      if (item !== null) {
        return JSON.parse(item);
      }
      
      // Otherwise return default value
      return defaultValue;
    } catch (error) {
      // If JSON.parse fails or localStorage is not accessible, return default
      console.warn(`Error loading persistent state for key "${key}":`, error);
      return defaultValue;
    }
  });

  // Logika Penyimpanan (Save) - Otomatis setiap kali state berubah
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') {
      return;
    }

    try {
      // Save current state to localStorage
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      // Handle localStorage errors (quota exceeded, privacy mode, etc.)
      console.warn(`Error saving persistent state for key "${key}":`, error);
    }
  }, [key, state]);

  // Return state and setter function
  return [state, setState];
}

/**
 * Utility function to clear a specific persistent state
 * @param key - localStorage key to clear
 */
export function clearPersistentState(key: string): void {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Error clearing persistent state for key "${key}":`, error);
    }
  }
}

/**
 * Utility function to clear all persistent states with specific prefix
 * @param prefix - Key prefix to match for clearing multiple states
 */
export function clearPersistentStatesByPrefix(prefix: string): void {
  if (typeof window !== 'undefined') {
    try {
      const keys = Object.keys(window.localStorage);
      keys.forEach(key => {
        if (key.startsWith(prefix)) {
          window.localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn(`Error clearing persistent states with prefix "${prefix}":`, error);
    }
  }
}

/**
 * Utility function to get all persistent state keys
 * @returns Array of localStorage keys
 */
export function getPersistentStateKeys(): string[] {
  if (typeof window !== 'undefined') {
    try {
      return Object.keys(window.localStorage);
    } catch (error) {
      console.warn('Error getting persistent state keys:', error);
      return [];
    }
  }
  return [];
}

export default usePersistentState;
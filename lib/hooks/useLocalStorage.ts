import { useState, useEffect, useCallback } from 'react';

interface UseLocalStorageOptions {
  serializer?: (value: any) => string;
  deserializer?: (value: string) => any;
  syncAcrossTabs?: boolean;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions = {}
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const {
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    syncAcrossTabs = true
  } = options;

  // Get initial value from localStorage or use provided initial value
  const getStoredValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? deserializer(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue, deserializer]);

  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  // Set value in both state and localStorage
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        setStoredValue(valueToStore);
        
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, serializer(valueToStore));
          
          // Dispatch custom event for cross-tab sync
          if (syncAcrossTabs) {
            window.dispatchEvent(
              new CustomEvent('local-storage', {
                detail: { key, value: valueToStore }
              })
            );
          }
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue, serializer, syncAcrossTabs]
  );

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        
        if (syncAcrossTabs) {
          window.dispatchEvent(
            new CustomEvent('local-storage', {
              detail: { key, value: null }
            })
          );
        }
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue, syncAcrossTabs]);

  // Listen for changes in other tabs/windows
  useEffect(() => {
    if (!syncAcrossTabs || typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(deserializer(e.newValue));
        } catch (error) {
          console.error(`Error syncing localStorage key "${key}":`, error);
        }
      }
    };

    const handleCustomEvent = (e: CustomEvent) => {
      if (e.detail.key === key) {
        setStoredValue(e.detail.value ?? initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage' as any, handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage' as any, handleCustomEvent);
    };
  }, [key, initialValue, deserializer, syncAcrossTabs]);

  return [storedValue, setValue, removeValue];
}

// Specialized hooks for common use cases

export function useUserPreferences() {
  const [preferences, setPreferences] = useLocalStorage('userPreferences', {
    theme: 'light',
    fontSize: 'medium',
    autoSave: true,
    notifications: true,
    difficulty: 'medium'
  });

  return { preferences, setPreferences };
}

export function useQuizHistory() {
  const [history, setHistory, clearHistory] = useLocalStorage<any[]>(
    'quizHistory',
    [],
    { syncAcrossTabs: true }
  );

  const addQuizResult = useCallback(
    (result: any) => {
      setHistory(prev => [result, ...prev].slice(0, 50)); // Keep last 50 results
    },
    [setHistory]
  );

  return {
    history,
    addQuizResult,
    clearHistory
  };
}

export function useProgressTracking() {
  const [progress, setProgress] = useLocalStorage('userProgress', {
    problemsSolved: 0,
    totalTime: 0,
    streak: 0,
    lastActive: null as string | null,
    achievements: [] as string[]
  });

  const updateProgress = useCallback(
    (updates: Partial<typeof progress>) => {
      setProgress(prev => ({ ...prev, ...updates }));
    },
    [setProgress]
  );

  return { progress, updateProgress };
}
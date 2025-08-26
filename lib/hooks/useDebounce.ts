import { useState, useEffect, useRef, useCallback } from 'react';

// Debounced value hook
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Debounced callback hook
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 500
): [T, () => void] {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const callbackRef = useRef(callback);

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  ) as T;

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [debouncedCallback, cancel];
}

// Debounced state hook with loading indicator
export function useDebouncedState<T>(
  initialValue: T,
  delay: number = 500
): {
  value: T;
  debouncedValue: T;
  setValue: (value: T) => void;
  isDebouncing: boolean;
} {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (value !== debouncedValue) {
      setIsDebouncing(true);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setDebouncedValue(value);
        setIsDebouncing(false);
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, debouncedValue, delay]);

  return {
    value,
    debouncedValue,
    setValue,
    isDebouncing
  };
}

// Debounced search hook
export function useDebouncedSearch(
  searchFunction: (query: string) => Promise<any[]>,
  delay: number = 300
) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const debouncedQuery = useDebounce(query, delay);

  useEffect(() => {
    if (debouncedQuery) {
      setIsSearching(true);
      setError(null);
      
      searchFunction(debouncedQuery)
        .then(setResults)
        .catch(setError)
        .finally(() => setIsSearching(false));
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [debouncedQuery, searchFunction]);

  return {
    query,
    setQuery,
    results,
    isSearching,
    error
  };
}
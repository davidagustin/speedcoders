import { useState, useCallback, useTransition } from 'react';

interface UseOptimisticOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error, previousValue: T) => void;
  revertOnError?: boolean;
}

export function useOptimistic<T>(
  initialValue: T,
  options: UseOptimisticOptions<T> = {}
) {
  const [isPending, startTransition] = useTransition();
  const [optimisticValue, setOptimisticValue] = useState(initialValue);
  const [actualValue, setActualValue] = useState(initialValue);
  const [error, setError] = useState<Error | null>(null);

  const updateOptimistic = useCallback(
    async (
      newValue: T | ((prev: T) => T),
      asyncUpdate: () => Promise<T>
    ) => {
      // Clear any previous errors
      setError(null);

      // Optimistically update the UI
      const updatedValue = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(optimisticValue)
        : newValue;
      
      setOptimisticValue(updatedValue);

      try {
        // Perform the actual async update
        const result = await asyncUpdate();
        
        startTransition(() => {
          setActualValue(result);
          setOptimisticValue(result);
        });

        options.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Update failed');
        setError(error);

        // Revert optimistic update if configured
        if (options.revertOnError !== false) {
          setOptimisticValue(actualValue);
        }

        options.onError?.(error, actualValue);
        throw error;
      }
    },
    [optimisticValue, actualValue, options, startTransition]
  );

  const reset = useCallback(() => {
    setOptimisticValue(initialValue);
    setActualValue(initialValue);
    setError(null);
  }, [initialValue]);

  return {
    value: optimisticValue,
    actualValue,
    updateOptimistic,
    isPending,
    error,
    reset,
    isStale: optimisticValue !== actualValue
  };
}

// Usage example for quiz submission
export function useOptimisticQuizSubmission() {
  const { value: submission, updateOptimistic, isPending } = useOptimistic(
    { submitted: false, score: 0 },
    {
      revertOnError: true,
      onError: (error) => {
        console.error('Quiz submission failed:', error);
      }
    }
  );

  const submitQuiz = useCallback(
    async (answers: any) => {
      return updateOptimistic(
        { submitted: true, score: 0 }, // Optimistic state
        async () => {
          // Actual API call
          const response = await fetch('/api/quiz/submit', {
            method: 'POST',
            body: JSON.stringify(answers)
          });
          
          if (!response.ok) throw new Error('Submission failed');
          return response.json();
        }
      );
    },
    [updateOptimistic]
  );

  return { submission, submitQuiz, isPending };
}
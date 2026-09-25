import { useCallback, useRef, useState } from 'react';

export default function useAsync(asyncFunction) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const runId = useRef(0);

  const execute = useCallback(async (...args) => {
    const id = ++runId.current;
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFunction(...args);
      if (id === runId.current) setLoading(false);
      return result;
    } catch (err) {
      if (id === runId.current) {
        setError(err);
        setLoading(false);
      }
      throw err;
    }
  }, [asyncFunction]);

  return { execute, loading, error };
}

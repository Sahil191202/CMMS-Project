// hooks/useFetch.js
// Generic GET hook. Refetches when `url` changes.
// Returns { data, loading, error, refetch }
//
// Usage:
//   const { data, loading, error, refetch } = useFetch(/assets');

import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../services/auth.api';

const useFetch = (url) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // Use a ref so the refetch function identity is stable
  const urlRef = useRef(url);
  useEffect(() => { urlRef.current = url; }, [url]);

  const fetch = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const { data: responseData } = await api.get(urlRef.current);
      setData(responseData);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to load data.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [url, fetch]);

  // refetch(true) = silent reload (no loading spinner, keeps current data visible)
  const refetch = useCallback((silent = false) => fetch(silent), [fetch]);

  return { data, loading, error, refetch };
};

export default useFetch;
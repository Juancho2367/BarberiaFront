import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../config/api';

interface UseApiOptions<T> {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  params?: any;
  dependencies?: any[];
  cacheTime?: number;
  enabled?: boolean;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  mutate: (newData: T) => void;
}

// Simple cache implementation
const cache = new Map<string, { data: any; timestamp: number }>();

export function useApi<T>({
  url,
  method = 'GET',
  body,
  params,
  dependencies = [],
  cacheTime = 5 * 60 * 1000, // 5 minutes
  enabled = true
}: UseApiOptions<T>): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const cacheKey = `${method}:${url}:${JSON.stringify(params)}`;

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      setData(cached.data);
      return;
    }

    setLoading(true);
    setError(null);

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const config: any = {
        signal: abortControllerRef.current.signal,
      };

      if (params) {
        config.params = params;
      }

      if (body && method !== 'GET') {
        config.data = body;
      }

      const response = await api.request({
        url,
        method,
        ...config,
      });

      setData(response.data);
      
      // Cache the response
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.response?.data?.message || 'Error en la solicitud');
      }
    } finally {
      setLoading(false);
    }
  }, [url, method, body, params, enabled, cacheKey, cacheTime]);

  const refetch = useCallback(async () => {
    // Clear cache for this key
    cache.delete(cacheKey);
    await fetchData();
  }, [fetchData, cacheKey]);

  const mutate = useCallback((newData: T) => {
    setData(newData);
    // Update cache
    cache.set(cacheKey, {
      data: newData,
      timestamp: Date.now(),
    });
  }, [cacheKey]);

  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, dependencies);

  return { data, loading, error, refetch, mutate };
}

// Hook for mutations (POST, PUT, DELETE)
export function useMutation<T, R = any>({
  url,
  method = 'POST',
}: {
  url: string;
  method?: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (data?: T): Promise<R | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.request({
        url,
        method,
        data,
      });

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error en la solicitud';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [url, method]);

  return { mutate, loading, error };
} 
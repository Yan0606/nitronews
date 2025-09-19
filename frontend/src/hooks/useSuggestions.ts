import { useState, useEffect, useRef } from 'react';
import { followAPI } from '../services/api';
import { User } from '../types';

interface UseSuggestionsReturn {
  suggestions: User[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Cache global para evitar múltiplas requisições
let suggestionsCache: User[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export const useSuggestions = (): UseSuggestionsReturn => {
  const [suggestions, setSuggestions] = useState<User[]>(suggestionsCache || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchSuggestions = async (forceRefresh = false) => {
    // Verificar cache se não for refresh forçado
    if (!forceRefresh && suggestionsCache && cacheTimestamp) {
      const now = Date.now();
      if (now - cacheTimestamp < CACHE_DURATION) {
        setSuggestions(suggestionsCache);
        return;
      }
    }

    if (loading) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await followAPI.getSuggestions();
      
      if (mountedRef.current) {
        const newSuggestions = response.data;
        setSuggestions(newSuggestions);
        
        // Atualizar cache
        suggestionsCache = newSuggestions;
        cacheTimestamp = Date.now();
      }
    } catch (err: any) {
      if (mountedRef.current) {
        setError(err.response?.data?.message || 'Erro ao carregar sugestões');
        console.error('Error fetching suggestions:', err);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  const refetch = () => {
    fetchSuggestions(true);
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  return {
    suggestions,
    loading,
    error,
    refetch
  };
};

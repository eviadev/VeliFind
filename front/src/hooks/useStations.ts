import { useCallback, useEffect, useState } from 'react';
import apiClient from '../lib/apiClient';
import type { Station, StationsResponse } from '../types/station';

const getErrorMessage = (error: unknown): string => {
  if (typeof window !== 'undefined' && window.navigator && !window.navigator.onLine) {
    return 'Vous semblez hors ligne. Vérifiez votre connexion et réessayez.';
  }

  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as { response?: { data?: { msg?: string; message?: string }; status?: number } }).response;

    if (response?.data?.msg) {
      return response.data.msg;
    }

    if (response?.data?.message) {
      return response.data.message;
    }
  }

  return 'Impossible de charger les données des stations. Réessayez dans un instant.';
};

export const useStations = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStations = useCallback(async () => {
    setIsLoading(true);

    try {
      const { data } = await apiClient.get<StationsResponse>('/stations');
      const nextStations = data?.data ?? [];
      console.debug('[useStations] fetched stations', {
        count: nextStations.length,
      });
      setStations(nextStations);
      setError(null);
    } catch (err) {
      console.error('[useStations] fetch failed', err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStations();
  }, [fetchStations]);

  return {
    stations,
    isLoading,
    error,
    refetch: fetchStations,
  };
};

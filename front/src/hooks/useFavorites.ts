import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'velifind-favorites';

type FavoriteIds = number[];

const readStoredFavorites = (): FavoriteIds => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue) as FavoriteIds;

    if (Array.isArray(parsed)) {
      return parsed.filter(id => Number.isFinite(id));
    }

    return [];
  } catch (error) {
    console.warn('Impossible de lire les favoris enregistrés', error);
    return [];
  }
};

const persistFavorites = (ids: FavoriteIds) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch (error) {
    console.warn('Impossible d\'enregistrer les favoris', error);
  }
};

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteIds>([]);

  useEffect(() => {
    setFavorites(readStoredFavorites());
  }, []);

  const toggleFavorite = useCallback((stationId: number | undefined) => {
    if (!stationId) {
      return;
    }

    setFavorites(prev => {
      const exists = prev.includes(stationId);
      const next = exists ? prev.filter(id => id !== stationId) : [...prev, stationId];

      persistFavorites(next);

      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (stationId: number | undefined) => {
      if (!stationId) {
        return false;
      }

      return favorites.includes(stationId);
    },
    [favorites],
  );

  const clearFavorites = useCallback(() => {
    persistFavorites([]);
    setFavorites([]);
  }, []);

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    clearFavorites,
  };
};

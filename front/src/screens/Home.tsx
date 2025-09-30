import type { FC } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { AlertMessage } from '../components/AlertMessage';
import { AppHeader } from '../components/AppHeader';
import { StationFilters, type StationFiltersState } from '../components/StationFilters';
import { StationMap } from '../components/StationMap';
import { useAuth } from '../Contexts/AuthContext';
import { useStations } from '../hooks/useStations';
import { useFavorites } from '../hooks/useFavorites';
import type { Station, StationWithLocation } from '../types/station';
import {
  hasBikesAvailable,
  hasDocksAvailable,
  hasElectricBikes,
  hasMechanicalBikes,
} from '../utils/stations';

const hasCoordinates = (station: Station): station is StationWithLocation =>
  typeof station.lat === 'number' &&
  Number.isFinite(station.lat) &&
  typeof station.lon === 'number' &&
  Number.isFinite(station.lon);

const createInitialFilters = (): StationFiltersState => ({
  searchTerm: '',
  minAvailableBikes: 0,
  onlyElectric: false,
  onlyMechanical: false,
  requireAvailableDocks: false,
  favoritesOnly: false,
});

export const Home: FC = () => {
  const { logout } = useAuth();
  const { stations, isLoading, error, refetch } = useStations();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [filters, setFilters] = useState<StationFiltersState>(() => createInitialFilters());

  const stationsWithLocation = useMemo(() => stations.filter(hasCoordinates), [stations]);

  const filteredStations = useMemo(() => {
    const normalizedQuery = filters.searchTerm.trim().toLowerCase();

    return stationsWithLocation.filter(station => {
      if (normalizedQuery.length > 0) {
        const candidate = `${station.name ?? ''} ${station.stationCode ?? ''}`.toLowerCase();
        if (!candidate.includes(normalizedQuery)) {
          return false;
        }
      }

      if (filters.favoritesOnly && !isFavorite(station.station_id)) {
        return false;
      }

      if (!hasBikesAvailable(station, filters.minAvailableBikes)) {
        return false;
      }

      if (filters.requireAvailableDocks && !hasDocksAvailable(station)) {
        return false;
      }

      if (filters.onlyElectric && !hasElectricBikes(station)) {
        return false;
      }

      if (filters.onlyMechanical && !hasMechanicalBikes(station)) {
        return false;
      }

      return true;
    });
  }, [filters, isFavorite, stationsWithLocation]);

  const handleSignOut = useCallback(() => {
    void logout();
  }, [logout]);

  const handleRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  const handleFiltersChange = useCallback((nextFilters: StationFiltersState) => {
    setFilters(nextFilters);
  }, []);

  const handleFiltersReset = useCallback(() => {
    setFilters(createInitialFilters());
  }, []);

  return (
    <div className="eco-app min-vh-100 d-flex flex-column">
      <AppHeader
        actions={
          <>
            <button className="btn btn-eco-ghost" onClick={handleRefresh} type="button">
              Actualiser les données
            </button>
            <button className="btn btn-eco-ghost" onClick={handleSignOut} type="button">
              Se déconnecter
            </button>
          </>
        }
      />

      <main className="flex-grow-1">
        <div className="container py-4 d-grid gap-4">
          {error && <AlertMessage className="mb-0">{error}</AlertMessage>}

          <div className="row g-4">
            <div className="col-12 col-lg-4">
              <StationFilters
                filters={filters}
                filteredStations={filteredStations.length}
                onChange={handleFiltersChange}
                onReset={handleFiltersReset}
                totalStations={stationsWithLocation.length}
              />
            </div>

            <div className="col-12 col-lg-8">
              <div className="eco-map-wrapper">
                <StationMap
                  favorites={favorites}
                  isLoading={isLoading}
                  onToggleFavorite={toggleFavorite}
                  stations={filteredStations}
                />
              </div>
              {!isLoading && filteredStations.length === 0 && (
                <p className="mt-3 text-muted text-center">
                  {"Aucun résultat pour votre recherche. Essayez d'assouplir vos filtres."}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

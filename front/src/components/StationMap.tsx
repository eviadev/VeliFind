import type { FC, MouseEvent } from 'react';
import { useCallback, useMemo, useState } from 'react';
import maplibregl from 'maplibre-gl';
import type { LngLatBoundsLike, Map as MapLibreMap } from 'maplibre-gl';
import Map, { FullscreenControl, Marker, NavigationControl, Popup } from 'react-map-gl/maplibre';
import type { MapLib } from 'react-map-gl/maplibre';
import type { StationWithLocation } from '../types/station';
import {
  getAvailableBikes,
  getAvailableDocks,
  getBikeBreakdown,
} from '../utils/stations';

const DEFAULT_CENTER: [number, number] = [48.8566, 2.3522];
const DEFAULT_ZOOM = 12;
const MAP_STYLE_URL = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

const mapLibreLib = maplibregl as unknown as MapLib<MapLibreMap>;

type StationMapProps = {
  stations: StationWithLocation[];
  isLoading: boolean;
  center?: [number, number];
  zoom?: number;
  favorites?: number[];
  onToggleFavorite?: (stationId: number | undefined) => void;
};

const formatStationKey = (station: StationWithLocation, index: number) =>
  (station.station_id ?? station._id ?? station.name ?? `station-${index}`).toString();

export const StationMap: FC<StationMapProps> = ({
  stations,
  isLoading,
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  favorites,
  onToggleFavorite,
}) => {
  const [activeStationId, setActiveStationId] = useState<string | null>(null);
  const favoriteIds = useMemo(() => new Set(favorites ?? []), [favorites]);

  const mapBounds = useMemo<LngLatBoundsLike | null>(() => {
    if (stations.length === 0) {
      return null;
    }

    let minLat = Number.POSITIVE_INFINITY;
    let maxLat = Number.NEGATIVE_INFINITY;
    let minLon = Number.POSITIVE_INFINITY;
    let maxLon = Number.NEGATIVE_INFINITY;

    stations.forEach(station => {
      minLat = Math.min(minLat, station.lat);
      maxLat = Math.max(maxLat, station.lat);
      minLon = Math.min(minLon, station.lon);
      maxLon = Math.max(maxLon, station.lon);
    });

    const centerLat = center[0];
    const centerLon = center[1];

    minLat = Math.min(minLat, centerLat);
    maxLat = Math.max(maxLat, centerLat);
    minLon = Math.min(minLon, centerLon);
    maxLon = Math.max(maxLon, centerLon);

    const latPadding = Math.max((maxLat - minLat) * 0.05, 0.01);
    const lonPadding = Math.max((maxLon - minLon) * 0.05, 0.01);

    return [
      [minLon - lonPadding, minLat - latPadding],
      [maxLon + lonPadding, maxLat + latPadding],
    ];
  }, [stations, center]);

  const initialViewState = useMemo(
    () => ({
      latitude: center[0],
      longitude: center[1],
      zoom,
      ...(mapBounds
        ? {
            bounds: mapBounds,
            fitBoundsOptions: {
              padding: 72,
              maxZoom: zoom,
            },
          }
        : {}),
    }),
    [center, zoom, mapBounds],
  );

  const handleMarkerClick = useCallback((stationId: string) => {
    setActiveStationId(stationId);
  }, []);

  const handlePopupClose = useCallback(() => {
    setActiveStationId(null);
  }, []);

  const activeStation = useMemo(() => {
    if (!activeStationId) {
      return null;
    }

    return stations.find((station, index) => formatStationKey(station, index) === activeStationId) ?? null;
  }, [activeStationId, stations]);

  const totalBikes = useMemo(() => {
    return stations.reduce((acc, station) => acc + getAvailableBikes(station), 0);
  }, [stations]);

  const activeBreakdown = useMemo(() => {
    if (!activeStation) {
      return null;
    }

    return getBikeBreakdown(activeStation);
  }, [activeStation]);

  const handleFavoriteClick = useCallback(() => {
    if (!onToggleFavorite || !activeStation) {
      return;
    }

    onToggleFavorite(activeStation.station_id);
  }, [activeStation, onToggleFavorite]);

  if (isLoading) {
    return (
      <div
        className="d-flex h-100 align-items-center justify-content-center"
        style={{ minHeight: '480px' }}
      >
        <div className="spinner-border text-eco" role="status">
          <span className="visually-hidden">Chargement de la carte...</span>
        </div>
      </div>
    );
  }

  return (
    <Map
      initialViewState={initialViewState}
      mapLib={mapLibreLib}
      mapStyle={MAP_STYLE_URL}
      scrollZoom
      style={{ width: '100%', height: '100%' }}
    >
      <NavigationControl position="top-left" />
      <FullscreenControl position="top-left" />

      <div className="eco-map-overlay">
        <span>{stations.length} station{stations.length > 1 ? 's' : ''}</span>
        <span>{totalBikes} vélos disponibles</span>
      </div>

      {stations.map((station, index) => {
        const key = formatStationKey(station, index);
        const bikes = getAvailableBikes(station);
        const isFavorite = favoriteIds.has(station.station_id ?? -1);
        const markerClassNames = [
          'eco-marker',
          bikes === 0 ? 'eco-marker--empty' : bikes <= 3 ? 'eco-marker--low' : 'eco-marker--ok',
        ];

        if (isFavorite) {
          markerClassNames.push('eco-marker--favorite');
        }

        return (
          <Marker
            key={key}
            latitude={station.lat}
            longitude={station.lon}
            anchor="bottom"
            onClick={() => handleMarkerClick(key)}
          >
            <button
              className={markerClassNames.join(' ')}
              onClick={(event: MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation();
                handleMarkerClick(key);
              }}
              title={`Station ${station.name ?? key}`}
              type="button"
            >
              <span className="eco-marker__count">{bikes}</span>
              <span className="visually-hidden">
                Station {station.name ?? key}, {bikes} vélos disponibles
              </span>
            </button>
          </Marker>
        );
      })}

      {activeStation && (
        <Popup
          anchor="top"
          latitude={activeStation.lat}
          longitude={activeStation.lon}
          onClose={handlePopupClose}
          closeOnClick={false}
        >
          <div className="eco-popup">
            <h3 className="eco-popup__title">{activeStation.name ?? 'Station sans nom'}</h3>
            <p className="eco-popup__subtitle mb-2">Capacité totale : {activeStation.capacity ?? '—'}</p>
            <ul className="eco-popup__metrics list-unstyled mb-3">
              <li>
                <strong>{getAvailableBikes(activeStation)}</strong> vélos disponibles
              </li>
              {activeBreakdown && (
                <>
                  <li>
                    <strong>{activeBreakdown.mechanical}</strong> mécaniques
                  </li>
                  <li>
                    <strong>{activeBreakdown.ebike}</strong> électriques
                  </li>
                </>
              )}
              <li>
                <strong>{getAvailableDocks(activeStation)}</strong> bornes libres
              </li>
            </ul>
            {onToggleFavorite && (
              <button className="btn btn-eco w-100" onClick={handleFavoriteClick} type="button">
                {favoriteIds.has(activeStation.station_id ?? -1) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              </button>
            )}
          </div>
        </Popup>
      )}
    </Map>
  );
};

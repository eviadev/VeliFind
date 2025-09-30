import type { Station } from '../types/station';

const toValidCount = (value: number | undefined): number => {
  if (typeof value !== 'number') {
    return 0;
  }

  return Number.isFinite(value) ? value : 0;
};

export const getAvailableBikes = (station: Station): number => {
  return toValidCount(station.num_bikes_available ?? station.numBikesAvailable);
};

export const getAvailableDocks = (station: Station): number => {
  return toValidCount(station.num_docks_available ?? station.numDocksAvailable);
};

export type BikeBreakdown = {
  mechanical: number;
  ebike: number;
};

export const getBikeBreakdown = (station: Station): BikeBreakdown => {
  const { num_bikes_available_types: rawBreakdown } = station;

  if (!rawBreakdown) {
    return { mechanical: 0, ebike: 0 };
  }

  const entries = Array.isArray(rawBreakdown) ? rawBreakdown : [rawBreakdown];

  return entries.reduce<BikeBreakdown>(
    (acc, entry) => ({
      mechanical: acc.mechanical + toValidCount(entry?.mechanical),
      ebike: acc.ebike + toValidCount(entry?.ebike),
    }),
    { mechanical: 0, ebike: 0 },
  );
};

export const hasElectricBikes = (station: Station): boolean => {
  return getBikeBreakdown(station).ebike > 0;
};

export const hasMechanicalBikes = (station: Station): boolean => {
  return getBikeBreakdown(station).mechanical > 0;
};

export const hasBikesAvailable = (station: Station, minimum = 1): boolean => {
  return getAvailableBikes(station) >= minimum;
};

export const hasDocksAvailable = (station: Station): boolean => {
  return getAvailableDocks(station) > 0;
};

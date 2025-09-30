export type BikeAvailability = {
  mechanical?: number;
  ebike?: number;
};

export type Station = {
  _id?: string;
  stationCode?: string;
  station_id?: number;
  name?: string;
  capacity?: number;
  lat?: number;
  lon?: number;
  num_bikes_available?: number;
  numBikesAvailable?: number;
  num_bikes_available_types?: BikeAvailability | BikeAvailability[];
  num_docks_available?: number;
  numDocksAvailable?: number;
  is_installed?: number;
  is_returning?: number;
  is_renting?: number;
  last_reported?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type StationWithLocation = Station & Required<Pick<Station, 'lat' | 'lon'>>;

export type StationsResponse = {
  data: Station[];
  message: string;
};

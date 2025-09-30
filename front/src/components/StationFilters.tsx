import type { ChangeEvent, FC } from 'react';

export type StationFiltersState = {
  searchTerm: string;
  minAvailableBikes: number;
  onlyElectric: boolean;
  onlyMechanical: boolean;
  requireAvailableDocks: boolean;
  favoritesOnly: boolean;
};

type StationFiltersProps = {
  filters: StationFiltersState;
  onChange: (next: StationFiltersState) => void;
  onReset: () => void;
  totalStations: number;
  filteredStations: number;
};

const updateBoolean = (
  filters: StationFiltersState,
  field: keyof StationFiltersState,
  checked: boolean,
): StationFiltersState => ({
  ...filters,
  [field]: checked,
});

export const StationFilters: FC<StationFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalStations,
  filteredStations,
}) => {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, searchTerm: event.target.value });
  };

  const handleMinAvailableChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = Number.parseInt(event.target.value, 10);
    const minAvailableBikes = Number.isNaN(rawValue) ? 0 : Math.max(0, rawValue);
    onChange({ ...filters, minAvailableBikes });
  };

  const handleToggle = (field: keyof StationFiltersState) => (event: ChangeEvent<HTMLInputElement>) => {
    onChange(updateBoolean(filters, field, event.target.checked));
  };

  return (
    <section className="eco-panel">
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h2 className="h5 mb-1 text-eco-dark">Votre recherche</h2>
          <p className="text-muted mb-0">
            {filteredStations} station{filteredStations > 1 ? 's' : ''} affichée{filteredStations > 1 ? 's' : ''} sur {totalStations}
          </p>
        </div>
        <button className="btn btn-outline-eco" onClick={onReset} type="button">
          Réinitialiser
        </button>
      </div>

      <div className="d-grid gap-4">
        <div>
          <label className="form-label text-eco-dark" htmlFor="search-term">
            Rechercher une station
          </label>
          <input
            className="form-control"
            id="search-term"
            onChange={handleSearchChange}
            placeholder="Nom ou code station"
            type="search"
            value={filters.searchTerm}
          />
        </div>

        <div className="d-grid gap-2">
          <label className="form-label text-eco-dark" htmlFor="min-bikes">
            Minimum de vélos disponibles
          </label>
          <input
            className="form-control"
            id="min-bikes"
            min={0}
            onChange={handleMinAvailableChange}
            type="number"
            value={filters.minAvailableBikes}
          />
        </div>

        <fieldset className="eco-filters-group">
          <legend className="eco-filters-legend">Types de vélos</legend>
          <div className="form-check">
            <input
              checked={filters.onlyMechanical}
              className="form-check-input"
              id="only-mechanical"
              onChange={handleToggle('onlyMechanical')}
              type="checkbox"
            />
            <label className="form-check-label" htmlFor="only-mechanical">
              Uniquement des vélos mécaniques disponibles
            </label>
          </div>
          <div className="form-check">
            <input
              checked={filters.onlyElectric}
              className="form-check-input"
              id="only-electric"
              onChange={handleToggle('onlyElectric')}
              type="checkbox"
            />
            <label className="form-check-label" htmlFor="only-electric">
              Uniquement des vélos électriques disponibles
            </label>
          </div>
        </fieldset>

        <fieldset className="eco-filters-group">
          <legend className="eco-filters-legend">Disponibilités</legend>
          <div className="form-check">
            <input
              checked={filters.requireAvailableDocks}
              className="form-check-input"
              id="require-docks"
              onChange={handleToggle('requireAvailableDocks')}
              type="checkbox"
            />
            <label className="form-check-label" htmlFor="require-docks">
              Avec bornes libres pour restituer un vélo
            </label>
          </div>
          <div className="form-check">
            <input
              checked={filters.favoritesOnly}
              className="form-check-input"
              id="favorites-only"
              onChange={handleToggle('favoritesOnly')}
              type="checkbox"
            />
            <label className="form-check-label" htmlFor="favorites-only">
              Stations favorites uniquement
            </label>
          </div>
        </fieldset>
      </div>
    </section>
  );
};

import type { FC, ReactNode } from 'react';

export type AppHeaderProps = {
  actions?: ReactNode;
  subtitle?: string;
};

export const AppHeader: FC<AppHeaderProps> = ({ actions, subtitle }) => {
  return (
    <header className="eco-header shadow-sm">
      <div className="container py-3">
        <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
          <div>
            <div className="eco-header__brand" aria-label="VeliFind">
              <span aria-hidden="true" className="eco-header__leaf" />
              <span className="eco-header__title">VeliFind</span>
            </div>
            <p className="eco-header__subtitle mb-0">
              {subtitle ?? "Trouver un Vélib' disponible en un clin d'œil à Paris"}
            </p>
          </div>
          {actions && <div className="d-flex flex-wrap gap-2 justify-content-start justify-content-lg-end">{actions}</div>}
        </div>
      </div>
    </header>
  );
};

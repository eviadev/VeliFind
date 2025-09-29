import type { FC } from 'react';
import { useAuth } from '../Contexts/AuthContext';

export const Home: FC = () => {
  const { logout } = useAuth();

  const handleSignOut = () => {
    void logout();
  };

  return (
    <div className="bg-light min-vh-100">
      <header className="bg-primary text-white">
        <nav className="container d-flex align-items-center justify-content-between py-3">
          <span className="fs-4 fw-semibold">VeliFind</span>
          <button className="btn btn-outline-light" onClick={handleSignOut} type="button">
            Sign out
          </button>
        </nav>
      </header>
      <main className="container py-5">
        <section className="py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h1 className="display-5 fw-bold mb-4">Bikes for everyone</h1>
              <p className="lead">
                Launched in 2007, Vélib&apos; Métropole is a pioneer of bike-sharing services in the world.
              </p>
              <p className="lead">
                VeliFind keeps station availability at your fingertips so you can plan the next ride with confidence.
              </p>
            </div>
            <div className="col-lg-5 offset-lg-1">
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <h2 className="h5 mb-3">What&apos;s next?</h2>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">• Search for the nearest station</li>
                    <li className="mb-2">• Filter by bike type or capacity</li>
                    <li className="mb-2">• Bookmark favourites for quick access</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

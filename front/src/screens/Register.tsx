import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import { useAuth } from '../Contexts/AuthContext';

export const Register: FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await register(email, password);

    if (result.success) {
      navigate('/');
      return;
    }

    setError(!result.success && 'message' in result ? result.message : 'Une erreur est survenue.');
    setIsSubmitting(false);
  };

  return (
    <div className="eco-app min-vh-100 d-flex flex-column">
      <AppHeader subtitle="Créez votre accès à la mobilité douce" />
      <main className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
        <div className="eco-panel eco-panel--auth w-100" style={{ maxWidth: '420px' }}>
          <h1 className="h3 fw-semibold text-center mb-4">Créez votre compte</h1>
          <form className="d-grid gap-3" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="form-label text-eco-dark" htmlFor="email">
                Adresse e-mail
              </label>
              <input
                autoComplete="email"
                className="form-control"
                id="email"
                onChange={event => setEmail(event.target.value)}
                placeholder="vous@example.com"
                required
                type="email"
                value={email}
              />
            </div>
            <div>
              <label className="form-label text-eco-dark" htmlFor="password">
                Mot de passe
              </label>
              <input
                autoComplete="new-password"
                className="form-control"
                id="password"
                minLength={6}
                onChange={event => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </div>
            {error && <div className="alert alert-danger mb-0">{error}</div>}
            <button className="btn btn-eco w-100" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Création du compte…' : 'Créer un compte'}
            </button>
          </form>
          <p className="text-center mt-3 mb-0">
            Vous avez déjà un compte ? <Link to="/login">Connectez-vous</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

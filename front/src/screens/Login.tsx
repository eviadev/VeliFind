import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';

export const Login: FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await login(email, password);

    if (result.success) {
      navigate('/');
      return;
    }

    setError(result.message);
    setIsSubmitting(false);
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-sm p-4" style={{ maxWidth: '420px', width: '100%' }}>
        <h1 className="h3 fw-semibold text-center mb-4">Sign in to VeliFind</h1>
        <form className="d-grid gap-3" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="form-label" htmlFor="email">
              Email address
            </label>
            <input
              autoComplete="email"
              className="form-control"
              id="email"
              onChange={event => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              type="email"
              value={email}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              autoComplete="current-password"
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
          <button className="btn btn-primary w-100" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="text-center mt-3 mb-0">
          No account yet? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

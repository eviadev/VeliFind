import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

    setError(result.message);
    setIsSubmitting(false);
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-sm p-4" style={{ maxWidth: '420px', width: '100%' }}>
        <h1 className="h3 fw-semibold text-center mb-4">Create your account</h1>
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
          <button className="btn btn-success w-100" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="text-center mt-3 mb-0">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

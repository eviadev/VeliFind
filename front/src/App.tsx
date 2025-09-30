import type { FC, ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './Contexts/AuthContext';
import { Home } from './screens/Home';
import { Login } from './screens/Login';
import { Register } from './screens/Register';

const ProtectedRoute: FC<{ children: ReactElement }> = ({ children }) => {
  const { authState } = useAuth();

  if (!authState.authenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicOnlyRoute: FC<{ children: ReactElement }> = ({ children }) => {
  const { authState } = useAuth();

  if (authState.authenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const LoadingState: FC = () => {
  return (
    <div className="d-flex vh-100 justify-content-center align-items-center">
      <div className="text-center">
        <div className="spinner-border text-eco mb-3" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="text-eco-dark">Préparation de votre expérience...</p>
      </div>
    </div>
  );
};

const App: FC = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;

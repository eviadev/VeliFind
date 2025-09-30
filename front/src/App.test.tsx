import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './Contexts/AuthContext';

describe('App routing', () => {
  it('shows the login screen by default', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>,
    );

    const heading = await screen.findByRole('heading', { name: /connectez-vous à velifind/i });
    expect(heading).toBeInTheDocument();
  });
});

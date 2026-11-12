import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, vi, expect } from 'vitest';
import Login from '../pages/Login';
import { AuthContext } from '../context/AuthContext';

const mockLogin = vi.fn(() => Promise.resolve({ success: true }));

function renderLogin() {
  return render(
    <AuthContext.Provider value={{ login: mockLogin, loading: false }}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe('Login', () => {
  it('renders username and password fields', () => {
    renderLogin();
    expect(screen.getByLabelText(/username/i)).toBeTruthy();
    expect(screen.getByLabelText(/password/i)).toBeTruthy();
  });

  it('calls login on form submit', async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'secret' } });
    // Button text is "Sign In"
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(mockLogin).toHaveBeenCalledWith('admin', 'secret');
  });
});

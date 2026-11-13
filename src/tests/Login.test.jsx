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
  it('renders email and password fields', () => {
    renderLogin();
    expect(screen.getByLabelText(/email address/i)).toBeTruthy();
    expect(screen.getByLabelText(/^password/i)).toBeTruthy();
  });

  it('calls login with email on form submit', async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'officer@toms.gov.ng' },
    });
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: 'securepassword123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(mockLogin).toHaveBeenCalledWith('officer@toms.gov.ng', 'securepassword123');
  });
});

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Dashboard from '../pages/Dashboard';
import { AuthContext } from '../context/AuthContext';

function renderDashboard(user = { name: 'Test Officer' }) {
  return render(
    <AuthContext.Provider value={{ user }}>
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe('Dashboard', () => {
  it('shows welcome message with user name', () => {
    renderDashboard();
    // Text is split across nodes ("Welcome back, " + user name), use a function matcher
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading.textContent).toMatch(/welcome back.*test officer/i);
  });

  it('renders stat cards', () => {
    renderDashboard();
    expect(screen.getByText(/total incidents/i)).toBeTruthy();
    expect(screen.getByText(/open cases/i)).toBeTruthy();
    expect(screen.getByText(/resolved/i)).toBeTruthy();
    expect(screen.getByText(/pending review/i)).toBeTruthy();
  });
});

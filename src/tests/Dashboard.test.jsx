import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Dashboard from '../pages/Dashboard';
import { AuthContext } from '../context/AuthContext';

function renderDashboard(user = { full_name: 'Test Officer' }) {
  return render(
    <AuthContext.Provider value={{ user }}>
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe('Dashboard', () => {
  it('shows welcome message with officer full name', () => {
    renderDashboard();
    expect(screen.getByText(/Test Officer/i)).toBeTruthy();
  });

  it('renders stat cards matching TOMS specification', () => {
    renderDashboard();
    expect(screen.getByText(/total incidents/i)).toBeTruthy();
    expect(screen.getByText(/today's activity/i)).toBeTruthy();
  });
});

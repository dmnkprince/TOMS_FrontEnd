import os, sys

ROOT = r"d:\xamp\htdocs\3MTMedify\3mtt\TOMS_FrontEnd\src"

files = {}

files["tests/Login.test.jsx"] = """\
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
"""

files["tests/Dashboard.test.jsx"] = """\
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
"""

for rel, content in files.items():
    full = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Written: {rel}")

print("Test files fixed.")

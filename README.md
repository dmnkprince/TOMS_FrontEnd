# Traffic Offence Management System (TOMS) — Frontend

Progressive Web Application (PWA) for field enforcement officers, supervisors, and administrators.

## Features
- **Field Incident Registration:** Record traffic violations with multi-offence selection, automatic penalty calculation, and location logging.
- **Offline-First & PWA:** Full offline capability with service workers and IndexedDB / LocalStorage queueing for field officers with intermittent connectivity.
- **Incident Records & Search:** Filter by date, state, offence, and vehicle plate; view incident details, edit records, and print citation notices.
- **Role-Based Access Control:** Separate portals and permissions for `field_agent`, `agent`, `supervisor`, and `admin`.
- **Reports & Export:** Excel and CSV export generation for analytics and enforcement audits.

## Tech Stack
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS + Lucide React icons
- **Routing:** React Router v7
- **PWA:** Vite PWA Plugin with custom service worker

## Getting Started
```bash
# Install dependencies
npm install

# Start local dev server
npm run dev

# Build for production
npm run build
```

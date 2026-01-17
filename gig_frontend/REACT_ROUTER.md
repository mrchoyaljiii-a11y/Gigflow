React Router setup

- Installed: `react-router-dom`.
- Wrapped the app with `<BrowserRouter>` in `src/main.jsx`.
- Added routes in `src/App.jsx`:
  - `/` → `Home` (contains the counter demo using Redux Toolkit)
  - `/about` → `About`
- Added simple navigation with `Link` elements in the top nav.

To verify: run `npm run dev` and visit http://localhost:5173 — navigate between Home and About.

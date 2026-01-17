Redux Toolkit setup

- Installed runtime dependencies: `@reduxjs/toolkit` and `react-redux`.
- Added `src/redux/store.js` which configures the store with `configureStore`.
- Added a sample slice `src/redux/slices/counterSlice.js` with actions: `increment`, `decrement`, and `incrementByAmount`.
- Wrapped the app with the Redux `<Provider>` in `src/main.jsx` and added a small counter UI in `src/App.jsx` demonstrating use of `useSelector` and `useDispatch`.

To run and verify:
1. npm run dev
2. Open http://localhost:5173 and use the +, -, +5 buttons to change the counter value.

# PerShift

**Status: In progress (actively being built)**

PerShift is a cross-platform workforce scheduling app for small businesses like restaurants. Managers create schedules and teams, and employees see their shifts in real time on iOS and Android.

## Features

- User sign-up and authentication
- Business creation and employee invitations
- Shift scheduling and team management
- Real-time updates when schedules change
- Offline caching with SQLite

## Tech stack

- React Native + Expo (iOS and Android)
- TypeScript
- Supabase (Postgres, Auth, Realtime)
- SQLite for local caching

## Architecture

The app follows Clean Architecture, so business logic stays independent of the UI and the backend:

- `entity`: core business objects (users, businesses, shifts)
- `usecase`: application logic (20+ use cases, e.g. sign up, create business, invite employee, schedule shift)
- `interface-adapter`: presenters and controllers that connect use cases to the UI
- `data-access`: Supabase and SQLite implementations of the data interfaces
- `realtime`: real-time subscriptions for live schedule updates
- `view`: React Native screens and components
- `app`: Expo Router file-based navigation

## Running locally

```bash
npm install
cp .env.example .env   # then add your own Supabase project URL and publishable key
npx expo start
```

## License

MIT

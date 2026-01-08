# BarberQueue Frontend

Mobile application built with Expo and React Native for the BarberQueue booking platform.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Expo SDK 54, React Native 0.81 |
| Language | TypeScript |
| Styling | NativeWind (Tailwind CSS) |
| State Management | Zustand |
| Data Fetching | React Query (TanStack Query) |
| Forms | React Hook Form + Zod |
| Navigation | Expo Router |
| Monitoring | Sentry |

## Project Structure

```
frontend/
├── app/                    # Screens (Expo Router file-based routing)
│   ├── (auth)/             # Authentication screens
│   ├── (client)/           # Client-facing screens
│   └── (owner)/            # Owner dashboard screens
├── src/
│   ├── api/                # API client and endpoint functions
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── stores/             # Zustand state stores
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── i18n/               # Internationalization (vi/en)
├── assets/                 # Images, fonts, icons
└── constants/              # App constants and config
```

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (macOS) or Android Emulator

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

For physical device testing, use your machine's IP:
```env
EXPO_PUBLIC_API_URL=http://192.168.x.x:3000
```

### 3. Start Development Server

```bash
npm start
```

Then press:
- `i` for iOS Simulator
- `a` for Android Emulator
- Scan QR code with Expo Go app for physical device

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo development server |
| `npm run android` | Run on Android |
| `npm run ios` | Run on iOS |
| `npm run web` | Run on web browser |
| `npm test` | Run Jest tests |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Run ESLint |

## Testing

Jest is configured with `jest-expo` preset.

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

Coverage target: **70%** on core modules (api, stores, utils, hooks).

Coverage report generated at `coverage/lcov-report/index.html`.

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `expo-router` | File-based routing |
| `zustand` | Lightweight state management |
| `@tanstack/react-query` | Server state and caching |
| `react-hook-form` | Form handling |
| `zod` | Schema validation |
| `nativewind` | Tailwind CSS for React Native |
| `expo-secure-store` | Secure token storage |
| `expo-location` | Location services |
| `@sentry/react-native` | Error tracking |

## Build

### Development Build

```bash
npx expo prebuild
npx expo run:ios
npx expo run:android
```

### Production Build (EAS)

```bash
npx eas build --platform ios
npx eas build --platform android
```

## Project Conventions

- **Components**: PascalCase (`BookingCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useLocation.ts`)
- **Stores**: kebab-case (`auth-store.ts`)
- **API**: kebab-case (`bookings.ts`)
- **Types**: PascalCase interfaces in `types/`

## Related

- [Main README](../README.md)
- [Backend README](../backend/README.md)

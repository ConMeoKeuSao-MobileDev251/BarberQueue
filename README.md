# BarberQueue

BarberQueue is a mobile application connecting customers with barber shops, digitizing the traditional booking process (phone calls, walk-ins) into a seamless mobile experience. Built for the Vietnamese market.

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Expo SDK 54, React Native, TypeScript, NativeWind |
| **Backend** | NestJS 11, Prisma ORM, PostgreSQL |
| **Auth** | JWT, bcrypt |
| **State** | Zustand, React Query |

## Project Structure

```
BarberQueue/
├── frontend/          # Expo mobile app
│   ├── app/           # Screens (Expo Router)
│   └── src/           # Components, hooks, stores, API
├── backend/           # NestJS REST API
│   ├── src/           # Modules, controllers, services
│   └── prisma/        # Database schema
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator / Android Emulator (for mobile)

### 1. Clone Repository

```bash
git clone <repository-url>
cd BarberQueue
```

### 2. Setup Backend

```bash
cd backend
npm install
cp .example.env .env
# Edit .env with your database credentials
npx prisma migrate dev
npm run start:dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with API URL
npm start
```

## Documentation

- [Frontend README](./frontend/README.md) - Mobile app setup and development
- [Backend README](./backend/README.md) - API setup and endpoints

## API Documentation

When backend is running, Swagger UI is available at:
```
http://localhost:3000/api
```

## License

Private - All rights reserved

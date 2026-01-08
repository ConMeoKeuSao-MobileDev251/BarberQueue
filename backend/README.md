# BarberQueue Backend

REST API server built with NestJS for the BarberQueue booking platform.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | NestJS 11 |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT, Passport |
| Documentation | Swagger |
| Containerization | Docker |

## Project Structure

```
backend/
├── src/
│   ├── auth/               # Authentication module
│   ├── user/               # User management
│   ├── branch/             # Branch/shop management
│   ├── booking/            # Booking system
│   ├── booking_service/    # Booking-service relations
│   ├── barber_service/     # Services offered
│   ├── review/             # Review system
│   ├── notification/       # Notifications
│   ├── favorite/           # User favorites
│   ├── address/            # Address management
│   ├── prisma/             # Database service
│   ├── decorators/         # Custom decorators
│   ├── dtos/               # Data transfer objects
│   ├── enums/              # Enumerations
│   └── middleware/         # Custom middleware
├── prisma/
│   └── schema.prisma       # Database schema
├── test/                   # E2E tests
└── docker-compose.yml      # Docker configuration
```

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .example.env .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/barberqueue
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=24h
SALT_ROUNDS=10
PORT=3000
```

### 3. Setup Database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed
```

### 4. Start Development Server

```bash
npm run start:dev
```

Server runs at `http://localhost:3000`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start` | Start server |
| `npm run start:dev` | Start with hot reload |
| `npm run start:prod` | Start production build |
| `npm run build` | Build for production |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run E2E tests |
| `npm run test:cov` | Run tests with coverage |
| `npm run lint` | Run ESLint |

## API Documentation

Swagger UI available at:
```
http://localhost:3000/api
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | User login |
| POST | `/auth/register/client` | Register client |
| POST | `/auth/register/staff-or-owner` | Register staff/owner |
| GET | `/auth/me` | Get current user |
| POST | `/auth/logout` | Logout |

### Branches
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/branch` | Search branches by location |
| POST | `/branch` | Create branch (owner) |
| DELETE | `/branch/:id` | Delete branch |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/booking` | Create booking |
| GET | `/booking/:id` | Get booking details |
| GET | `/booking/history/:clientId` | Get booking history |
| PATCH | `/booking/:id/status` | Update booking status |

### Services
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/barber-services` | List all services |
| GET | `/barber-services/:id` | Get service details |
| POST | `/barber-services` | Create service (owner) |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/:id` | Get user profile |
| PUT | `/users/:id` | Update user |
| GET | `/users/staff/:branchId/availability` | Get available staff |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/review` | Create review |
| GET | `/review/branch/:branchId` | Get branch reviews |

### Favorites
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/favorite/branch/:branchId` | Add to favorites |
| GET | `/favorite/user` | Get user favorites |
| DELETE | `/favorite/branch/:branchId` | Remove from favorites |

## Database Schema

Key models:
- **User**: Clients, Staff, Owners
- **Branch**: Barber shop locations
- **Booking**: Appointments
- **BarberService**: Available services
- **Review**: Customer reviews
- **Notification**: Push notifications

## Docker

### Build and Run

```bash
docker-compose up -d
```

### With PostgreSQL

Uncomment PostgreSQL service in `docker-compose.yml` for local database:

```yaml
services:
  backend:
    # ...
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: barberqueue
    ports:
      - "5432:5432"
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:cov
```

## Related

- [Main README](../README.md)
- [Frontend README](../frontend/README.md)

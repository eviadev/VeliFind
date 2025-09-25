# VeliFind

VeliFind is a full-stack Velib companion that helps riders check bike availability across Paris. The project combines a REST API (Node.js/Express/MongoDB/Redis) with a React Native Web client so users can register, authenticate, and browse stations from any browser.

## Features
- Email/password authentication with token-based sessions
- Periodic ingestion of Velib open data to refresh station availability
- Search, filter, and pagination helpers to quickly find the right dock
- Shared TypeScript domain models between API and client
- React Native Web UI that also targets iOS/Android with the same components

## Architecture Overview
```
.
├── back/        # Express API, job runners, queue workers
│   ├── src/
│   │   ├── modules/   # Domain modules (auth, users, stations)
│   │   ├── services/  # Business logic (Mongo, Redis, external APIs)
│   │   ├── routes/    # Express routers
│   │   ├── controllers/
│   │   ├── utils/
│   │   └── tests/     # Jest controller tests
│   └── docker-compose.yml  # Mongo + Redis stack for local dev
└── front/       # React Native Web application
    ├── src/
    │   ├── screens/   # Login, Register, Home, etc.
    │   ├── Contexts/  # Auth context + persistence
    │   ├── navigators/
    │   └── types/
    └── public/
```

## Prerequisites
- Node.js 18+
- Yarn 1.x (classic)
- MongoDB 4.4+ and Redis 6+ running locally
- (Optional) Docker Desktop if you prefer to run services via `docker-compose`

## Getting Started

### 1. Environment variables
Create `back/.env.development.local` with:
```
NODE_ENV=development
PORT=3001
DB_HOST=127.0.0.1
DB_PORT=27017
DB_DATABASE=velifind-dev
SECRET_KEY=change-me
LOG_FORMAT=combined
LOG_DIR=./logs
ORIGIN=http://localhost:3006
REDIS_URL=redis://127.0.0.1:6379
```

If you plan to run the frontend on a different origin, update `ORIGIN` and mirror it in `front/.env.local`:
```
REACT_APP_BACKEND_URL=http://localhost:3001
```

### 2. Supporting services
- Local installs: start MongoDB (`mongod`) and Redis (`redis-server`).
- Docker alternative (from `back/`):
```
docker-compose up -d
```
This launches MongoDB and Redis containers with default credentials.

### 3. Install dependencies
```
yarn --cwd back install
yarn --cwd front install
```

### 4. Run the backend
```
NODE_ENV=development yarn --cwd back dev
```
- Serves the API at `http://localhost:3001`
- Automatically restarts via Nodemon
- Generates compiled output in `back/dist/` when you run `yarn --cwd back build`

### 5. Run the frontend
```
PORT=3006 yarn --cwd front web
```
- Opens the React Native Web app on `http://localhost:3006`
- Reuses the Auth context to call the backend login/signup endpoints
- Native builds remain available through `yarn --cwd front ios` / `android`

## Quality Assurance
| Command | Description |
|---------|-------------|
| `yarn --cwd back test` | Runs Jest controller tests against mocked services |
| `CI=true yarn --cwd front test --watchAll=false` | Executes web smoke tests for the React app |
| `yarn --cwd back lint` | Lints API code with ESLint/TypeScript |
| `yarn --cwd front lint` | Lints React Native Web code |

## Data Flow
1. A cron job inside `back/src/modules` fetches Velib station data every two minutes and stores snapshots in MongoDB.
2. Redis handles background queues (e.g., caching, task scheduling) through BullMQ.
3. The frontend uses Axios with interceptors via `front/src/Contexts/AuthContext.tsx` to attach JWT tokens to requests.
4. Pagination and filtering logic lives inside the API service layer, minimizing payload size for the client.

## Deployment Notes
- Backend: build with `yarn --cwd back build` and run `node back/dist/server.js`. PM2 configs live in `back/ecosystem.config.js`.
- Frontend: `yarn --cwd front build` produces a CRA bundle under `front/build/` ready for static hosting.
- Remember to set production environment variables (Mongo connection string, Redis URL, JWT secret) in the target infrastructure.

## Contributing
1. Fork the repository or create a feature branch.
2. Ensure tests and linters pass for both `back` and `front` workspaces.
3. Submit a pull request describing the feature or fix, and reference any related issues or tickets.

## Troubleshooting
- **Cannot connect to Mongo/Redis**: verify services are running, or adjust `DB_HOST` / `REDIS_URL`.
- **Authentication fails**: confirm `SECRET_KEY` matches between server instances and tokens are not stale.
- **React Native Web build errors**: run `yarn --cwd front test` to surface missing mocks, especially when importing native modules.
- **Outdated Velib data**: ensure the cron worker is running and check logs under `back/src/logs`.

## License
This repository is provided for interview and evaluation purposes. Contact the maintainers for reuse beyond assessment.

# GIS Learning Project

Minimal full-stack project for learning and testing GIS concepts.

## Stack

- Frontend: React + Leaflet
- Backend: Node.js + Express
- Data store: PostgreSQL + PostGIS

## What It Does

- Shows saved locations on a map
- Filters locations by category
- Supports nearby search using PostGIS distance functions
- Supports bounding-box map queries using PostGIS
- Searches places and highlights region on map
- Adds new locations with validation

## API

- GET /api/locations
- GET /api/locations?category=park
- GET /api/locations?search=place
- POST /api/locations
- DELETE /api/locations/:id

## Run The Project

### 0) Configure PostgreSQL + PostGIS (one-time)



1. Create backend env file:

```bash
cd backend
cp .env 
```

3. Set `DATABASE_URL` in `backend/.env`.

4. Optionally seed from existing JSON:

```bash
cd backend
npm run db:seed:truncate
```

1. Backend

```bash
cd backend
npm install
npm run dev
```

2. Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on port 3000 and proxies API calls to backend on port 5000.

## Run Tests

1. Backend tests

```bash
cd backend
npm test
```

2. Frontend tests

```bash
cd frontend
npm run test:ci
```

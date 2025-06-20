# Chatbot Client

A Vue.js frontend for the FitBot chatbot application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy the environment file and configure if needed:
```bash
cp .env.example .env
```

## Environment Variables

- `API_URL`: Base URL for API proxy target in development (defaults to `http://localhost:3001`)
- `VITE_API_URL`: Base URL for API calls (used in tests, defaults to `http://localhost:3001`)

## Development

Start the development server:
```bash
npm run dev
```

The client will run on `http://localhost:3000` and proxy API requests to `http://localhost:3001`.

## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

Run tests with UI:
```bash
npm run test:ui
```

## Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```
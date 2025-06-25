
# NASA Explorer Backend

A Node.js/Express backend API for the NASA Explorer application.

## Features

- NASA APOD (Astronomy Picture of the Day) API
- Mars Rover Photos API
- Near-Earth Objects (NEO) API
- EPIC Earth Imagery API
- NASA Image and Video Library Search API
- Rate limiting and security middleware
- CORS configuration
- Error handling
- Health check endpoint

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Add your NASA API key to the `.env` file:
```
NASA_API_KEY=your_nasa_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Health Check
- `GET /api/health` - Check server status

### NASA APIs
- `GET /api/nasa/apod` - Get Astronomy Picture of the Day
- `GET /api/nasa/mars/:rover/photos?sol=:sol&camera=:camera` - Get Mars rover photos
- `GET /api/nasa/neo?start_date=:start&end_date=:end` - Get Near-Earth Objects
- `GET /api/nasa/epic/images?date=:date` - Get EPIC Earth images
- `GET /api/nasa/search?q=:query&media_type=:type&page=:page` - Search NASA library

## Environment Variables

- `NASA_API_KEY` - Your NASA API key
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `ALLOWED_ORIGINS` - Comma-separated list of allowed CORS origins

## Security Features

- Helmet.js for security headers
- Rate limiting (100 requests per 15 minutes per IP)
- CORS configuration
- Input validation
- Error handling middleware

## Project Structure

```
backend/
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Utility functions
├── server.js       # Main server file
└── package.json    # Dependencies
```

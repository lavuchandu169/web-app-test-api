# Space Vista Portal - NASA Explorer Web App

A beautifully designed space exploration web app that visualizes stunning images and data from various NASA APIs including APOD, EPIC Earth imagery, Mars Rover Photos, and Near-Earth Objects. Built for educational and space-enthusiast use cases.

---

##  Features

- Astronomy Picture of the Day (APOD)
- Mars Rover Images with camera filtering
- EPIC Earth Images (natural color)
- Near-Earth Objects tracking
- NASA Image and Video Library Search

---

##  Tech Stack

| Layer         | Technology                        |
|---------------|-----------------------------------|
| Frontend      | React, Vite, TailwindCSS          |
| Backend       | Node.js, Express.js               |
| External APIs | NASA Public APIs                  |
| HTTP Client   | Axios, Fetch                      |
| Deployment    | Localhost (for development)       |

---

##  Project Structure

web-app-test-api/
│
├── backend/ # Node.js backend
│ ├── controllers/ # API route controllers
│ ├── services/ # NASA API service logic
│ ├── routes/ # Express routes
│ ├── .env # Environment variables (local)
│ └── server.js # Main entry point
│
├── frontend/ # React frontend (Vite)
│ ├── src/
│ │ ├── components/ # UI components
│ │ ├── services/ # NASAApiService.ts
│ │ └── pages/ # Page views
│ ├── public/
│ ├── vite.config.ts
│ └── index.html
│
└── README.md

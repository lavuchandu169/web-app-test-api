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



---

## 🧪 Prerequisites

Make sure the following are installed:

- Node.js ≥ v16
- npm ≥ v8
- Git
- Modern web browser (Chrome, Firefox, Edge)

---

## 🔑 NASA API Key

1. Go to [https://api.nasa.gov](https://api.nasa.gov) and sign up for a free API key.
2. Copy the key and paste it into your `.env` file in the `backend` directory.

---

## ⚙️ .env Configuration

Create a `.env` file inside the `backend/` folder:

env
NASA_API_KEY=your_nasa_api_key_here
NASA_BASE_URL=https://api.nasa.gov
PORT=3001
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:8080
🛠️ Running Locally
1️⃣ Clone the Repository

git clone https://github.com/lavuchandu169/web-app-test-api.git
cd web-app-test-api
2️⃣ Install Backend Dependencies

cd backend
npm install
3️⃣ Start the Backend Server

node server.js
Backend will run at: http://localhost:3001

4️⃣ Install Frontend Dependencies
In a new terminal tab:

cd ../
npm install
5️⃣ Start the Frontend Dev Server

npm run dev

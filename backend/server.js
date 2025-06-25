const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Routes
const nasaRoutes = require('./routes/nasa');
const healthRoutes = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// DEBUG: Log environment info
console.log('🌍 ALLOWED_ORIGINS:', process.env.ALLOWED_ORIGINS);
console.log('🔑 NASA_API_KEY:', process.env.NASA_API_KEY ? 'Loaded ✅' : 'Missing ❌');
console.log(`🚀 Starting NASA Explorer Backend on port ${PORT}`);
console.log(`🌐 Environment: ${NODE_ENV}`);

// Security: HTTP headers
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max requests per IP
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS Configuration
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean); // remove empty strings

const corsOptions = {
  origin: (origin, callback) => {
    console.log('🌐 Incoming Request Origin:', origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`❌ Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware: Logging & Parsing
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/nasa', nasaRoutes);

// 404 Fallback
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❗ Server Error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server is live at http://localhost:${PORT}`);
});

module.exports = app;

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Set default NODE_ENV if not provided
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
  console.log("NODE_ENV not set, defaulting to 'production'");
}

const app = express();
const port = process.env.PORT || 3001;

// Configure Express to trust proxies (required for hosting platforms like Railway, Heroku, etc.)
// Trust only the first proxy (Railway's load balancer)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Check explicit allowed origins first
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    // TODO: Remove these wildcard domains before production deployment
    // These are only for development/testing with dynamic preview URLs
    
    // Allow all Vercel deployment domains (REMOVE IN PRODUCTION)
    if (origin && origin.includes('.vercel.app')) {
      return callback(null, true);
    }
    
    // Allow all Railway deployment domains (REMOVE IN PRODUCTION)
    if (origin && origin.includes('.railway.app')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));

// Rate limiting - general API rate limiter
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes default
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // 100 requests per windowMs default
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT
  });
});

// Example API endpoint with validation and rate limiting
app.post('/api/example', 
  apiLimiter,
  [
    body('data')
      .optional()
      .custom((value) => {
        if (value !== undefined && typeof value !== 'string') {
          throw new Error('Data must be a string');
        }
        return true;
      })
      .isLength({ max: 1000 })
      .withMessage('Data must be less than 1000 characters')
      .trim()
  ],
  async (req, res) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Invalid input',
        details: errors.array().map(err => err.msg),
        errors: errors.array()
      });
    }

    const { data } = req.body;

    // Example processing
    const result = {
      received: data || 'No data provided',
      processed: true,
      timestamp: new Date().toISOString()
    };

    res.json({ 
      success: true,
      result: result 
    });
  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    // Don't expose internal error details to client
    res.status(500).json({ 
      error: 'Internal server error. Please try again later.'
    });
  }
});

// Basic GET endpoint example
app.get('/api/status', (req, res) => {
  res.json({
    server: 'Express.js',
    status: 'running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Node version: ${process.version}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Port: ${port}`);
    console.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);
  });
}

// Export app for testing
module.exports = app;
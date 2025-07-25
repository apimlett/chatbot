const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const path = require("path");

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Set default NODE_ENV if not provided
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
  console.log("NODE_ENV not set, defaulting to 'production'");
}

// Validate required environment variables
if (!process.env.OPENAI_API_KEY) {
  console.error("ERROR: OPENAI_API_KEY environment variable is required");
  process.exit(1);
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

// Rate limiting
const chatLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes default
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100, // 100 requests per windowMs default
  message: { error: 'Too many chat requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System message to set the context
const systemMessage = {
  role: "system",
  content: "You are Cogfusion.ai, an advanced AI assistant designed to help users with cognitive fusion of ideas and problem-solving. You excel at connecting disparate concepts, providing insightful analysis, and helping users think through complex problems. When someone greets you, introduce yourself and offer to help them explore ideas, solve problems, or gain new perspectives."
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT
  });
});

// Chat endpoint with validation and rate limiting
app.post('/api/chat', 
  chatLimiter,
  [
    body('message')
      .custom((value) => {
        if (typeof value !== 'string') {
          throw new Error('Message must be a string');
        }
        return true;
      })
      .isLength({ min: 1, max: 2000 })
      .withMessage('Message must be between 1 and 2000 characters')
      .trim()
      .custom((value) => {
        if (!value || value.length === 0) {
          throw new Error('Message cannot be empty or whitespace only');
        }
        return true;
      })
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

    const { message, conversationHistory = [] } = req.body;

    // Build the messages array with conversation history
    const messages = [
      systemMessage,
      ...conversationHistory,
      { role: "user", content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7,
    });

    // Validate OpenAI response structure
    if (!completion.choices || completion.choices.length === 0) {
      throw new Error('Invalid response from OpenAI API');
    }

    const response = completion.choices[0].message.content;

    res.json({ response: response });
  } catch (error) {
    console.error('Chat API Error:', {
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

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Node version: ${process.version}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Port: ${port}`);
    console.log(`OpenAI API Key configured: ${process.env.OPENAI_API_KEY ? 'Yes' : 'No'}`);
  });
}

// Export app for testing
module.exports = app;

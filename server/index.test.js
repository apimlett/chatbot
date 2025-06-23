const request = require('supertest');
const app = require('./index');

describe('Server Unit Tests', () => {
  describe('Environment Configuration', () => {
    it('should have required environment variables in test', () => {
      expect(process.env.NODE_ENV).toBe('test');
    });
  });

  describe('Express App Configuration', () => {
    it('should have CORS middleware configured', async () => {
      const response = await request(app)
        .options('/api/health')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET');
      
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    });

    it('should reject unauthorized CORS origins', async () => {
      const response = await request(app)
        .options('/api/health')
        .set('Origin', 'http://malicious-site.com')
        .set('Access-Control-Request-Method', 'GET');
      
      expect(response.status).toBe(500);
    });

    it('should allow Vercel domains (development feature)', async () => {
      const response = await request(app)
        .options('/api/health')
        .set('Origin', 'https://my-app.vercel.app')
        .set('Access-Control-Request-Method', 'GET');
      
      expect(response.headers['access-control-allow-origin']).toBe('https://my-app.vercel.app');
    });

    it('should allow Railway domains (development feature)', async () => {
      const response = await request(app)
        .options('/api/health')
        .set('Origin', 'https://my-app.railway.app')
        .set('Access-Control-Request-Method', 'GET');
      
      expect(response.headers['access-control-allow-origin']).toBe('https://my-app.railway.app');
    });

    it('should trust proxy configuration', () => {
      expect(app.get('trust proxy')).toBe(1);
    });
  });

  describe('API Endpoints', () => {
    describe('GET /api/health', () => {
      it('should return server health status', async () => {
        const response = await request(app)
          .get('/api/health')
          .expect(200);

        expect(response.body).toHaveProperty('status', 'ok');
        expect(response.body).toHaveProperty('message', 'Server is running');
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body).toHaveProperty('nodeVersion');
        expect(response.body).toHaveProperty('nodeEnv', 'test');
      });
    });

    describe('GET /api/status', () => {
      it('should return server status information', async () => {
        const response = await request(app)
          .get('/api/status')
          .expect(200);

        expect(response.body).toHaveProperty('server', 'Express.js');
        expect(response.body).toHaveProperty('status', 'running');
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body).toHaveProperty('uptime');
      });
    });

    describe('POST /api/example', () => {
      it('should process valid data', async () => {
        const testData = { data: 'test message' };
        
        const response = await request(app)
          .post('/api/example')
          .send(testData)
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body.result).toHaveProperty('received', 'test message');
        expect(response.body.result).toHaveProperty('processed', true);
        expect(response.body.result).toHaveProperty('timestamp');
      });

      it('should handle requests with no data', async () => {
        const response = await request(app)
          .post('/api/example')
          .send({})
          .expect(200);

        expect(response.body).toHaveProperty('success', true);
        expect(response.body.result).toHaveProperty('received', 'No data provided');
        expect(response.body.result).toHaveProperty('processed', true);
      });

      it('should validate data length', async () => {
        const longData = 'x'.repeat(1001); // Over 1000 character limit
        const testData = { data: longData };
        
        const response = await request(app)
          .post('/api/example')
          .send(testData)
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Invalid input');
        expect(response.body).toHaveProperty('details');
      });

      it('should validate data type', async () => {
        const testData = { data: 123 }; // Should be string
        
        const response = await request(app)
          .post('/api/example')
          .send(testData)
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Invalid input');
        expect(response.body).toHaveProperty('details');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 routes', async () => {
      const response = await request(app)
        .get('/api/nonexistent')
        .expect(404);
    });

    it('should handle invalid JSON in request body', async () => {
      const response = await request(app)
        .post('/api/example')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);
    });
  });

  describe('Security Middleware', () => {
    it('should include security headers', async () => {
      const response = await request(app)
        .get('/api/health');

      // Check for some helmet security headers
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
    });
  });
});
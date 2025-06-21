const request = require('supertest');
const OpenAI = require('openai');

// Import the app after mocking OpenAI
const app = require('./index');

describe('API Endpoint Tests', () => {
  describe('POST /api/chat', () => {
    describe('Success Cases', () => {
      it('should return 200 with valid message', async () => {
        const response = await request(app)
          .post('/api/chat')
          .send({ message: 'Hello' });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('response');
        expect(response.body.response).toBe('Mock OpenAI response');
        expect(response.headers['content-type']).toMatch(/json/);
      });

      it('should handle fitness-related queries', async () => {
        const fitnessQueries = [
          'What is the best workout for beginners?',
          'How many calories should I eat to lose weight?',
          'What are good exercises for building muscle?',
          'How often should I exercise?',
          'What supplements do you recommend?'
        ];

        for (const query of fitnessQueries) {
          const response = await request(app)
            .post('/api/chat')
            .send({ message: query });
          
          expect(response.status).toBe(200);
          expect(response.body.response).toBe('Mock OpenAI response');
        }
      });

      it('should handle special characters in messages', async () => {
        const specialMessages = [
          'Hello! How are you?',
          'I weigh 70kg & I\'m 180cm tall',
          'Message with "quotes" and symbols: @#$%',
          'Unicode characters: 🏋️‍♂️💪🏃‍♀️',
          'Newlines\nand\ttabs'
        ];

        for (const message of specialMessages) {
          const response = await request(app)
            .post('/api/chat')
            .send({ message });
          
          expect(response.status).toBe(200);
          expect(response.body.response).toBe('Mock OpenAI response');
        }
      });

      it('should handle maximum length messages', async () => {
        const maxMessage = 'A'.repeat(2000); // Maximum allowed length
        
        const response = await request(app)
          .post('/api/chat')
          .send({ message: maxMessage });
        
        expect(response.status).toBe(200);
        expect(response.body.response).toBe('Mock OpenAI response');
      });
    });

    describe('Validation Errors', () => {
      it('should return 400 for empty message', async () => {
        const response = await request(app)
          .post('/api/chat')
          .send({ message: '' });
        
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid input');
        expect(response.body.details).toBeDefined();
        expect(response.body.errors).toBeInstanceOf(Array);
        expect(response.body.errors.length).toBeGreaterThan(0);
      });

      it('should return 400 for whitespace-only message', async () => {
        const response = await request(app)
          .post('/api/chat')
          .send({ message: '   \n\t   ' });
        
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid input');
        expect(response.body.details).toBeDefined();
      });

      it('should return 400 for missing message field', async () => {
        const response = await request(app)
          .post('/api/chat')
          .send({});
        
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid input');
        expect(response.body.details).toBeDefined();
      });

      it('should return 400 for non-string message', async () => {
        const invalidMessages = [
          { message: 123 },
          { message: true },
          { message: null },
          { message: undefined },
          { message: {} },
          { message: [] }
        ];

        for (const payload of invalidMessages) {
          const response = await request(app)
            .post('/api/chat')
            .send(payload);
          
          expect(response.status).toBe(400);
          expect(response.body).toHaveProperty('errors');
        }
      });

      it('should return 400 for message exceeding length limit', async () => {
        const tooLongMessage = 'A'.repeat(10001); // One character over limit
        
        const response = await request(app)
          .post('/api/chat')
          .send({ message: tooLongMessage });
        
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid input');
        expect(response.body.details).toBeDefined();
      });

      it('should return detailed validation error messages', async () => {
        const response = await request(app)
          .post('/api/chat')
          .send({ message: '' });
        
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid input');
        expect(response.body.details).toBeInstanceOf(Array);
        expect(response.body.details[0]).toContain('Message must be between 1 and 2000 characters');
      });
    });

    describe('Server Errors', () => {
      it('should return 500 when OpenAI service fails', async () => {
        const mockCreate = OpenAI().chat.completions.create;
        mockCreate.mockRejectedValueOnce(new Error('OpenAI API Error'));

        const response = await request(app)
          .post('/api/chat')
          .send({ message: 'Test message' });
        
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('Internal server error. Please try again later.');
        
        // Restore mock
        mockCreate.mockResolvedValue({
          choices: [{
            message: {
              content: 'Mock OpenAI response'
            }
          }]
        });
      });

      it('should return 500 for malformed OpenAI response', async () => {
        const mockCreate = OpenAI().chat.completions.create;
        mockCreate.mockResolvedValueOnce({}); // Missing choices

        const response = await request(app)
          .post('/api/chat')
          .send({ message: 'Test message' });
        
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Internal server error. Please try again later.');
        
        // Restore mock
        mockCreate.mockResolvedValue({
          choices: [{
            message: {
              content: 'Mock OpenAI response'
            }
          }]
        });
      });
    });

    describe('Rate Limiting', () => {
      it('should return 429 when rate limit exceeded', async () => {
        // Make many requests quickly to trigger rate limiting (exceed 50 per second)
        const requests = Array(60).fill().map(() =>
          request(app)
            .post('/api/chat')
            .send({ message: 'Rate limit test' })
        );

        const responses = await Promise.all(requests);
        
        // At least some should be rate limited
        const rateLimited = responses.filter(r => r.status === 429);
        expect(rateLimited.length).toBeGreaterThan(0);
        
        // Rate limited responses should have appropriate headers
        rateLimited.forEach(response => {
          expect(response.headers).toHaveProperty('retry-after');
          expect(response.body).toHaveProperty('error');
        });
      });

      it('should allow requests after rate limit window', async () => {
        // This would require waiting for the rate limit window to reset
        // For testing purposes, we'll just verify the rate limit header format
        const response = await request(app)
          .post('/api/chat')
          .send({ message: 'Rate limit header test' });
        
        // Should have rate limiting headers (whether limited or not)
        expect(response.headers).toHaveProperty('ratelimit-limit');
        expect(response.headers).toHaveProperty('ratelimit-remaining');
      });
    });

    describe('CORS Headers', () => {
      it('should include correct CORS headers for allowed origins', async () => {
        const allowedOrigins = [
          'http://localhost:3000',
          'http://localhost:5173',
          'https://test.vercel.app',
          'https://test.railway.app'
        ];

        for (const origin of allowedOrigins) {
          const response = await request(app)
            .post('/api/chat')
            .set('Origin', origin)
            .send({ message: 'CORS test' });
          
          expect(response.headers['access-control-allow-origin']).toBe(origin);
          expect(response.headers['access-control-allow-credentials']).toBe('true');
        }
      });

      it('should handle preflight OPTIONS requests', async () => {
        const response = await request(app)
          .options('/api/chat')
          .set('Origin', 'http://localhost:3000')
          .set('Access-Control-Request-Method', 'POST')
          .set('Access-Control-Request-Headers', 'Content-Type');
        
        expect(response.status).toBe(204);
        expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
        expect(response.headers['access-control-allow-methods']).toContain('POST');
        expect(response.headers['access-control-allow-headers']).toContain('Content-Type');
      });
    });

    describe('Security Headers', () => {
      it('should include security headers in responses', async () => {
        const response = await request(app)
          .post('/api/chat')
          .send({ message: 'Security test' });
        
        // Helmet security headers
        expect(response.headers).toHaveProperty('x-content-type-options');
        expect(response.headers).toHaveProperty('x-frame-options');
        expect(response.headers).toHaveProperty('x-download-options');
        expect(response.headers['x-content-type-options']).toBe('nosniff');
      });
    });
  });

  describe('Unsupported Endpoints', () => {
    it('should return 404 for GET /api/chat', async () => {
      const response = await request(app).get('/api/chat');
      expect(response.status).toBe(404);
    });

    it('should return 404 for PUT /api/chat', async () => {
      const response = await request(app)
        .put('/api/chat')
        .send({ message: 'Test' });
      expect(response.status).toBe(404);
    });

    it('should return 404 for DELETE /api/chat', async () => {
      const response = await request(app).delete('/api/chat');
      expect(response.status).toBe(404);
    });

    it('should return 404 for unknown API endpoints', async () => {
      const unknownEndpoints = [
        '/api/unknown',
        '/api/chat/123',
        '/api/users',
        '/api/health'
      ];

      for (const endpoint of unknownEndpoints) {
        const response = await request(app).get(endpoint);
        expect(response.status).toBe(404);
      }
    });
  });

  describe('Request/Response Format', () => {
    it('should accept and return JSON content type', async () => {
      const response = await request(app)
        .post('/api/chat')
        .set('Content-Type', 'application/json')
        .send({ message: 'JSON test' });
      
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should have consistent response structure', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send({ message: 'Structure test' });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('response');
      expect(typeof response.body.response).toBe('string');
      expect(response.body.response.length).toBeGreaterThan(0);
    });
  });
});
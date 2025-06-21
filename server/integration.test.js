const request = require('supertest');
const OpenAI = require('openai');

// Import the app after mocking OpenAI
const app = require('./index');

describe('Server Integration Tests', () => {
  describe('Full Chat Flow', () => {
    it('should handle complete conversation flow', async () => {
      // First message
      const response1 = await request(app)
        .post('/api/chat')
        .send({ message: 'Hello, I need fitness advice' });
      
      expect(response1.status).toBe(200);
      expect(response1.body.response).toBe('Mock OpenAI response');
      
      // Follow-up message
      const response2 = await request(app)
        .post('/api/chat')
        .send({ message: 'What exercises should I do?' });
      
      expect(response2.status).toBe(200);
      expect(response2.body.response).toBe('Mock OpenAI response');
      
      // Third message
      const response3 = await request(app)
        .post('/api/chat')
        .send({ message: 'How many times per week?' });
      
      expect(response3.status).toBe(200);
      expect(response3.body.response).toBe('Mock OpenAI response');
    });

    it('should handle concurrent requests', async () => {
      const messages = [
        'What is the best workout routine?',
        'How much protein should I eat?',
        'What time should I exercise?',
        'How long should my workouts be?',
        'What about rest days?'
      ];

      const requests = messages.map(message =>
        request(app)
          .post('/api/chat')
          .send({ message })
      );

      const responses = await Promise.all(requests);
      
      // All should succeed (within rate limits)
      responses.forEach(response => {
        // Should be either successful or rate limited
        expect([200, 429]).toContain(response.status);
        if (response.status === 200) {
          expect(response.body.response).toBe('Mock OpenAI response');
        }
      });
    });
  });

  describe('Security Integration', () => {
    it('should handle CORS preflight and actual request flow', async () => {
      const origin = 'http://localhost:3000';
      
      // Preflight request
      const preflightResponse = await request(app)
        .options('/api/chat')
        .set('Origin', origin)
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'Content-Type');
      
      expect(preflightResponse.headers['access-control-allow-origin']).toBe(origin);
      expect(preflightResponse.headers['access-control-allow-methods']).toContain('POST');
      
      // Actual request
      const actualResponse = await request(app)
        .post('/api/chat')
        .set('Origin', origin)
        .send({ message: 'Hello' });
      
      expect(actualResponse.status).toBe(200);
      expect(actualResponse.headers['access-control-allow-origin']).toBe(origin);
    });

    it('should enforce rate limiting across multiple IPs', async () => {
      const requests = [];
      
      // Simulate requests from same IP (should be rate limited) - exceed 50 per second
      for (let i = 0; i < 60; i++) {
        requests.push(
          request(app)
            .post('/api/chat')
            .set('X-Forwarded-For', '192.168.1.100')
            .send({ message: `Message ${i}` })
        );
      }
      
      const responses = await Promise.all(requests);
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      
      // Should have some rate limited responses
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });

    it('should validate and sanitize input thoroughly', async () => {
      const testCases = [
        { input: '<script>alert("xss")</script>', shouldFail: false }, // Should be handled by OpenAI
        { input: 'A'.repeat(20000), shouldFail: true }, // Too long
        { input: '', shouldFail: true }, // Empty
        { input: '   ', shouldFail: true }, // Whitespace only
        { input: null, shouldFail: true }, // Null
        { input: undefined, shouldFail: true }, // Undefined
      ];

      for (const testCase of testCases) {
        const response = await request(app)
          .post('/api/chat')
          .send({ message: testCase.input });
        
        if (testCase.shouldFail) {
          expect(response.status).toBe(400);
          expect(response.body.error).toBe('Invalid input');
          expect(response.body.details).toBeDefined();
        } else {
          expect([200, 500]).toContain(response.status); // 500 if OpenAI fails
        }
      }
    });
  });

  describe('Error Recovery Integration', () => {
    it('should handle OpenAI service outages gracefully', async () => {
      // Mock OpenAI to fail
      const mockCreate = OpenAI().chat.completions.create;
      mockCreate.mockRejectedValue(new Error('Service Unavailable'));

      const response = await request(app)
        .post('/api/chat')
        .send({ message: 'Test during outage' });
      
      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error. Please try again later.');
      
      // Restore service
      mockCreate.mockResolvedValue({
        choices: [{
          message: {
            content: 'Mock OpenAI response'
          }
        }]
      });

      // Should work again
      const recoveryResponse = await request(app)
        .post('/api/chat')
        .send({ message: 'Test after recovery' });
      
      expect(recoveryResponse.status).toBe(200);
      expect(recoveryResponse.body.response).toBe('Mock OpenAI response');
    });

    it('should handle malformed JSON requests', async () => {
      const response = await request(app)
        .post('/api/chat')
        .set('Content-Type', 'application/json')
        .send('{"message": invalid json}');
      
      expect(response.status).toBe(400);
    });

    it('should handle missing content-type header', async () => {
      const response = await request(app)
        .post('/api/chat')
        .send('message=test');
      
      // Should still be handled appropriately
      expect([400, 415]).toContain(response.status);
    });
  });

  describe('Performance Integration', () => {
    it('should handle rapid sequential requests', async () => {
      const startTime = Date.now();
      const requests = [];
      
      for (let i = 0; i < 5; i++) {
        requests.push(
          request(app)
            .post('/api/chat')
            .send({ message: `Performance test ${i}` })
        );
      }
      
      const responses = await Promise.all(requests);
      const endTime = Date.now();
      
      // Should complete within reasonable time (allowing for rate limiting)
      expect(endTime - startTime).toBeLessThan(10000);
      
      // Should have at least some successful responses
      const successfulResponses = responses.filter(r => r.status === 200);
      expect(successfulResponses.length).toBeGreaterThan(0);
    });

    it('should handle large valid payloads efficiently', async () => {
      const largeMessage = 'This is a test message. '.repeat(80); // ~1840 chars (under 2000 limit)
      
      const startTime = Date.now();
      const response = await request(app)
        .post('/api/chat')
        .send({ message: largeMessage });
      const endTime = Date.now();
      
      expect(response.status).toBe(200);
      expect(endTime - startTime).toBeLessThan(5000); // Should complete quickly
    });
  });

  describe('OpenAI Integration', () => {
    it('should properly format OpenAI requests', async () => {
      const mockCreate = OpenAI().chat.completions.create;
      
      await request(app)
        .post('/api/chat')
        .send({ message: 'Test OpenAI integration' });
      
      // Verify OpenAI was called with correct parameters
      expect(mockCreate).toHaveBeenCalledWith({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: expect.stringContaining('Cogfusion.ai')
          },
          {
            role: 'user',
            content: 'Test OpenAI integration'
          }
        ],
        temperature: 0.7
      });
    });

    it('should handle different OpenAI response formats', async () => {
      const mockCreate = OpenAI().chat.completions.create;
      
      // Test with different response formats
      const testResponses = [
        {
          choices: [{
            message: { content: 'Short response' }
          }]
        },
        {
          choices: [{
            message: { content: 'A'.repeat(1000) } // Long response
          }]
        },
        {
          choices: [{
            message: { content: 'Response with\nmultiple\nlines' }
          }]
        }
      ];

      for (const mockResponse of testResponses) {
        mockCreate.mockResolvedValueOnce(mockResponse);
        
        const response = await request(app)
          .post('/api/chat')
          .send({ message: 'Test different responses' });
        
        expect(response.status).toBe(200);
        expect(response.body.response).toBe(mockResponse.choices[0].message.content);
      }
      
      // Restore default mock
      mockCreate.mockResolvedValue({
        choices: [{
          message: {
            content: 'Mock OpenAI response'
          }
        }]
      });
    });
  });
});
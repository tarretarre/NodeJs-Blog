const request = require('supertest');
const app = require('../app');

describe('GET /about', () => {
    it('should return the About page', async () => {
        const response = await request(app).get('/about');

        expect(response.status).toBe(200);
        expect(response.text).toContain('Find out more about Tarre');
    });
});
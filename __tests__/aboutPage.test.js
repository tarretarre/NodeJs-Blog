const request = require('supertest');
const app = require('../app');
const {pool} = require('../server/config/db');

describe('GET /about', () => {
    afterAll(async () => {
        pool.end();
    });

    it('should return the About page', async () => {
        const response = await request(app).get('/about');

        expect(response.status).toBe(200);
        expect(response.text).toContain('Find out more about me');
    });
});
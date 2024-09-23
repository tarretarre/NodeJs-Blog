const request = require('supertest');
const app = require('../app');

describe('DELETE /posts/:id', () => {
    it('should delete a post', async () => {
        const post = await request(app)
        .post('/posts')
        .send({title: 'Test Post', content: 'This is a test post.'});

        const response = await request(app)
        .delete(`/posts/${post.body.id}`);

        expect(response.status).toBe(204);

        const getResponse = await request(app).get(`/posts/${post.body.id}`);
        expect(getResponse.status).toBe(404);
    });
});
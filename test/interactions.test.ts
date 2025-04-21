import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import interactionRoutes from '../src/routes/interactionRoutes';
import { interactions } from '../src/utils/dataStore';

const app = express();
app.use(bodyParser.json());
app.use('/interactions', interactionRoutes);

describe('POST /interactions', () => {
  beforeEach(() => {
    interactions.length = 0; // reset "DB"
  });

  it('should store a valid interaction', async () => {
    const res = await request(app).post('/interactions').send({
      userId: 'test-user',
      contentId: 'test-content',
      type: 'like',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.interaction).toHaveProperty('userId', 'test-user');
  });

  it('should return 400 for missing fields', async () => {
    const res = await request(app).post('/interactions').send({
      contentId: 'test-content',
      type: 'like',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should validate rating if type is "rate"', async () => {
    const res = await request(app).post('/interactions').send({
      userId: 'test-user',
      contentId: 'test-content',
      type: 'rate',
      rating: 10
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Rating must be between 1 and 5/);
  });
});

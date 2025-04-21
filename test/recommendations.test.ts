import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';

import recommendationRoutes from '../src/routes/recommendationRoutes';
import { users, contents, interactions } from '../src/utils/dataStore';

const app = express();
app.use(bodyParser.json());
app.use('/recommendations', recommendationRoutes);

describe('GET /recommendations/:userId', () => {
  beforeEach(() => {
    // Reset mock data
    users.length = 0;
    contents.length = 0;
    interactions.length = 0;

    // Add test user
    users.push({
      id: 'user-1',
      username: 'testuser',
      preferences: ['technology', 'ai']
    });

    // Add test content
    contents.push(
      {
        id: 'content-1',
        title: 'Intro to AI',
        type: 'article',
        tags: ['ai', 'technology'],
        popularity: 10,
        createdAt: new Date()
      },
      {
        id: 'content-2',
        title: 'Health Tips',
        type: 'video',
        tags: ['health', 'wellness'],
        popularity: 5,
        createdAt: new Date()
      }
    );

    // Add interaction
    interactions.push({
      userId: 'user-1',
      contentId: 'content-1',
      type: 'like',
      timestamp: new Date()
    });
  });

  it('should return recommendations for valid user', async () => {
    const res = await request(app).get('/recommendations/user-1');

    expect(res.statusCode).toBe(200);
    expect(res.body.recommendations.length).toBeGreaterThanOrEqual(0);
    expect(res.body.user).toBe('testuser');
  });

  it('should return 404 for invalid user', async () => {
    const res = await request(app).get('/recommendations/nonexistent');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});

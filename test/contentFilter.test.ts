import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';

import contentRoutes from '../src/routes/contentRoutes';
import { contents } from '../src/utils/dataStore';

const app = express();
app.use(bodyParser.json());
app.use('/content', contentRoutes);

describe('GET /content/filter', () => {
  beforeEach(() => {
    contents.length = 0;

    contents.push(
      {
        id: '1',
        title: 'AI in 2024',
        type: 'article',
        tags: ['technology', 'ai'],
        popularity: 8,
        createdAt: new Date()
      },
      {
        id: '2',
        title: 'Health Hacks',
        type: 'video',
        tags: ['health', 'wellness'],
        popularity: 6,
        createdAt: new Date()
      },
      {
        id: '3',
        title: 'JavaScript Deep Dive',
        type: 'article',
        tags: ['programming', 'javascript'],
        popularity: 7,
        createdAt: new Date()
      }
    );
  });

  it('should filter by type "article"', async () => {
    const res = await request(app).get('/content/filter?type=article');
    expect(res.statusCode).toBe(200);
    expect(res.body.results.length).toBe(2);
    expect(res.body.results.every(c => c.type === 'article')).toBe(true);
  });

  it('should filter by tag "health"', async () => {
    const res = await request(app).get('/content/filter?tag=health');
    expect(res.statusCode).toBe(200);
    expect(res.body.results.length).toBe(1);
    expect(res.body.results[0].tags).toContain('health');
  });

  it('should filter by type AND tag', async () => {
    const res = await request(app).get('/content/filter?type=article&tag=technology');
    expect(res.statusCode).toBe(200);
    expect(res.body.results.length).toBe(1);
    expect(res.body.results[0].title).toBe('AI in 2024');
  });

  it('should return all content if no filters are provided', async () => {
    const res = await request(app).get('/content/filter');
    expect(res.statusCode).toBe(200);
    expect(res.body.results.length).toBe(3);
  });
});

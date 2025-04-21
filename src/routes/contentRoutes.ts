import express, { Request, Response } from 'express';
import ContentModel from '../models/Content';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.get('/filter', async (req: Request, res: Response) => {
  const { type, tag } = req.query;

  const query: any = {};

  if (type) {
    query.type = type;
  }

  if (tag) {
    query.tags = tag;
  }

  try {
    const filtered = await ContentModel.find(query);
    res.json({ results: filtered });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  const { title, type, tags, popularity } = req.body;

  if (!title || !type || !Array.isArray(tags)) {
    return res.status(400).json({ error: 'Title, type, and tags are required' });
  }

  try {
    const newContent = new ContentModel({
      id: uuidv4(),
      title,
      type,
      tags,
      popularity
    });

    await newContent.save();

    res.status(201).json({ message: 'Content created', content: newContent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create content' });
  }
});

export default router;

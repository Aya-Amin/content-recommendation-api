import express, { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import UserModel from '../models/User';

const router = express.Router();

// POST /users — Create new user
router.post('/', async (req: Request, res: Response) => {
  const { username, preferences } = req.body;

  if (!username || !Array.isArray(preferences)) {
    return res.status(400).json({ error: 'Username and preferences are required' });
  }

  try {
    const newUser = new UserModel({
      id: uuidv4(),
      username,
      preferences
    });

    await newUser.save();
    res.status(201).json({ message: 'User created', user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// GET /users — Retrieve all users
router.get('/', async (_req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;

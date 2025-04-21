/*
*Recommend content to a user based on:
    Tags from their preferences
    Tags from content they interacted with
    Content popularity
    Freshness (recent content)
*/

import express from "express";
import { Request, Response } from "express";
import UserModel from '../models/User';
import ContentModel from '../models/Content';
import InteractionModel from '../models/Interaction';

const router = express.Router();

router.get("/:userId", async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

try {
  const user = await UserModel.findOne({ id: userId });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const interactions = await InteractionModel.find({ userId });
  const interactedContentIds = interactions.map(i => i.contentId);

  const interactedContents = await ContentModel.find({ id: { $in: interactedContentIds } });

  // Build tag frequency map
  const tagFrequency: Record<string, number> = {};
  interactedContents.forEach(content => {
    content.tags.forEach(tag => {
      tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
    });
  });

  // Boost user preferences
  user.preferences.forEach(tag => {
    tagFrequency[tag] = (tagFrequency[tag] || 0) + 2;
  });

  // Score remaining content
  const allContent = await ContentModel.find({ id: { $nin: interactedContentIds } });

  const scored = allContent.map(content => {
    let score = 0;
    content.tags.forEach(tag => {
      score += tagFrequency[tag] || 0;
    });

    const ageInDays = (new Date().getTime() - content.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    score += content.popularity || 0;
    if (ageInDays < 7) score += 5;

    return { ...content.toObject(), score };
  });

  const sorted = scored.sort((a, b) => b.score - a.score);
  const start = (page - 1) * limit;
  const paginated = sorted.slice(start, start + limit);

  return res.json({
    user: user.username,
    recommendations: paginated
  });

} catch (err) {
  console.error(err);
  return res.status(500).json({ error: 'Server error' });
}
});

export default router;

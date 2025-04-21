import express from "express";
import { Request, Response } from "express";
import InteractionModel, { Interaction } from "../models/Interaction";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { userId, contentId, type, rating } = req.body;

  if (!userId || !contentId || !type) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const validTypes = ["view", "like", "bookmark", "rate"];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: "Invalid interaction type" });
  }

  if (type === "rate" && (rating === undefined || rating < 1 || rating > 5)) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  const newInteraction = new InteractionModel({
    userId,
    contentId,
    type,
    rating
  });

  await newInteraction.save();

  return res.status(201).json({ message: "Interaction recorded", interaction });
});

export default router;

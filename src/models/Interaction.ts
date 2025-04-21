import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  contentId: { type: String, required: true },
  type: {
    type: String,
    enum: ["view", "like", "bookmark", "rate"],
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
  rating: { type: Number, min: 1, max: 5 },
});

const InteractionModel = mongoose.model("Interaction", interactionSchema);

export default InteractionModel;

export type InteractionType = "view" | "like" | "bookmark" | "rate";

export interface Interaction {
  userId: string;
  contentId: string;
  type: InteractionType;
  timestamp: Date;
  rating?: number; // only for 'rate'
}

import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
 {
    id: String,
    title: String,
    type: String,
    tags: [String],
    popularity: Number
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

const ContentModel = mongoose.model("Content", contentSchema);

export default ContentModel;


export interface Content {
  id: string;
  title: string;
  type: string; // e.g. 'article', 'video'
  tags: string[];
  popularity: number;
  createdAt: Date;
}

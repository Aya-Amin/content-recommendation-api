import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectMongo from "./utils/mongo";

import interactionRoutes from "./routes/interactionRoutes";
import recommendationRoutes from "./routes/recommendationRoutes";
import contentRoutes from "./routes/contentRoutes";
import userRoutes from './routes/userRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use("/interactions", interactionRoutes);
app.use("/recommendations", recommendationRoutes);
app.use("/content", contentRoutes);
app.use('/users', userRoutes);

connectMongo();

app.get("/", (req, res) => {
  res.send("Content Recommendation API is running.");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: String,
  username: String,
  preferences: [String],
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;

export interface User {
  id: string;
  username: string;
  preferences: string[]; // e.g. ['technology', 'sports']
}

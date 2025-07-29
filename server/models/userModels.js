import mongoose from "mongoose";
// Define the user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  personality: {
    type: String,
    enum: ["flirt", "nerdy", "toxic", "sarcastic", "yandere"],
  },
});

export default mongoose.model("User", userSchema);
// This model can be used to interact with the 'users' collection in the MongoDB database

import mongoose from "mongoose";
// Define the user schema
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    personality: {
      type: String,
      enum: ["flirt", "nerdy", "toxic", "sarcastic", "yandere"],
    },
    hasEditedMemory: {
      type: Boolean,
      default: false, // Used to check if user has customized their AI
    },
    memory: {
      likes: { type: [String], default: [] },
      dislikes: { type: [String], default: [] },
      favoriteTopics: { type: [String], default: [] },
      partnerName: { type: String, default: "Senpai" },
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

export default mongoose.model("User", userSchema);
// This model can be used to interact with the 'users' collection in the MongoDB database

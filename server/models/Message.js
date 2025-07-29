import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: [
      {
        from: String, //"user" or "ai"
        text: String,
        timeStamp: { type: Date, default: Date.now },
      },
    ],
    personality: { type: String, default: "flirt" },
  },
  { timestamps: true },
  {
    memory: {
      likes: [String],
      dislikes: [String],
      favoriteTopics: [String],
      partnerName: String,
    },
  }
);

export default mongoose.model("Message", messageSchema);

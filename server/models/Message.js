import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: [
      {
        from: String,
        text: String,
        timeStamp: { type: Date, default: Date.now },
      },
    ],
    personality: { type: String, default: "flirt" },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);

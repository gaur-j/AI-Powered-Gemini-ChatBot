import express from "express";
import { register, login } from "../controllers/userController.js";
import protect from "../middlewares/auth.js";
import User from "../models/userModels.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update memory & mark as edited
router.put("/memory", protect, async (req, res) => {
  const { likes, dislikes, favoriteTopics, partnerName } = req.body;
  const user = await User.findById(req.user.id);

  user.memory = {
    likes: likes || [],
    dislikes: dislikes || [],
    favoriteTopics: favoriteTopics || [],
    partnerName: partnerName || "Senpai",
  };
  user.hasEditedMemory = true; // ✅ always allow updating
  await user.save();

  res.json({ message: "Memory updated", memory: user.memory });
});

// Update personality
router.put("/personality", protect, async (req, res) => {
  const { personality } = req.body;
  const valid = ["flirt", "nerdy", "sarcastic", "toxic", "yandere"];

  if (!valid.includes(personality)) {
    return res.status(400).json({ error: "Invalid Personality" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { personality },
      { new: true }
    ).select("-password");

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "Personality updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Failed to update personality" });
  }
});

export default router;

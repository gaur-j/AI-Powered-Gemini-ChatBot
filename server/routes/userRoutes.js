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

  const update = {
    "memory.likes": likes || [],
    "memory.dislikes": dislikes || [],
    "memory.favoriteTopics": favoriteTopics || [],
    "memory.partnerName": partnerName || "Senpai",
    hasEditedMemory: true,
  };

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { $set: update },
    { new: true } // returns updated user
  ).select("-password");

  res.json(updatedUser); // ✅ returns updated user
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

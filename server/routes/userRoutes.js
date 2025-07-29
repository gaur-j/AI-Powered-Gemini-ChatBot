import express from "express";
import { register, login } from "../controllers/userController.js";
import protect from "../middlewares/auth.js";
import User from "../models/userModels.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});
router.put("/memory", protect, async (req, res) => {
  const { likes, dislikes, favoriteTopics, partnerName } = req.body;
  const update = {
    "memory.likes": likes || [],
    "memory.dislikes": dislikes || [],
    "memory.favoriteTopics": favoriteTopics || [],
    "memory.partnerName": partnerName || "Senpai",
  };
  await User.findByIdAndUpdate(req.user.id, { $set: update });
  res.json({ message: "Memory Updated" });
});
router.put("/personality", protect, async (req, res) => {
  const { personality } = req.body;
  const valid = ["flirt", "nerdy", "sarcastic", "toxic", "yandere"];
  if (!valid.includes(personality))
    return res.status(400).json({ err: "Invalid Personality" });
  await User.findByIdAndUpdate(req.user.id, { personality });
  res.json({ message: "personality update" });
});

export default router;

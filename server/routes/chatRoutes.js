import express from "express";
import { chatWithAI } from "../controllers/chatController.js";
import protect from "../middlewares/auth.js";
import MessageModel from "../models/Message.js";

const routes = express.Router();
routes.post("/", protect, chatWithAI);
routes.get("/history", protect, async (req, res) => {
  const history = await MessageModel.findOne({ userId: req.user.id });
  res.json(history?.message || []);
});
export default routes;

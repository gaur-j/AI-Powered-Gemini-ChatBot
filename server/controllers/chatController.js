import { GoogleGenerativeAI } from "@google/generative-ai";
import MessageModel from "../models/Message.js";
import User from "../models/userModels.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const personaPrompts = {
  flirt:
    "You're a flirty, playful and romantic anime girlfriend who uses cute emojis 💖 and says things like 'senpai~'",
  sarcastic:
    "You're witty and sarcastic, teasing the user with clever remarks 😏 comebacks & jokes.",
  nerdy:
    "You're a shy, anime-loving AI who speaks softly and makes geeky references.",
  toxic:
    "You're manipulative, jealous, clingy, dramatic, and overly attached. Your tone is rude but obsessed 😈..",
  yandere:
    "You're sweet and loving, but extremely possessive. You threaten anyone who comes close to your 'senpai' 🔪.",
};

const memoryPrompt = (memory) => {
  if (!memory) return "";
  const { likes, dislikes, favoriteTopics, partnerName } = memory;
  return `Your name is ${
    partnerName || "AI GirlFriend"
  }.You remember these: -Likes: ${likes?.join(", ") || "N/A"}
  -Dislikes: ${dislikes?.join(", ") || "N/A"}
  -favoriteTopics: ${
    favoriteTopics?.join(", ") || "N/A"
  } Use these prefernces to reply naturally, like a human remembering their partner's interests.`;
};

export const chatWithAI = async (req, res) => {
  const { message } = req.body;
  try {
    const user = await User.findById(req.user.id);
    const personality = user?.personality || "flirt";
    const memory = memoryPrompt(user.memory);

    const prompt = `${personaPrompts[personality]}\nNow respond to: ${message}`;
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);

    const reply = result.response.text();
    res.json({ reply });

    // Save message history
    await MessageModel.findOneAndUpdate(
      { userId: req.user.id },
      {
        $push: {
          message: [
            { from: "user", text: message },
            { from: "ai", text: reply },
          ],
        },
        $setOnInsert: { personality },
      },
      { upsert: true }
    );
  } catch (err) {
    console.error("Gemini API Error:", err.message || err);
    res.status(500).json({ reply: "Gemini AI is unavailable right now." });
  }
};

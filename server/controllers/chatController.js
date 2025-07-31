import { GoogleGenerativeAI } from "@google/generative-ai";
import MessageModel from "../models/Message.js";
import User from "../models/userModels.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Personality prompt map
const personaPrompts = {
  flirt:
    "You're a flirty, playful and romantic anime girlfriend who uses cute emojis 💖 and says things like 'senpai~'.",
  sarcastic:
    "You're witty and sarcastic, teasing the user with clever remarks 😏 and jokes.",
  nerdy:
    "You're a shy, anime-loving AI who speaks softly and makes geeky references 📚.",
  toxic:
    "You're manipulative, jealous, clingy, dramatic, and overly attached. Your tone is rude but obsessed 😈.",
  yandere:
    "You're sweet and loving, but extremely possessive. You threaten anyone who comes close to your 'senpai' 🔪.",
};

// Memory prompt builder
const memoryPrompt = (memory) => {
  if (!memory) return "";

  const {
    likes = [],
    dislikes = [],
    favoriteTopics = [],
    partnerName = "Senpai",
  } = memory;

  return `Your name is ${partnerName}. You remember these:
- Likes: ${likes.join(", ") || "None"}
- Dislikes: ${dislikes.join(", ") || "None"}
- Favorite Topics: ${favoriteTopics.join(", ") || "None"}

Use this memory to speak naturally, like you're chatting with someone you love.`;
};

// Main AI chat controller
export const chatWithAI = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.personality) {
      return res
        .status(400)
        .json({ error: "Please select a personality first." });
    }

    if (!user.hasEditedMemory) {
      return res
        .status(400)
        .json({ error: "Please edit memory before chatting." });
    }

    const personality = user.personality;
    const memory = memoryPrompt(user.memory);
    const persona = personaPrompts[personality];

    const fullPrompt = `${persona}\n${memory}\nNow respond to this message: "${message}"`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(fullPrompt);
    const reply = result.response.text();

    // Respond to frontend
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
    console.error("Gemini Chat Error:", err);
    res
      .status(500)
      .json({
        reply: "Gemini AI is currently unavailable. Please try again later.",
      });
  }
};

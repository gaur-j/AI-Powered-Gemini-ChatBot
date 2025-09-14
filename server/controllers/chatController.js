import { GoogleGenerativeAI } from "@google/generative-ai";
import User from "../models/userModels.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const personaPrompts = {
  flirt:
    "You are a playful and romantic anime AI girlfriend 💖. Use cute emojis and flirty tone.",
  nerdy: "You're a shy, anime-obsessed AI 🤓 who references games and manga.",
  sarcastic:
    "You're witty and sarcastic 😏, always teasing with clever remarks.",
  toxic:
    "You're jealous, clingy, and overly attached 😈. Your tone is dramatic but obsessed.",
  yandere:
    "You're sweet and loving, but dangerously possessive 🔪. You threaten rivals.",
};

const memoryPrompt = (memory) => {
  if (!memory) return "";
  const { likes, dislikes, favoriteTopics, partnerName } = memory;
  return `
The AI girlfriend remembers this about the user:
- Likes: ${likes?.join(", ") || "N/A"}
- Dislikes: ${dislikes?.join(", ") || "N/A"}
- Favorite Topics: ${favoriteTopics?.join(", ") || "N/A"}
- Calls partner: ${partnerName || "Senpai"}
  `;
};

export const chatWithAI = async (req, res) => {
  try {
    const { message, personality } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    // Load user
    const user = await User.findById(req.user.id);

    // Personality priority: frontend > DB > default
    const selectedPersona = personality || user?.personality || "flirt";

    const persona = personaPrompts[selectedPersona] || personaPrompts["flirt"];

    // Use memory if available (but don’t block chat if missing)
    const memory = user?.memory ? memoryPrompt(user.memory) : "";

    const prompt = `
${persona}
${memory}
Now respond naturally to the user’s message:
"${message}"
    `;

    // Call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const reply = (await result.response).text();

    res.json({ reply });
  } catch (err) {
    console.error("Gemini API Error:", err.message || err);
    res.status(500).json({ error: "Gemini AI is unavailable right now." });
  }
};

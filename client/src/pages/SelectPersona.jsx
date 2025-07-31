import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../components/AuthContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const personalities = [
  { name: "flirty", desc: "Playful and romantic", emoji: "💖" },
  { name: "nerdy", desc: "Anime lover and shy", emoji: "🤓" },
  { name: "toxic", desc: "Jealous and possessive", emoji: "😈" },
  { name: "sarcastic", desc: "Clever and teasing", emoji: "😏" },
  { name: "yandere", desc: "Sweet... but dangerous", emoji: "🔪" },
];

const SelectPersona = () => {
  const { backendUrl, token, setUser, user } = useContext(AuthContext);
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.personality) setSelected(user.personality);
  }, [user]);

  const savePersonality = async () => {
    try {
      await axios.put(
        `${backendUrl}/api/users/personality`,
        { personality: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const res = await axios.get(`${backendUrl}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      if (res.data.hasEditedMemory) {
        navigate("/chats");
      } else {
        navigate("/edit-memory");
      }
      navigate("/chats");
    } catch (error) {
      console.error("Error saving personality:", error);
    }
  };

  const current = personalities.find((p) => p.name === selected);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f7fa] to-[#fce4ec] p-8">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
        Choose Your AI Girlfriend's Personality
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {personalities.map((p) => (
          <button
            key={p.name}
            onClick={() => setSelected(p.name)}
            className={`p-5 rounded-lg border text-left shadow-md transform transition-transform duration-200 hover:scale-105 ${
              selected === p.name
                ? "bg-blue-100 border-blue-600 ring-2 ring-blue-400"
                : "bg-white border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center w-12 h-12 text-2xl rounded-full bg-gray-200">
                {p.emoji}
              </span>
              <h2 className="text-lg font-bold capitalize text-gray-800">
                {p.name}
              </h2>
            </div>
            <p className="text-sm text-gray-600">{p.desc}</p>
          </button>
        ))}
      </div>

      {/* 🔮 Live Preview */}
      <div className="mt-10 text-center">
        <p className="text-lg text-gray-700">
          You're about to chat with a{" "}
          <span className="font-bold text-blue-600 capitalize">{selected}</span>{" "}
          {current?.emoji}
        </p>
      </div>

      {/* ✅ Save Button */}
      <button
        onClick={savePersonality}
        className="mt-6 w-full bg-[#35c9ff] text-white font-bold py-3 rounded-lg text-lg hover:bg-[#00bbff] transition"
      >
        Save & Start Chatting 💬
      </button>
    </div>
  );
};

export default SelectPersona;

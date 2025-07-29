import { useContext, useState } from "react";
import { AuthContext } from "../components/AuthContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const personalities = [
  { name: "flirty", desc: "Playful and romantic 💖" },
  { name: "nerdy", desc: "Anime lover and shy 🤓" },
  { name: "toxic", desc: "Jealous and possessive 😈" },
  { name: "sarcastic", desc: "Clever and teasing 😏" },
  { name: "yandere", desc: "Sweet... but dangerous 🔪" },
];

const SelectPersona = () => {
  const { backendUrl, token, setUser } = useContext(AuthContext);
  const [selected, setSelected] = useState("flirty");
  const navigate = useNavigate();

  const savePersonality = async () => {
    try {
      await axios.put(
        `${backendUrl}/api/users/personality`,
        { personality: selected },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate("/chats");
      setUser((prev) => ({ ...prev, personality: selected }));
    } catch (error) {
      console.error("Error saving personality:", error);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Choose Your AI Girlfriend's Personality
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {personalities.map((p) => (
          <button
            key={p.name}
            className={`p-4 border rounded text-left ${
              selected === p.name ? "bg-blue-100 border-blue-600" : "bg-white"
            }`}
            onClick={() => setSelected(p.name)}
          >
            <h2 className="text-lg font-semibold capitalize">{p.name}</h2>
            <p className="text-sm">{p.desc}</p>
          </button>
        ))}
      </div>
      <button
        className="mt-6 w-full bg-blue-600 text-white hover:bg-blue-700 py-2 rounded"
        onClick={savePersonality}
      >
        Save & Start Chatting
      </button>
    </div>
  );
};

export default SelectPersona;

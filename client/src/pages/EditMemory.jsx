import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../components/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const EditMemory = () => {
  const { backendUrl, token } = useContext(AuthContext);
  const [likes, setLikes] = useState("");
  const [dislikes, setDislikes] = useState("");
  const [favoriteTopics, setFavoriteTopics] = useState("");
  const [partnerName, setPartnerName] = useState("Senpai");
  const navigate = useNavigate();

  // Load existing memory
  useEffect(() => {
    const fetchMemory = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const m = res.data.memory || {};
        setLikes((m.likes || []).join(", "));
        setDislikes((m.dislikes || []).join(", "));
        setFavoriteTopics((m.favoriteTopics || []).join(", "));
        setPartnerName(m.partnerName || "Senpai");
      } catch (err) {
        console.error("Failed to load memory:", err);
      }
    };
    if (token) fetchMemory();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${backendUrl}/api/users/memory`,
        {
          likes: likes.split(",").map((s) => s.trim()),
          dislikes: dislikes.split(",").map((s) => s.trim()),
          favoriteTopics: favoriteTopics.split(",").map((s) => s.trim()),
          partnerName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate("/chats");
    } catch (err) {
      console.error("Failed to update memory:", err);
      // Optionally show toast or alert here
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Customize What Your AI Girlfriend Remembers 💖
      </h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white p-6 rounded shadow-md"
      >
        <label className="block mb-2 font-medium">What do you like?</label>
        <input
          value={likes}
          onChange={(e) => setLikes(e.target.value)}
          placeholder="e.g., anime, pizza, rain"
          className="w-full mb-4 p-2 border rounded"
        />

        <label className="block mb-2 font-medium">What do you dislike?</label>
        <input
          value={dislikes}
          onChange={(e) => setDislikes(e.target.value)}
          placeholder="e.g., loud music, liars"
          className="w-full mb-4 p-2 border rounded"
        />

        <label className="block mb-2 font-medium">
          Favorite conversation topics?
        </label>
        <input
          value={favoriteTopics}
          onChange={(e) => setFavoriteTopics(e.target.value)}
          placeholder="e.g., AI, gaming, astrology"
          className="w-full mb-4 p-2 border rounded"
        />

        <label className="block mb-2 font-medium">
          What should she call you?
        </label>
        <input
          value={partnerName}
          onChange={(e) => setPartnerName(e.target.value)}
          placeholder="e.g., Senpai, Boss, Gaurav"
          className="w-full mb-6 p-2 border rounded"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Save Memory & Chat
        </button>
      </form>
    </div>
  );
};

export default EditMemory;

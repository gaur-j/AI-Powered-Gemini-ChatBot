// EditMemory.jsx
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../components/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const EditMemory = () => {
  const { backendUrl, token } = useContext(AuthContext);
  const [likes, setLikes] = useState("");
  const [dislikes, setDislikes] = useState("");
  const [topics, setTopics] = useState("");
  const [partnerName, setPartnerName] = useState("Senpai");
  const navigate = useNavigate();

  // Load existing memory if available
  useEffect(() => {
    const fetchMemory = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const m = res.data.memory || {};
        setLikes((m.likes || []).join(", "));
        setDislikes((m.dislikes || []).join(", "));
        setTopics((m.favoriteTopics || []).join(", "));
        setPartnerName(m.partnerName || "Senpai");
      } catch (err) {
        console.error("Failed to load memory", err);
      }
    };
    if (token) fetchMemory();
  }, [backendUrl, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${backendUrl}/api/users/memory`,
        {
          likes: likes.split(",").map((s) => s.trim()),
          dislikes: dislikes.split(",").map((s) => s.trim()),
          favoriteTopics: topics.split(",").map((s) => s.trim()),
          partnerName,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/chats");
    } catch (err) {
      console.error("Failed to update memory", err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Edit Your Preferences 💖
      </h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white p-6 rounded shadow-md space-y-4"
      >
        <input
          value={likes}
          onChange={(e) => setLikes(e.target.value)}
          placeholder="Likes (comma separated)"
          className="w-full p-2 border rounded"
        />
        <input
          value={dislikes}
          onChange={(e) => setDislikes(e.target.value)}
          placeholder="Dislikes (comma separated)"
          className="w-full p-2 border rounded"
        />
        <input
          value={topics}
          onChange={(e) => setTopics(e.target.value)}
          placeholder="Favorite topics (comma separated)"
          className="w-full p-2 border rounded"
        />
        <input
          value={partnerName}
          onChange={(e) => setPartnerName(e.target.value)}
          placeholder="What should she call you?"
          className="w-full p-2 border rounded"
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Save Preferences
        </button>
      </form>
    </div>
  );
};

export default EditMemory;

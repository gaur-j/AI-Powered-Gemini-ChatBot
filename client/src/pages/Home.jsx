import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext.jsx";
import anime from "../assets/anime.jpg";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleSelectPersona = () => navigate("/select-persona");
  const handleChat = () => navigate("/chats");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 px-4 text-center">
      <img
        src={anime}
        alt="Anime Girl"
        className="max-w-lg border max-h-28 items-center justify-center rounded-lg border-black shadow-xl"
      />
      <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
        Welcome{user?.username && `, ${user.username}`}! 💬
      </h1>
      <p className="text-lg text-gray-600 mb-10 max-w-md">
        Ready to chat with your AI girlfriend? Choose her personality or jump
        right in!
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <button
          onClick={handleChat}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          💌 Start Chatting
        </button>
        <button
          onClick={handleSelectPersona}
          className="w-full px-6 py-3 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600 transition"
        >
          🎭 Select Personality
        </button>
      </div>
    </div>
  );
};

export default Home;

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext.jsx";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handlePersona = () => {
    navigate("/chats");
  };

  const handleChat = () => {
    navigate("/chats");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">
        Welcome to AI Chat
        {user?.username && (
          <span className="mx-2 md:flex-row flex-col">{user.username}</span>
        )}
      </h1>
      <div className="space-x-4">
        <button
          onClick={handleChat}
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Chat
        </button>
        <button
          onClick={handlePersona}
          className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Select Personality
        </button>
      </div>
    </div>
  );
};

export default Home;

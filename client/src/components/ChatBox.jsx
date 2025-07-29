import { useEffect, useState, useRef, useContext } from "react";
import { AuthContext } from "../components/AuthContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [micTimer, setMicTimer] = useState(0);
  const [listening, setListening] = useState(false);
  const timeRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { backendUrl, token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ Initialize speech recognition (Chrome only)
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const startVoiceInput = () => {
    if (!recognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    setListening(true);
    setMicTimer(0);
    timeRef.current = setInterval(() => {
      setMicTimer((prev) => prev + 1);
    }, 1000);

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();

    recognition.onresult = (e) => {
      const spokenText = e.results[0][0].transcript;
      setInput(spokenText);
      stopVoiceInput();
    };

    recognition.onerror = (e) => {
      console.error("Speech recognition error:", e.error);
      alert(`Speech Error: ${e.error}`);
      stopVoiceInput();
    };
  };

  const stopVoiceInput = () => {
    setListening(false);
    clearInterval(timeRef.current);
    if (recognition) recognition.stop();
  };

  // 🗣️ Speak AI reply using TTS
  const speakText = (text) => {
    if (!text || typeof text !== "string") return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    speechSynthesis.speak(utterance);
  };

  // ⛔ Redirect if no personality
  useEffect(() => {
    if (user && !user.personality) {
      navigate("/select-persona");
    }
  }, [user, navigate]);

  // 🔄 Load chat history & convert timestamps
  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/chats/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Fix Invalid Date issue
      const withDates = res.data.map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timeStamp),
      }));
      setMessages(withDates);
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✉️ Send chat message to backend
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/chats`,
        { message: input, personality: user?.personality || "flirt" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const aiMsg = {
        from: "ai",
        text: res.data.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      speakText(res.data.reply); // ✅ AI speaks
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg = {
        from: "ai",
        text: "Sorry, something went wrong.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }

    setLoading(false);
  };

  // ⏰ Format timestamp
  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleHome = () => {
    navigate("/");
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-4 bg-pink-50 overflow-hidden">
      {/* 💬 Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] px-3 py-2 rounded-xl text-sm break-words ${
              msg.from === "user"
                ? "bg-blue-600 text-white self-end ml-auto rounded-br-none"
                : "bg-gray-300 text-black self-start rounded-bl-none"
            }`}
          >
            {msg.text}
            <p
              className={`text-xs text-right mt-1${
                msg.from === "user" ? "text-white" : "text-gray-500"
              }`}
            >
              {formatTime(msg.timestamp)}
            </p>
          </div>
        ))}
        {loading && (
          <div className="text-sm text-gray-500">Your girl is typing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ✍️ Input Field */}
      <form onSubmit={sendMessage} className="flex gap-2 items-center">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded p-2"
          placeholder="Type your message..."
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Send
        </button>
        <button
          onClick={startVoiceInput}
          type="button"
          className="text-2xl px-2"
        >
          🎤
        </button>
      </form>

      {/* 🎙️ Listening UI */}
      {listening && (
        <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
          <span className="animate-ping h-2 w-2 bg-blue-600 rounded-full" />
          Listening... {micTimer}s
          <button
            onClick={stopVoiceInput}
            className="text-red-600 hover:text-red-800 ml-2"
          >
            ⏹️ Stop
          </button>
        </div>
      )}

      {/* 🏠 Home Button */}
      <button
        onClick={handleHome}
        className="mt-4 bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
      >
        Home
      </button>
    </div>
  );
};

export default ChatBox;

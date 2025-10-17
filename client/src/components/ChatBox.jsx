// ChatBox.jsx
import { useEffect, useState, useRef, useContext } from "react";
import { AuthContext } from "../components/AuthContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoSend, IoStop, IoMic } from "react-icons/io5";
import Girl from "../assets/anime.jpg";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [micTimer, setMicTimer] = useState(0);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [voices, setVoices] = useState([]);
  const messagesEndRef = useRef(null);
  const timerRef = useRef(null);

  const { backendUrl, token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  // TTS
  const speakText = (text) => {
    if (!ttsEnabled || !text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.voice =
      voices.find((v) => v.name.toLowerCase().includes("female")) || voices[0];
    speechSynthesis.speak(utterance);
  };

  // Voice input
  const startVoiceInput = () => {
    if (!recognition) return alert("Speech recognition not supported.");
    setListening(true);
    setMicTimer(0);
    timerRef.current = setInterval(() => setMicTimer((t) => t + 1), 1000);
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setInput(text);
      stopVoiceInput();
    };

    recognition.onerror = () => stopVoiceInput();
  };

  const stopVoiceInput = () => {
    setListening(false);
    clearInterval(timerRef.current);
    recognition?.stop();
  };

  useEffect(() => {
    const loadVoices = () => setVoices(window.speechSynthesis.getVoices());
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Check user profile before chat
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const u = res.data;
        if (!u.personality) navigate("/select-persona");
        else if (!u.memory || !u.memory.partnerName) navigate("/edit-memory");
      } catch (err) {
        navigate("/login");
      }
    };
    checkUser();
  }, [backendUrl, token, navigate]);

  // Fetch chat history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/chats/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(
          res.data.map((m) => ({ ...m, timestamp: new Date(m.timeStamp) }))
        );
      } catch (err) {
        console.error("History error", err);
      }
    };
    fetchHistory();
  }, []);

  // ✅ Send message (no personality here anymore)
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/chat`,
        { message: userMsg.text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const aiMsg = { from: "ai", text: res.data.reply, timestamp: new Date() };
      setMessages((prev) => [...prev, aiMsg]);
      speakText(res.data.reply);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "⚠️ Chat failed", timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Header */}
      <div className="w-full p-3 flex justify-between items-center bg-black/50 border-b border-gray-700">
        <h1 className="text-lg font-semibold">
          Chat with {user?.personality || "AI"}
        </h1>
        <button
          onClick={() => navigate("/edit-memory")}
          className="bg-pink-600 hover:bg-pink-700 px-3 py-1 rounded text-sm"
        >
          Edit Preferences
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.from === "ai" && (
              <img
                src={Girl}
                alt="AI Avatar"
                className="w-8 h-8 rounded-full"
              />
            )}
            <div
              className={`max-w-[75%] px-4 py-2 rounded-xl shadow text-sm break-words ${
                msg.from === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.text}
              <div className="text-xs mt-1 text-right opacity-70">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <p className="text-gray-400 italic">AI girlfriend typing…</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="p-3 flex gap-2 bg-black/60 border-t border-gray-700"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-3 py-2 rounded bg-gray-100 text-black"
          placeholder="Type your message..."
        />
        <button type="submit" className="bg-blue-600 p-2 rounded text-white">
          <IoSend size={20} />
        </button>
        <button type="button" onClick={startVoiceInput} className="text-xl">
          <IoMic />
        </button>
      </form>

      {listening && (
        <div className="bg-blue-200 text-blue-900 text-sm p-2 flex justify-center items-center gap-2">
          Listening... {micTimer}s
          <button onClick={stopVoiceInput} className="ml-2 text-red-600">
            <IoStop />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatBox;

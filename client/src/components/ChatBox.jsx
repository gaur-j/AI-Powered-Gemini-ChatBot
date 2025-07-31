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

  // Text-to-speech
  const speakText = (text) => {
    if (!ttsEnabled || !text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.voice = chooseVoice(user?.personality);
    speechSynthesis.speak(utterance);
  };

  const chooseVoice = (personality) => {
    const lower = (s) => s?.toLowerCase();
    if (!voices.length) return null;
    return voices.find((v) => lower(v.name).includes("female")) || voices[0];
  };

  // Speech recognition
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

    recognition.onerror = (e) => {
      console.error("Speech error:", e.error);
      stopVoiceInput();
    };
  };

  const stopVoiceInput = () => {
    setListening(false);
    clearInterval(timerRef.current);
    recognition?.stop();
  };

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch history
  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/chats/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const withDates = res.data.map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timeStamp),
      }));
      setMessages(withDates);
    } catch (err) {
      console.error("Chat history load error:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (user && !user.personality) navigate("/select-persona");
  }, [user]);

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
        { message: input, personality: user?.personality || "flirty" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const aiMsg = { from: "ai", text: res.data.reply, timestamp: new Date() };
      setMessages((prev) => [...prev, aiMsg]);
      speakText(res.data.reply);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "Something went wrong.", timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* Header */}
      <div className="w-full p-3 flex items-center justify-between bg-black/50 backdrop-blur border-b border-gray-700">
        <h1 className="text-lg font-semibold">
          Chat with {user?.personality || "AI"}
        </h1>
        <label className="text-sm flex items-center gap-2">
          🔊 Voice
          <input
            type="checkbox"
            checked={ttsEnabled}
            onChange={() => setTtsEnabled((v) => !v)}
            aria-label="Toggle TTS"
          />
        </label>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-end gap-2 ${
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
              className={`max-w-[75%] px-4 py-2 rounded-xl text-sm break-words shadow ${
                msg.from === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-200 text-black rounded-bl-none"
              }`}
            >
              {msg.text}
              <div
                className={`text-xs text-right mt-1 ${
                  msg.from === "user" ? "text-white/70" : "text-gray-500"
                }`}
              >
                {formatTime(msg.timestamp)}
              </div>
            </div>
            {msg.from === "user" && (
              <div className="w-8 h-8 rounded-full bg-blue-500 text-center flex items-center justify-center text-white">
                🧑
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-8 h-8 rounded-full bg-pink-200 text-center text-xl">
              🤖
            </div>
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <form
        onSubmit={sendMessage}
        className="sticky bottom-0 w-full bg-black/60 backdrop-blur-md border-t border-gray-700 p-3 flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-lg bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-white"
          aria-label="Send"
        >
          <IoSend size={20} />
        </button>
        <button
          type="button"
          onClick={startVoiceInput}
          className="text-white text-xl px-2"
          aria-label="Start voice input"
        >
          <IoMic />
        </button>
      </form>

      {/* Mic listening bar */}
      {listening && (
        <div className="bg-blue-100 text-blue-800 text-sm p-2 text-center flex justify-center items-center gap-2">
          <span className="animate-ping w-2 h-2 bg-blue-600 rounded-full"></span>
          Listening... {micTimer}s
          <button onClick={stopVoiceInput} className="ml-4 text-red-600">
            <IoStop />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatBox;

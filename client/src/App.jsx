import { useContext } from "react";
import { ToastContainer } from "react-toastify";
import { AuthContext } from "./components/AuthContext.jsx"; // ✅ Correct import
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import ChatBox from "./components/ChatBox.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import SelectPersona from "./pages/SelectPersona.jsx";
import EditMemory from "./pages/EditMemory.jsx";

const App = () => {
  const { token } = useContext(AuthContext); // ✅ Now using correct context

  return (
    <div className="h-screen">
      <ToastContainer />
      {!token ? (
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <>
          <Navbar />
          <Routes>
            <Route path="/select-persona" element={<SelectPersona />} />
            <Route path="/edit-memory" element={<EditMemory />} />
            <Route path="/" element={<Home />} />
            <Route path="/chats" element={<ChatBox />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </>
      )}
    </div>
  );
};

export default App;

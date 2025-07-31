import axios from "axios";
import cookie from "js-cookie";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [token, setToken] = useState(cookie.get("token") || null);
  const [user, setUser] = useState(null);

  // Set token to axios default
  useEffect(() => {
    const t = cookie.get("token");
    if (t) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${t}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const handleRegister = async (username, email, password) => {
    try {
      const user = { username, email, password };

      const res = await axios.post(`${backendUrl}/api/users/register`, user, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data.token) {
        cookie.set("token", res.data.token, { expires: 7 });
        setToken(res.data.token);
        setUser(res.data.user);
        toast.success("Registered successfully!");

        // 🚨 Check for personality and memory before allowing access to chats
        if (!res.data.user.personality) {
          navigate("/select-persona");
        } else if (!res.data.user.hasEditedMemory) {
          navigate("/edit-memory");
        } else {
          navigate("/chats");
        }
      }
    } catch (err) {
      console.log(err);
      const message = err.response?.data?.message || "Register failed";
      toast.error(message);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const res = await axios.post(`${backendUrl}/api/users/login`, {
        email,
        password,
      });

      if (res.data.token) {
        cookie.set("token", res.data.token, { expires: 7 });
        setToken(res.data.token);
        setUser(res.data.user);
        toast.success("Login successful!");

        // 🚨 Follow the same gated flow
        if (!res.data.user.personality) {
          navigate("/select-persona");
        } else if (!res.data.user.hasEditedMemory) {
          navigate("/edit-memory");
        } else {
          navigate("/chats");
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Login failed");
    }
  };

  const logout = () => {
    cookie.remove("token");
    setToken(null);
    setUser(null);
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        backendUrl,
        token,
        setToken,
        user,
        setUser,
        handleLogin,
        handleRegister,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;

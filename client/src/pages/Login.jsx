import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext.jsx";
import HoverCard from "@darenft/react-3d-hover-card";
import "@darenft/react-3d-hover-card/dist/style.css";
import { FaFacebook, FaGoogle, FaApple } from "react-icons/fa";
import Back from "../assets/card.png";
import Microsoft from "../assets/microsoft.png";
import Google from "../assets/google.png";
import anime from "../assets/anime.jpg";

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin } = useContext(AuthContext);

  const [userFormData, setUserFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(userFormData.email, userFormData.password);
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen translate text-white px-4">
      {/* 3D Image Hover */}
      <div className="hidden lg:flex w-1/2 items-center justify-center transition">
        <HoverCard scaleFactor={2.4}>
          <img
            src={anime}
            alt="Anime"
            className="max-w-lg border max-h-12 items-center justify-center rounded-lg border-gray-50 shadow-xl"
          />
          <img
            src={Back}
            alt="Logo Art"
            className="max-w-lg min-h-100 border items-center justify-center rounded-lg border-gray-50 shadow-xl"
          />
        </HoverCard>
      </div>

      <div className="w-full max-w-md bg-[#1b1c1f] p-6 rounded-xl shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="email"
            value={userFormData.email}
            onChange={handleChange}
            placeholder="Username, Email or Phone"
            className="w-full p-3 rounded bg-[#2a2b2e] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="password"
            name="password"
            value={userFormData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 rounded bg-[#2a2b2e] text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
          >
            Log In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-700" />
          <span className="px-3 text-sm text-gray-500">OR</span>
          <hr className="flex-1 border-gray-700" />
        </div>

        {/* Social Icons */}
        <div className="flex justify-evenly gap-6 text-2xl text-gray-400">
          <FaFacebook className="cursor-pointer hover:text-blue-600" />
          <FaGoogle className="cursor-pointer hover:text-red-500" />
          <FaApple className="cursor-pointer hover:text-white" />
        </div>

        {/* Forgot Password */}
        <a
          href="#"
          className="block text-sm text-center mt-4 text-gray-400 hover:underline"
        >
          Forgot Password?
        </a>

        {/* Sign Up */}
        <div className="mt-6 text-center text-sm text-gray-400">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Sign Up
          </span>
        </div>

        {/* Get the App */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-2">Get the App</p>
          <div className="flex justify-center gap-4">
            <img
              src={Google}
              alt="Google Play"
              className="w-28 md:w-32 h-10 cursor-pointer hover:scale-105 transition"
            />
            <img
              src={Microsoft}
              alt="Microsoft Store"
              className="w-28 md:w-32 h-10 cursor-pointer hover:scale-105 transition"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

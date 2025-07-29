import { useContext, useState } from "react";
import { AuthContext } from "../components/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();

  const { handleLogin } = useContext(AuthContext);
  const [userFormData, setUserFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setUserFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(userFormData.email, userFormData.password);
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen text-white p-6">
      <div className="flex-1 max-w-md mx-4 sm:mx-auto p-4 border border-gray-500 rounded-xl">
        <div className="rounded-lg p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={userFormData.email}
              name="email"
              onChange={handleChange}
              placeholder="username, email, ph.no"
              className="w-full p-3 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring focus:ring-blue-500"
            />
            <input
              type="password"
              value={userFormData.password}
              name="password"
              onChange={handleChange}
              placeholder="password"
              className="w-full p-3 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-bold"
            >
              Log In
            </button>
          </form>
          <div className="flex items-center my-4">
            <hr className="flex-1 border-gray-700" />
            <span className="px-2 text-gray-500">OR</span>
            <hr className="flex-1 border-gray-700" />
          </div>
          <div className="py-3 rounded-lg flex flex-row items-center justify-evenly space-x-2">
            <FaFacebook className="text-3x1 cursor-pointer" />
            <FaGoogle className="text-3x1 cursor-pointer" />
            <FaApple className="text-3x1 cursor-pointer" />
          </div>
          <div className="mt-4 text-gray-400 rounded-lg text-center p-4">
            Don&apos;t Have an Account? {""}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Sign Up
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext.jsx";
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleHome = () => {
    navigate("/");
  };

  return (
    <nav className="bg-neutral-900 text-white px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo & Brand */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={handleHome}
        >
          <img
            src={logo}
            alt="logo"
            className="w-8 h-8 hover:scale-105 transition-transform"
          />
          <span className="text-xl font-semibold tracking-tight text-white">
            AI <span className="text-pink-400">GF 💖</span>
          </span>
        </div>

        {/* Username and Logout */}
        <div className="flex items-center gap-4">
          {user?.username && (
            <span className="text-sm text-gray-300 hidden sm:inline">
              @{user.username}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1.5 rounded-md transition-all shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="p-3 flex md:flex-row flex-col bg-black text-white justify-between min-w-full">
      <h1 className="font-bold text-xl">AI GF 💖</h1>
      {user?.username && (
        <span className="mx-2 text-white md:flex-row flex-col">
          @{user.username}
        </span>
      )}

      <button
        onClick={handleLogout}
        className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;

import React, { useContext, useEffect, useState, useRef } from "react";
import LoginForm from "../authForms/loginForm";
import { AuthContext } from "../../contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import RegisterForm from "../authForms/registerForm";

const Navbar = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const registerModalRef = useRef(null);

  const [slidebarOpen, setIsSlideBarOpen] = useState(false);
  const { currentUser, refreshLoginContext, setLoading, loading } =
    useContext(AuthContext);
  const navigate = useNavigate();

  const handleLoginToggle = () => {
    setIsLogin((prev) => !prev);
  };

  const handleRegisterToggle = () => {
    setIsRegister((prev) => !prev);
  };

  // Handle click outside for both dropdown and register modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close register modal if clicking outside
      if (isRegister && registerModalRef.current && !registerModalRef.current.contains(event.target)) {
        setIsRegister(false);
      }
      // Close dropdown if clicking outside
      if (isDropdownOpen && !event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isRegister, isDropdownOpen]);

  const handleLogout = async () => {
    setError("");
    await setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/logout",
        {},
        { withCredentials: true }
      );

      if (response?.data?.success) {
        await refreshLoginContext();
        await setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Logout failed");
      setLoading(false);
    }
  };

  const handleNavigationToProfile = (id) => {
    navigate(`/user/${id}`);
    setIsDropdownOpen(false);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    refreshLoginContext();
  }, []);

  const toggleSlideBar = () => {
    setIsSlideBarOpen((prev) => !prev);
  };

  return (
    <nav className="w-full h-20 bg-[#ffffff] border-b shadow-sm border-gray-200 flex items-center px-4 justify-between">
      <div className="flex items-center space-x-4">
        <svg
          className="w-5 h-5 text-gray-600 hover:text-gray-600 cursor-pointer"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            d="M3 12h18M3 6h18M3 18h18"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div className="flex items-center space-x-2">
          <span className="text-gray-700 font-semibold">Propulso</span>
        </div>
      </div>

      {currentUser && (
        <div className="flex items-center space-x-4">
          <svg
            className="w-5 h-5 text-gray-800 hover:text-gray-600 cursor-pointer"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>

          <div className="relative dropdown-container">
            <div
              onClick={handleDropdownToggle}
              className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer"
            >
              <span className="text-white text-sm font-medium">
                {currentUser?.name?.charAt(0).toUpperCase()}
              </span>
            </div>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-md z-50">
                <div className="px-4 py-2 text-sm font-semibold text-gray-700 rounded-t-lg">
                  {currentUser?.email}
                </div>
                <div
                  onClick={() => handleNavigationToProfile(currentUser?.id)}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer"
                >
                  Profile
                </div>
                <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer">
                  Settings
                </div>
                <div
                  onClick={() => handleLogout()}
                  className="px-4 py-2 text-sm text-red-600 hover:bg-gray-200 cursor-pointer"
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isLogin && !isRegister && <LoginForm setIsLogin={setIsLogin} />}
      {isRegister && !isLogin && (
        <div ref={registerModalRef} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <RegisterForm setIsRegister={setIsRegister} />
          </div>
        </div>
      )}

      {!currentUser && (
        <div className="flex items-center space-x-2">
          <div
            onClick={() => handleRegisterToggle()}
            className="px-5 py-1.5 cursor-pointer text-white rounded-md text-sm flex justify-center items-center bg-blue-700"
          >
            <p>Register</p>
          </div>
          <div
            onClick={() => navigate('/auth')}
            className="px-5 cursor-pointer text-white py-1.5 rounded-md text-sm flex justify-center items-center hover:bg-gray-700 bg-gray-800"
          >
            <p>Login</p>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

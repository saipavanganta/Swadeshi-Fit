// src/components/NavBar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  FaUser,
  FaSignOutAlt,
  FaShoppingCart,
  FaChartLine,
  FaHome,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Sync with localStorage for immediate updates
  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      } else {
        setCurrentUser(null);
      }
    };

    // Check immediately
    checkUser();

    // Listen for auth changes
    const handleAuthChange = () => {
      checkUser();
    };

    window.addEventListener("authStateChanged", handleAuthChange);

    // Also check on route changes
    const interval = setInterval(checkUser, 500);

    return () => {
      window.removeEventListener("authStateChanged", handleAuthChange);
      clearInterval(interval);
    };
  }, []);

  // Use either AuthContext user or localStorage user
  const displayUser = user || currentUser;

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Public links - shown when not logged in
  const publicLinks = [
    {
      path: "/",
      label: "Home",
      icon: <FaHome />,
      color: "from-orange-500 to-yellow-500",
    },
  ];

  // Protected links - shown when logged in
  const protectedLinks = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <FaChartLine />,
      color: "from-orange-500 to-yellow-500",
    },
    {
      path: "/products",
      label: "Shop",
      icon: <FaShoppingCart />,
      color: "from-purple-500 to-pink-400",
    },
    {
      path: "/activities",
      label: "Activities",
      icon: "🏃",
      color: "from-green-500 to-emerald-400",
    },
    {
      path: "/blogs",
      label: "Blogs",
      icon: "📝",
      color: "from-blue-500 to-cyan-400",
    },
  ];

  // Determine which links to show based on auth status
  const navLinks = displayUser ? protectedLinks : publicLinks;

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed w-full h-17 bg-[#f1f1f1] backdrop-blur-xl bg-opacity-95 text-[#000] shadow-2xl z-50 border-b border-gray-800">
      <div className="max-w-8xl mx-auto px-8 py-3 flex justify-between items-center">
        {/* Logo Section */}
        <div className="group cursor-pointer">
          <Link to="/" className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl rotate-45 shadow-lg shadow-orange-500/30 group-hover:rotate-90 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10 rounded-xl"></div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent tracking-tight group-hover:scale-105 transition-transform">
                SwadeshiFit
              </h1>
              <p className="text-xs bold text-[#000000] mt-1 font-mono tracking-wider">
                स्वदेशी पथ पर स्वस्थ कदम
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          {/* Main Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <div key={link.path} className="relative">
                <Link
                  to={link.path}
                  className="relative group"
                  onMouseEnter={() => setHoveredLink(link.path)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{link.icon}</span>
                    <span
                      className={`
                      text-base font-bold tracking-wide relative z-10
                      ${
                        isActive(link.path)
                          ? `bg-gradient-to-r ${link.color} bg-clip-text text-transparent`
                          : "text-[#000]"
                      }
                      group-hover:scale-105 transition-all duration-300
                    `}
                    >
                      {link.label}
                    </span>
                  </div>

                  {/* Animated Underline Effect */}
                  <div className="absolute -bottom-2 left-0 right-0 h-1 overflow-hidden">
                    <div
                      className={`
                      absolute inset-0 transform transition-transform duration-500 ease-out
                      ${
                        hoveredLink === link.path || isActive(link.path)
                          ? "translate-x-0 scale-x-100"
                          : "translate-x-full scale-x-0"
                      }
                    `}
                    >
                      <div
                        className={`h-full bg-gradient-to-r ${link.color} rounded-full shadow-lg`}
                      >
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          style={{
                            animation: "shimmer 2s infinite linear",
                            backgroundSize: "200% 100%",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {displayUser ? (
              <>
                

                {/* User Profile Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 rounded-lg bg-[#fff] hover:bg-gray-100 transition-colors border border-gray-300">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {displayUser.name?.charAt(0) || "U"}
                      </span>
                    </div>
                    <span className="text-sm font-semibold hidden md:block text-gray-800">
                      {displayUser.name?.split(" ")[0] || "User"}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 text-gray-800"
                    >
                      <FaUser className="text-gray-600" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 text-gray-800"
                    >
                      <FaChartLine className="text-gray-600" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors w-full text-left text-red-600"
                    >
                      <FaSignOutAlt className="text-red-500" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Login/Signup buttons */
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-white bg-[#000] border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors text-sm font-semibold"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-white bg-gradient-to-r from-orange-400 via-yellow-600 to-orange-500 rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all text-sm font-semibold"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <FaTimes className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-8 py-4 space-y-4">
            {/* Mobile Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive(link.path)
                    ? `bg-gradient-to-r ${link.color} text-white`
                    : "text-gray-800 hover:bg-gray-100"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-xl">{link.icon}</span>
                <span className="font-semibold">{link.label}</span>
              </Link>
            ))}

            {/* Mobile Auth Section */}
            {displayUser ? (
              <>
                <Link
                  to="/cart"
                  className="flex items-center gap-3 p-3 text-gray-800 hover:bg-gray-100 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaShoppingCart />
                  <span>Cart</span>
                  <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    0
                  </span>
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 p-3 text-gray-800 hover:bg-gray-100 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FaUser />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 text-red-600 hover:bg-gray-100 rounded-lg w-full text-left"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-4">
                <Link
                  to="/login"
                  className="p-3 text-center text-white bg-[#000] border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="p-3 text-center text-white bg-gradient-to-r from-orange-400 via-yellow-600 to-orange-500 rounded-lg hover:shadow-lg transition-all"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile USP Banner */}
      <div className="lg:hidden bg-gradient-to-r from-gray-800 to-gray-900 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-8 py-3 text-center">
          <span className="text-sm font-semibold bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
            🇮🇳 AI-Powered Traditional Fitness
          </span>
        </div>
      </div>

      {/* Add shimmer animation style */}
      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </nav>
  );
}

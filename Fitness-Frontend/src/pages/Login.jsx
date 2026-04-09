// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // API Configuration
  const API = axios.create({
    baseURL: "https://swadeshi-fit-backend.onrender.com/api/v1",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  // Backend Connection Function
  const handleLogin = async (e) => {
    e.preventDefault();

    setApiError("");

    if (!email.trim() || !password) {
      setApiError("Please enter both email and password");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setApiError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await API.post("/users/login", {
        email: email.trim().toLowerCase(),
        password: password,
      });

      const { user, accessToken, refreshToken } = response.data.data;

      // Use AuthContext login function
      await authLogin(user, { accessToken, refreshToken });

      // Redirect based on profile completion
      if (user?.isProfileComplete) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/complete-profile", { replace: true });
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "Login failed. Please try again.";

        if (error.response.status === 400) {
          if (errorMessage.includes("does not exist")) {
            setApiError("No account found with this email. Please sign up.");
          } else if (errorMessage.includes("password")) {
            setApiError("Incorrect password. Please try again.");
          } else {
            setApiError(errorMessage);
          }
        } else {
          setApiError(errorMessage);
        }
      } else if (error.request) {
        setApiError("No response from server. Please check your connection.");
      } else {
        setApiError("An error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (apiError) setApiError("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ffffff] flex items-center justify-center">
        <div className="relative">
          <div className="w-10 h-10 border-4 my-10 border-t-orange-500 border-b-yellow-500 border-transparent rounded-full animate-spin"></div>
          <div
            className="absolute inset-0 w-16 h-16 border-4 border-transparent border-l-orange-500 border-r-yellow-500 rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#ffffff] text-white overflow-hidden">
      {/* Background Animated Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-60 h-60 bg-gradient-to-r from-orange-500/5 to-yellow-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-32 w-60 h-60 bg-gradient-to-r from-red-500/5 to-orange-500/5 rounded-full blur-3xl"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:50px_50px]"></div>
        </div>
      </div>

      <div className="container mx-auto ml-40 px-4 min-h-screen flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl ml-10 items-center">
          {/* Left Side - Brand & Animation */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Animated Logo */}
            <div className="relative w-65 h-65 mx-auto lg:mx-0">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl rotate-45 shadow-2xl shadow-orange-500/30"
                animate={{
                  rotate: [45, 405],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  rotate: { repeat: Infinity, duration: 8, ease: "linear" },
                  scale: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                }}
              >
                <div className="absolute inset-2 bg-gradient-to-tr from-transparent to-white/10 rounded-xl"></div>
              </motion.div>

              {/* Rotating Rings */}
              <motion.div
                className="absolute -inset-8 border-2 border-transparent border-t-orange-500 border-b-yellow-400 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              />

              <motion.div
                className="absolute -inset-12 border border-transparent border-l-orange-500 border-r-yellow-500 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 16, ease: "linear" }}
              />

              {/* Floating Particles */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full"
                  style={{
                    top: `${20 + i * 20}%`,
                    left: `${10 + i * 15}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    x: [0, 10, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2 + i * 0.5,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Brand Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center lg:text-left mt-12"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent mt-15 mb-4">
                SwadeshiFit
              </h1>
              <p className="text-[#000000] text-lg font-mono font-bold">
                स्वदेशी पथ पर स्वस्थ कदम
              </p>
              <p className="text-[#000000] bolder mt-4 text-l  max-w-md">
                Experience India's first traditional fitness platform. Where
                ancient wisdom meets modern technology for holistic wellness.
              </p>
            </motion.div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative h-158 mb-20 w-120 bg-[#000000] backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 shadow-2xl">
              {/* Top Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-t-2xl"></div>

              <div className="relative">
                {/* Error Message */}
                {apiError && (
                  <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-red-400 text-sm text-center">
                      {apiError}
                    </p>
                  </div>
                )}

                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                    Welcome Back
                  </h2>
                  <p className="text-[#fff] mt-2">Sign in to your account</p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-medium text-[#fff] mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={handleInputChange(setEmail)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-white placeholder-gray-500 transition duration-300"
                        required
                        disabled={isSubmitting}
                      />
                      <div className="absolute right-3 top-3">
                        <span className="text-gray-500">✉️</span>
                      </div>
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Password
                      </label>
                      <a
                        href="#"
                        className="text-sm text-orange-500 hover:text-orange-500 transition duration-300"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={handleInputChange(setPassword)}
                        placeholder="••••••••"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-white placeholder-gray-500 transition duration-300"
                        required
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-500 hover:text-gray-300 transition duration-300"
                        disabled={isSubmitting}
                      >
                        {showPassword ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      className="w-4 h-4 bg-gray-800 border-gray-700 rounded focus:ring-orange-500 focus:ring-offset-gray-900"
                      disabled={isSubmitting}
                    />
                    <label
                      htmlFor="remember"
                      className="ml-2 text-sm text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin h-5 w-5 mr-2 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Signing In...
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </button>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-gray-900/80 text-[#fff]">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Social Login */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="py-3 px-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-gray-700/50 transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    >
                      <span>𝕏</span>
                      <span className="text-sm">Twitter</span>
                    </button>
                    <button
                      type="button"
                      className="py-3 px-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:bg-gray-700/50 transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    >
                      <span>📷</span>
                      <span className="text-sm">Instagram</span>
                    </button>
                  </div>

                  {/* Signup Link */}
                  <div className="text-center mt-6">
                    <p className="text-[#fff]">
                      Don't have an account?{" "}
                      <Link
                        to="/signup"
                        className="text-orange-500 hover:text-orange-500 font-semibold transition duration-300"
                      >
                        Sign up now
                      </Link>
                    </p>
                  </div>
                </form>
              </div>

              {/* Bottom Corner Accents */}
              <div className="absolute bottom-4 left-4 w-2 h-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full opacity-50"></div>
              <div className="absolute bottom-4 right-4 w-2 h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full opacity-50"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

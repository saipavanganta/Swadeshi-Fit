import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState("");

  // New state for API handling
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  }, [password]);

  // API Configuration
  const API = axios.create({
    baseURL: "https://swadeshi-fit-backend.onrender.com/api/v1",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  // Backend Connection Function
  const handleSignup = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setApiError("");
    setApiSuccess("");

    // Validation
    if (password !== confirmPassword) {
      setApiError("Passwords don't match!");
      return;
    }

    if (passwordStrength < 50) {
      setApiError("Please use a stronger password");
      return;
    }

    if (!name.trim() || !email.trim()) {
      setApiError("All fields are required");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Sending signup request:", { name, email, password });

      const response = await API.post("/users/signup", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      });

      console.log("Signup successful:", response.data);

      setApiSuccess("Account created successfully! Redirecting to login...");

      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Signup error:", error);

      // Handle different error responses
      if (error.response) {
        // Server responded with error status
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "Signup failed. Please try again.";
        setApiError(errorMessage);

        // If user already exists, suggest login
        if (
          error.response.status === 400 &&
          errorMessage.includes("already exists")
        ) {
          setApiError("User already exists. Please login instead.");
        }
      } else if (error.request) {
        // Request was made but no response
        setApiError("No response from server. Please check your connection.");
      } else {
        // Other errors
        setApiError("An error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = () => {
    // Validate current step before proceeding
    if (step === 1) {
      if (!name.trim() || !email.trim() || !password) {
        setApiError("Please fill all required fields");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setApiError("Please enter a valid email address");
        return;
      }

      if (password.length < 6) {
        setApiError("Password must be at least 6 characters");
        return;
      }

      if (password !== confirmPassword) {
        setApiError("Passwords don't match");
        return;
      }

      setApiError(""); // Clear errors if validation passes
    }

    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setApiError(""); // Clear errors when going back
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength < 50) return "from-red-500 to-red-400";
    if (passwordStrength < 75) return "from-yellow-500 to-yellow-400";
    return "from-green-500 to-emerald-400";
  };

  // Add function to handle input changes and clear errors
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    // Clear error when user starts typing
    if (apiError) setApiError("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ffffff] flex items-center justify-center">
        <div className="relative">
          <div className="w-10 h-10 border-4 my-10 border-t-orange-500 border-b-yellow-400 border-transparent rounded-full animate-spin"></div>
          <div
            className="absolute inset-0 w-16 h-16 border-4 border-transparent border-l-orange-400 border-r-yellow-300 rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>
        </div>
      </div>
    );
  }

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "Free",
      features: ["Basic workouts", "Community access", "Weekly progress"],
    },
    {
      id: "pro",
      name: "Pro",
      price: "₹499/mo",
      features: [
        "AI Workouts",
        "Personalized plans",
        "Nutrition guide",
        "Priority support",
      ],
      popular: true,
    },
    {
      id: "premium",
      name: "Premium",
      price: "₹999/mo",
      features: [
        "All Pro features",
        "1-on-1 coaching",
        "Advanced analytics",
        "Custom plans",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f1f1f1f1] text-black overflow-hidden pt-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-32 w-60 h-60 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-32 w-60 h-60 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 min-h-screen flex items-center justify-center py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl items-center">
          {/* Left Side - Brand & Features */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Progress Steps */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex flex-col items-center">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center ${
                        step >= s
                          ? "bg-gradient-to-r from-orange-500 to-yellow-500"
                          : "bg-[#000000] border border-gray-700"
                      }`}
                    >
                      <span
                        className={`text-sm font-bold ${
                          step >= s ? "text-white" : "text-gray-400"
                        }`}
                      >
                        {s}
                      </span>
                    </div>
                    <span className="text-xs mt-1 text-gray-400">
                      {s === 1 ? "Account" : s === 2 ? "Plan" : "Complete"}
                    </span>
                  </div>
                ))}
                <div className="flex-1 h-1 bg-[#000000] mx-4 mt-4">
                  <div
                    className={`h-full bg-gradient-to-r from-orange-500 to-yellow-500 transition-all duration-500 ${
                      step === 2 ? "w-2/3" : step === 3 ? "w-full" : "w-1/3"
                    }`}
                  ></div>
                </div>
              </div>
            </div>

            {/* Brand Section */}
            <div className="mb-45">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg rotate-45"></div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                    Join SwadeshiFit
                  </h1>
                  <p className="text-xm text-[#000] font-mono">
                    Start your fitness journey today
                  </p>
                </div>
              </div>
              <p className="text-[#000] text-sm">
                Become part of India's premier AI-powered traditional fitness
                community.
              </p>
            </div>
          </motion.div>

          {/* Right Side - Signup Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative mb-40 bg-[#000] backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 shadow-2xl">
              {/* Top Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-t-xl"></div>

              <div className="relative">
                {/* API Error/Success Messages */}
                {apiError && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-red-400 text-sm text-center">
                      {apiError}
                    </p>
                  </div>
                )}

                {apiSuccess && (
                  <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                    <p className="text-green-400 text-sm text-center">
                      {apiSuccess}
                    </p>
                  </div>
                )}

                {/* Header */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
                    Create Account
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">Step {step} of 3</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-5">
                  {/* Step 1: Basic Info */}
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-5"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={handleInputChange(setName)}
                          placeholder="Enter your full name"
                          className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-white placeholder-gray-500 text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={handleInputChange(setEmail)}
                          placeholder="you@example.com"
                          className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-white placeholder-gray-500 text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={handleInputChange(setPassword)}
                            placeholder="Create a strong password"
                            className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-white placeholder-gray-500 text-sm"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-300 text-sm"
                          >
                            {showPassword ? "👁️" : "👁️‍🗨️"}
                          </button>
                        </div>

                        {password && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>Strength:</span>
                              <span>{passwordStrength}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${getStrengthColor()} transition-all duration-300`}
                                style={{ width: `${passwordStrength}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={handleInputChange(setConfirmPassword)}
                          placeholder="Re-enter your password"
                          className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-white placeholder-gray-500 text-sm"
                          required
                        />
                        {confirmPassword && password !== confirmPassword && (
                          <p className="text-red-400 text-xs mt-1">
                            Passwords do not match
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Choose Plan */}
                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-5"
                    >
                      <h3 className="text-lg font-semibold text-white text-center">
                        Choose Your Plan
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        {plans.map((plan) => (
                          <div
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan.id)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all duration-300 ${
                              selectedPlan === plan.id
                                ? "border-orange-500 bg-gradient-to-br from-orange-500/10 to-yellow-500/10"
                                : "border-gray-700 hover:border-gray-600"
                            }`}
                          >
                            {plan.popular && (
                              <div className="text-center mb-2">
                                <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-orange-500 to-yellow-500 text-[#000] rounded-full">
                                  Most Popular
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="font-bold text-white">
                                  {plan.name}
                                </h4>
                                <p className="text-sm text-gray-400">
                                  {plan.features[0]}, {plan.features[1]}
                                </p>
                              </div>
                              <p className="text-xl font-bold text-orange-400">
                                {plan.price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 text-center">
                        Start with Basic for free. Upgrade anytime!
                      </p>
                    </motion.div>
                  )}

                  {/* Step 3: Review & Complete */}
                  {step === 3 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-5"
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl">✓</span>
                        </div>
                        <h3 className="text-xl font-bold text-white">
                          Ready to Join!
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">
                          Review your information
                        </p>
                      </div>

                      <div className="bg-gray-800/30 rounded-xl p-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Name:</span>
                          <span className="text-white">{name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Email:</span>
                          <span className="text-white">{email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Plan:</span>
                          <span className="text-orange-400">
                            {plans.find((p) => p.id === selectedPlan)?.name ||
                              "Basic"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Terms & Submit */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="terms"
                        className="w-3.5 h-3.5 bg-gray-800 border-gray-700 rounded focus:ring-orange-500"
                        required
                      />
                      <label
                        htmlFor="terms"
                        className="ml-2 text-xs text-gray-300"
                      >
                        I agree to the{" "}
                        <a
                          href="#"
                          className="text-orange-400 hover:text-orange-300"
                        >
                          Terms
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          className="text-orange-400 hover:text-orange-300"
                        >
                          Privacy Policy
                        </a>
                      </label>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-3">
                      {step > 1 && (
                        <button
                          type="button"
                          onClick={handlePrevStep}
                          className="flex-1 py-2.5 px-4 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-700 transition duration-300 text-sm"
                          disabled={isSubmitting}
                        >
                          Back
                        </button>
                      )}

                      {step < 3 ? (
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="flex-1 py-2.5 px-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isSubmitting}
                        >
                          Continue
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="flex-1 py-2.5 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center justify-center">
                              <svg
                                className="animate-spin h-4 w-4 mr-2 text-white"
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
                              Creating Account...
                            </span>
                          ) : (
                            "Complete Signup"
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Login Link */}
                  <div className="text-center pt-4 border-t border-gray-800">
                    <p className="text-gray-400 text-sm">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="text-orange-400 hover:text-orange-300 font-semibold"
                      >
                        Sign in
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// src/components/CompleteProfile.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CompleteProfile() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  const navigate = useNavigate();

  // Form state matching your backend User model
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    phone: "",
    city: "",
    height: "",
    weight: "",
    sportsInterest: "",
    fitnessGoal: "",
  });

  // API Configuration
  const API = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  // Add authorization header
  API.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    // Check if user is logged in
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    }

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (apiError) setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setApiError("");
    setApiSuccess("");

    // Basic validation
    if (!formData.age || !formData.gender || !formData.city) {
      setApiError("Please fill all required fields (Age, Gender, City)");
      return;
    }

    if (formData.age < 10 || formData.age > 100) {
      setApiError("Please enter a valid age (10-100)");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Updating profile with data:", formData);

      const response = await API.post("/users/update-profile", formData);

      console.log("Profile update successful:", response.data);

      setApiSuccess(
        "Profile updated successfully! Redirecting to dashboard..."
      );

      // Update local storage user data
      const user = JSON.parse(localStorage.getItem("user"));
      const updatedUser = { ...user, ...formData, isProfileComplete: true };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Profile update error:", error);

      if (error.response?.status === 401) {
        setApiError("Session expired. Please login again.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        const errorMessage =
          error.response?.data?.message ||
          "Profile update failed. Please try again.";
        setApiError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const fitnessGoals = [
    "Weight Loss",
    "Muscle Gain",
    "Strength Training",
    "Endurance",
    "Flexibility",
    "Overall Fitness",
    "Sports Performance",
    "Rehabilitation",
  ];

  const sportsInterests = [
    "Yoga",
    "Cricket",
    "Football",
    "Badminton",
    "Swimming",
    "Running",
    "Cycling",
    "Martial Arts",
    "Weightlifting",
    "Calisthenics",
    "Dance",
    "Tennis",
    "Basketball",
    "Hiking",
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff] flex items-center justify-center">
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

  return (
    <div className="min-h-screen bg-[#fff] text-[#fff] overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-32 w-60 h-60 bg-gradient-to-r from-orange-500/5 to-yellow-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-32 w-60 h-60 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 min-h-screen flex items-center justify-center py-8">
        <div className="w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 z-50 flex items-center gap-2  font-extrabold text-[#fff] hover:text-orange-500 transition duration-300"
            >
              ← Back
            </button>

            <div className="relative bg-[#000] backdrop-blur-xl rounded-2xl border border-gray-200 p-8 shadow-2xl">
              {/* Top Gradient Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-t-2xl"></div>

              <div className="relative">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-[#fff]">🏋️</span>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent text-[#fff]">
                    Complete Your Profile
                  </h2>
                  <p className="text-[#fff] mt-2">
                    Help us personalize your fitness journey
                  </p>
                </div>

                {/* Error/Success Messages */}
                {apiError && (
                  <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-600 text-sm text-center">
                      {apiError}
                    </p>
                  </div>
                )}

                {apiSuccess && (
                  <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-green-600 text-sm text-center">
                      {apiSuccess}
                    </p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Age */}
                    <div>
                      <label className="block text-sm font-medium text-[#fff] mb-2">
                        Age *
                      </label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="Enter your age"
                        min="10"
                        max="100"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-black placeholder-gray-500 transition duration-300"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-medium text-[#fff] mb-2">
                        Gender *
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-black transition duration-300"
                        required
                        disabled={isSubmitting}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-[#fff] mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-black placeholder-gray-500 transition duration-300"
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium text-[#fff] mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter your city"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-black placeholder-gray-500 transition duration-300"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Height */}
                    <div>
                      <label className="block text-sm font-medium text-[#fff] mb-2">
                        Height (cm)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="height"
                          value={formData.height}
                          onChange={handleChange}
                          placeholder="Enter height in cm"
                          min="100"
                          max="250"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-black placeholder-gray-500 transition duration-300 pr-12"
                          disabled={isSubmitting}
                        />
                        <span className="absolute right-4 top-3 text-gray-600">
                          cm
                        </span>
                      </div>
                    </div>

                    {/* Weight */}
                    <div>
                      <label className="block text-sm font-medium text-[#fff] mb-2">
                        Weight (kg)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="weight"
                          value={formData.weight}
                          onChange={handleChange}
                          placeholder="Enter weight in kg"
                          min="30"
                          max="200"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-black placeholder-gray-500 transition duration-300 pr-12"
                          disabled={isSubmitting}
                        />
                        <span className="absolute right-4 top-3 text-gray-600">
                          kg
                        </span>
                      </div>
                    </div>

                    {/* Sports Interest */}
                    <div>
                      <label className="block text-sm font-medium text-[#fff] mb-2">
                        Sports Interest
                      </label>
                      <select
                        name="sportsInterest"
                        value={formData.sportsInterest}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-black transition duration-300"
                        disabled={isSubmitting}
                      >
                        <option value="">Select Sports Interest</option>
                        {sportsInterests.map((sport) => (
                          <option key={sport} value={sport}>
                            {sport}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Fitness Goal */}
                    <div>
                      <label className="block text-sm font-medium text-[#fff] mb-2">
                        Fitness Goal
                      </label>
                      <select
                        name="fitnessGoal"
                        value={formData.fitnessGoal}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 text-black transition duration-300"
                        disabled={isSubmitting}
                      >
                        <option value="">Select Fitness Goal</option>
                        {fitnessGoals.map((goal) => (
                          <option key={goal} value={goal}>
                            {goal}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* BMI Calculator (Optional) */}
                  {formData.height && formData.weight && (
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl">
                      <h3 className="font-semibold text-orange-700 mb-2">
                        Your BMI
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">
                            Height: {formData.height}cm | Weight:{" "}
                            {formData.weight}kg
                          </p>
                          <p className="text-lg font-bold text-orange-600 mt-1">
                            BMI:{" "}
                            {(
                              formData.weight /
                              (formData.height / 100) ** 2
                            ).toFixed(1)}
                          </p>
                        </div>
                        <div className="text-sm text-gray-600">
                          {(() => {
                            const bmi =
                              formData.weight / (formData.height / 100) ** 2;
                            if (bmi < 18.5) return "Underweight";
                            if (bmi < 25) return "Normal";
                            if (bmi < 30) return "Overweight";
                            return "Obese";
                          })()}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-6">
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
                          Saving Profile...
                        </span>
                      ) : (
                        "Complete Profile & Continue"
                      )}
                    </button>

                    <p className="text-xs text-gray-400 text-center mt-3">
                      * Required fields. You can update this information later.
                    </p>
                  </div>

                  {/* Skip for now option */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => navigate("/dashboard")}
                      className="text-sm text-gray-400 hover:text-gray-700 transition duration-300"
                    >
                      Skip for now →
                    </button>
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

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaBirthdayCake,
  FaVenusMars,
  FaDumbbell,
  FaRunning,
  FaEdit,
  FaSave,
  FaCamera,
  FaWeight,
  FaRulerVertical,
  FaHeartbeat,
  FaChartLine,
  FaHistory,
  FaTrophy,
  FaCog,
  FaLock,
} from "react-icons/fa";
import api from "../services/api";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    favoriteSport: "",
    fitnessLevel: "beginner",
    bio: "",
  });

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [stats, setStats] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const fitnessLevels = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "athlete", label: "Athlete" },
  ];

  const sports = [
    "Running",
    "Weightlifting",
    "Swimming",
    "Cycling",
    "Yoga",
    "Football",
    "Basketball",
    "Tennis",
    "Boxing",
    "CrossFit",
    "Martial Arts",
    "Dance",
    "Hiking",
    "Climbing",
  ];

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // Assuming you have a /profile endpoint
      const response = await api.get("/users/profile");
      const userData = response.data?.data || {};

      setProfile({
        name: userData.name || "",
        email: userData.email || "",
        age: userData.age || "",
        gender: userData.gender || "",
        weight: userData.weight || "",
        height: userData.height || "",
        favoriteSport: userData.favoriteSport || "",
        fitnessLevel: userData.fitnessLevel || "beginner",
        bio: userData.bio || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Get user stats from dashboard or specific endpoint
      const response = await api.get("/dashboard");
      setStats(response.data?.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      await api.put("/profile", profile);
      setIsEditing(false);
      alert("Profile updated successfully!");
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    try {
      await api.put("/profile/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
      alert("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      alert(error.response?.data?.message || "Failed to change password");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const response = await api.post("/profile/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setProfileImage(response.data?.imageUrl);
      alert("Profile picture updated!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center pt-24">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-t-orange-500 border-b-yellow-400 border-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white overflow-hidden pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
                My Profile
              </h1>
              <p className="text-slate-400 mt-2">
                Manage your account and fitness preferences
              </p>
            </div>

            <div className="flex gap-3">
              {isEditing ? (
                <button
                  onClick={handleUpdateProfile}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center gap-2"
                >
                  <FaSave />
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <FaEdit />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-6"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
                {/* Profile Image */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <FaUser className="text-white text-5xl" />
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-2 right-2 w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-slate-700 transition-colors">
                      <FaCamera />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {profile.name || "User Name"}
                  </h2>
                  <p className="text-slate-400 mb-4">{profile.email}</p>

                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300">
                      {profile.fitnessLevel
                        ? `${
                            profile.fitnessLevel.charAt(0).toUpperCase() +
                            profile.fitnessLevel.slice(1)
                          }`
                        : "Beginner"}
                    </span>
                    {profile.favoriteSport && (
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                        <FaRunning className="inline mr-1" />
                        {profile.favoriteSport}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      <FaUser className="inline mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 text-white disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      <FaEnvelope className="inline mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      <FaBirthdayCake className="inline mr-2" />
                      Age
                    </label>
                    <input
                      type="number"
                      value={profile.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      disabled={!isEditing}
                      min="1"
                      max="120"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 text-white disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      <FaVenusMars className="inline mr-2" />
                      Gender
                    </label>
                    <select
                      value={profile.gender}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 text-white disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">
                        Prefer not to say
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      <FaWeight className="inline mr-2" />
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={profile.weight}
                      onChange={(e) =>
                        handleInputChange("weight", e.target.value)
                      }
                      disabled={!isEditing}
                      min="0"
                      step="0.1"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 text-white disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      <FaRulerVertical className="inline mr-2" />
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={profile.height}
                      onChange={(e) =>
                        handleInputChange("height", e.target.value)
                      }
                      disabled={!isEditing}
                      min="0"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 text-white disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      <FaDumbbell className="inline mr-2" />
                      Favorite Sport
                    </label>
                    <select
                      value={profile.favoriteSport}
                      onChange={(e) =>
                        handleInputChange("favoriteSport", e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 text-white disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <option value="">Select Sport</option>
                      {sports.map((sport) => (
                        <option key={sport} value={sport}>
                          {sport}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      <FaChartLine className="inline mr-2" />
                      Fitness Level
                    </label>
                    <select
                      value={profile.fitnessLevel}
                      onChange={(e) =>
                        handleInputChange("fitnessLevel", e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 text-white disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {fitnessLevels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    disabled={!isEditing}
                    rows="3"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 text-white resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="Tell us about yourself, your fitness goals, and what motivates you..."
                  />
                </div>
              </form>
            </motion.div>

            {/* Stats Card */}
            {stats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <FaChartLine />
                  Your Fitness Stats
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stats.bmi && (
                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-orange-500 to-yellow-500">
                          <FaHeartbeat className="text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">BMI</p>
                          <p className="text-lg font-bold text-white">
                            {stats.bmi}
                          </p>
                          <p
                            className={`text-xs ${
                              stats.bmiStatus === "Normal"
                                ? "text-green-400"
                                : stats.bmiStatus === "Underweight"
                                ? "text-yellow-400"
                                : stats.bmiStatus === "Overweight"
                                ? "text-orange-400"
                                : "text-red-400"
                            }`}
                          >
                            {stats.bmiStatus || "Normal"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {profile.weight && (
                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500">
                          <FaWeight className="text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Weight</p>
                          <p className="text-lg font-bold text-white">
                            {profile.weight} kg
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {profile.height && (
                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-500">
                          <FaRulerVertical className="text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-400">Height</p>
                          <p className="text-lg font-bold text-white">
                            {profile.height} cm
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Settings & Actions */}
          <div className="space-y-6">
            {/* Account Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-6"
            >
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FaCog />
                Account Settings
              </h2>

              <div className="space-y-3">
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="w-full flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FaLock />
                    Change Password
                  </span>
                  <span className="text-slate-400">→</span>
                </button>

                <Link
                  to="/fitness-activity"
                  className="block p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FaHistory />
                      Activity History
                    </span>
                    <span className="text-slate-400">→</span>
                  </div>
                </Link>

                <Link
                  to="/fitness-tracker"
                  className="block p-3 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FaChartLine />
                      Progress Tracker
                    </span>
                    <span className="text-slate-400">→</span>
                  </div>
                </Link>
              </div>
            </motion.div>

            {/* Change Password Form */}
            {showPasswordForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-6"
              >
                <h3 className="text-lg font-bold text-white mb-4">
                  Change Password
                </h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 text-white"
                      required
                      minLength="6"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 text-white"
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setPasswordForm({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                      className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 rounded-2xl border border-purple-700/30 p-6"
            >
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FaTrophy />
                Your Achievements
              </h2>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <span className="text-yellow-400">🏃</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      First Workout
                    </p>
                    <p className="text-xs text-slate-400">
                      Completed your first activity
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-400">🔥</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      7-Day Streak
                    </p>
                    <p className="text-xs text-slate-400">
                      Consistent for 7 days
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-400">💪</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      Profile Complete
                    </p>
                    <p className="text-xs text-slate-400">
                      100% profile completion
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Account Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-6"
            >
              <h3 className="text-lg font-bold text-white mb-3">
                Account Status
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Member Since</span>
                  <span className="text-white">2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Account Type</span>
                  <span className="text-green-400">Premium</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Profile Completion</span>
                  <span className="text-white">85%</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

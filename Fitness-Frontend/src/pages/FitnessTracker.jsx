import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaFire,
  FaTint,
  FaBed,
  FaWalking,
  FaUtensils,
  FaChartLine,
  FaCalendarAlt,
  FaSave,
  FaEdit,
  FaPlus,
  FaHeartbeat,
  FaWeight,
  FaRulerVertical,
  FaBullseye,
} from "react-icons/fa";
import api from "../services/api";

export default function FitnessTracker() {
  const [trackerData, setTrackerData] = useState({
    steps: 0,
    waterLiters: 0,
    sleepHours: 0,
    caloriesConsumed: 0,
    date: new Date().toISOString().split("T")[0],
  });

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isEditing, setIsEditing] = useState(false);

  const dailyGoals = {
    steps: 10000,
    waterLiters: 3,
    sleepHours: 8,
    caloriesConsumed: 2500,
  };

  useEffect(() => {
    fetchTrackerData();
    fetchDashboardData();
  }, [selectedDate]);

  const fetchTrackerData = async () => {
    try {
      const response = await api.get(`/tracker?date=${selectedDate}`);
      const data = response.data?.data || {};
      setTrackerData({
        steps: data.steps || 0,
        waterLiters: data.waterLiters || 0,
        sleepHours: data.sleepHours || 0,
        caloriesConsumed: data.caloriesConsumed || 0,
        date: selectedDate,
      });
    } catch (error) {
      console.error("Error fetching tracker data:", error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/dashboard");
      setDashboardData(response.data?.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setTrackerData((prev) => ({
      ...prev,
      [field]: Math.max(0, value),
    }));
  };

  const handleIncrement = (field, amount = 1) => {
    setTrackerData((prev) => ({
      ...prev,
      [field]: (prev[field] || 0) + amount,
    }));
  };

  const handleDecrement = (field, amount = 1) => {
    setTrackerData((prev) => ({
      ...prev,
      [field]: Math.max(0, (prev[field] || 0) - amount),
    }));
  };

  const handleSave = async () => {
    try {
      await api.put("/tracker", trackerData);
      setIsEditing(false);
      fetchDashboardData();
      alert("Tracker updated successfully!");
    } catch (error) {
      console.error("Error saving tracker:", error);
      alert(error.response?.data?.message || "Failed to save tracker data");
    }
  };

  const calculateProgress = (current, goal) => {
    if (!goal || goal === 0) return 0;
    return Math.min(100, (current / goal) * 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return "from-green-500 to-emerald-500";
    if (percentage >= 75) return "from-yellow-500 to-amber-500";
    if (percentage >= 50) return "from-orange-500 to-yellow-500";
    return "from-red-500 to-orange-500";
  };

  const getProgressText = (percentage) => {
    if (percentage >= 100) return "Goal Achieved! 🎉";
    if (percentage >= 75) return "Great Progress!";
    if (percentage >= 50) return "Halfway There!";
    if (percentage >= 25) return "Keep Going!";
    return "Let's Get Started!";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff]  flex items-center justify-center pt-24">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-cyan-400 border-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff] text-[#000] overflow-hidden pt-24">
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Daily Tracker
              </h1>
              <p className="text-[#fff] mt-2">
                Track your daily health and fitness metrics
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[#000] border border-slate-700 rounded-xl px-4 py-2">
                <FaCalendarAlt className="text-[#fff]" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent focus:outline-none text-white"
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>

              <Link
                to="/fitness-activity"
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 flex items-center gap-2"
              >
                <FaPlus />
                Log Activity
              </Link>

              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2"
                >
                  <FaSave />
                  Save
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-[#000] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <FaEdit />
                  Edit
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Health Overview */}
        {dashboardData?.user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
          >
            <div className="lg:col-span-2 bg-[#000] rounded-2xl border border-slate-700 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                Health Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dashboardData.user.weight && (
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500">
                        <FaWeight className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-[#fff]">Weight</p>
                        <p className="text-lg font-bold text-white">
                          {dashboardData.user.weight} kg
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {dashboardData.user.height && (
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-500">
                        <FaRulerVertical className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-[#fff]">Height</p>
                        <p className="text-lg font-bold text-white">
                          {dashboardData.user.height} cm
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {dashboardData.bmi && (
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-orange-500 to-yellow-500">
                        <FaHeartbeat className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-[#fff]">BMI</p>
                        <p className="text-lg font-bold text-white">
                          {dashboardData.bmi}
                        </p>
                        <p
                          className={`text-xs ${
                            dashboardData.bmiStatus === "Normal"
                              ? "text-green-400"
                              : dashboardData.bmiStatus === "Underweight"
                              ? "text-yellow-400"
                              : dashboardData.bmiStatus === "Overweight"
                              ? "text-orange-400"
                              : "text-red-400"
                          }`}
                        >
                          {dashboardData.bmiStatus}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Today's Summary */}
            <div className="bg-[#000] rounded-2xl border border-blue-700/30 p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FaBullseye />
                Today's Summary
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-300">Activities Today</p>
                  <p className="text-2xl font-bold text-white">
                    {dashboardData.recentActivities?.filter((activity) => {
                      const activityDate = new Date(
                        activity.date
                      ).toDateString();
                      const today = new Date(selectedDate).toDateString();
                      return activityDate === today;
                    }).length || 0}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[#fff]">Total Calories Burned</p>
                  <p className="text-2xl font-bold text-white">
                    {dashboardData.recentActivities
                      ?.filter((activity) => {
                        const activityDate = new Date(
                          activity.date
                        ).toDateString();
                        const today = new Date(selectedDate).toDateString();
                        return activityDate === today;
                      })
                      .reduce(
                        (sum, activity) => sum + (activity.caloriesBurned || 0),
                        0
                      ) || 0}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[#fff]">Net Calories</p>
                  <p
                    className={`text-2xl font-bold ${
                      trackerData.caloriesConsumed -
                        (dashboardData.recentActivities
                          ?.filter((activity) => {
                            const activityDate = new Date(
                              activity.date
                            ).toDateString();
                            const today = new Date(selectedDate).toDateString();
                            return activityDate === today;
                          })
                          .reduce(
                            (sum, activity) =>
                              sum + (activity.caloriesBurned || 0),
                            0
                          ) || 0) >
                      0
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {trackerData.caloriesConsumed -
                      (dashboardData.recentActivities
                        ?.filter((activity) => {
                          const activityDate = new Date(
                            activity.date
                          ).toDateString();
                          const today = new Date(selectedDate).toDateString();
                          return activityDate === today;
                        })
                        .reduce(
                          (sum, activity) =>
                            sum + (activity.caloriesBurned || 0),
                          0
                        ) || 0)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tracker Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Steps Tracker */}
          <div className="bg-[#000] rounded-2xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-500">
                  <FaWalking className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Steps</h3>
                  <p className="text-sm text-[#fff]">
                    Goal: {dailyGoals.steps.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-2xl font-bold text-white">
                {trackerData.steps.toLocaleString()}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-[#fff] mb-1">
                <span>Progress</span>
                <span>
                  {calculateProgress(
                    trackerData.steps,
                    dailyGoals.steps
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(
                    calculateProgress(trackerData.steps, dailyGoals.steps)
                  )}`}
                  style={{
                    width: `${calculateProgress(
                      trackerData.steps,
                      dailyGoals.steps
                    )}%`,
                  }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {getProgressText(
                  calculateProgress(trackerData.steps, dailyGoals.steps)
                )}
              </p>
            </div>

            {isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleDecrement("steps", 1000)}
                  className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                >
                  -1k
                </button>
                <button
                  onClick={() => handleIncrement("steps", 1000)}
                  className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  +1k
                </button>
              </div>
            )}
          </div>

          {/* Water Tracker */}
          <div className="bg-[#000] rounded-2xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500">
                  <FaTint className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Water</h3>
                  <p className="text-sm text-[#fff]">
                    Goal: {dailyGoals.waterLiters}L
                  </p>
                </div>
              </div>
              <div className="text-2xl font-bold text-white">
                {trackerData.waterLiters}L
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-[#fff] mb-1">
                <span>Progress</span>
                <span>
                  {calculateProgress(
                    trackerData.waterLiters,
                    dailyGoals.waterLiters
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(
                    calculateProgress(
                      trackerData.waterLiters,
                      dailyGoals.waterLiters
                    )
                  )}`}
                  style={{
                    width: `${calculateProgress(
                      trackerData.waterLiters,
                      dailyGoals.waterLiters
                    )}%`,
                  }}
                />
              </div>
              <p className="text-xs text-[#fff] mt-2">
                {getProgressText(
                  calculateProgress(
                    trackerData.waterLiters,
                    dailyGoals.waterLiters
                  )
                )}
              </p>
            </div>

            {isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleDecrement("waterLiters", 0.5)}
                  className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                >
                  -0.5L
                </button>
                <button
                  onClick={() => handleIncrement("waterLiters", 0.5)}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  +0.5L
                </button>
              </div>
            )}
          </div>

          {/* Sleep Tracker */}
          <div className="bg-[#000] rounded-2xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                  <FaBed className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Sleep</h3>
                  <p className="text-sm text-[#fff]">
                    Goal: {dailyGoals.sleepHours}h
                  </p>
                </div>
              </div>
              <div className="text-2xl font-bold text-white">
                {trackerData.sleepHours}h
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-[#fff] mb-1">
                <span>Progress</span>
                <span>
                  {calculateProgress(
                    trackerData.sleepHours,
                    dailyGoals.sleepHours
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(
                    calculateProgress(
                      trackerData.sleepHours,
                      dailyGoals.sleepHours
                    )
                  )}`}
                  style={{
                    width: `${calculateProgress(
                      trackerData.sleepHours,
                      dailyGoals.sleepHours
                    )}%`,
                  }}
                />
              </div>
              <p className="text-xs text-[#fff] mt-2">
                {getProgressText(
                  calculateProgress(
                    trackerData.sleepHours,
                    dailyGoals.sleepHours
                  )
                )}
              </p>
            </div>

            {isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleDecrement("sleepHours", 0.5)}
                  className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                >
                  -0.5h
                </button>
                <button
                  onClick={() => handleIncrement("sleepHours", 0.5)}
                  className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  +0.5h
                </button>
              </div>
            )}
          </div>

          {/* Calories Tracker */}
          <div className="bg-[#000] rounded-2xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-500">
                  <FaUtensils className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Calories</h3>
                  <p className="text-sm text-[#fff]">
                    Goal: {dailyGoals.caloriesConsumed}
                  </p>
                </div>
              </div>
              <div className="text-2xl font-bold text-white">
                {trackerData.caloriesConsumed}
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-[#fff] mb-1">
                <span>Progress</span>
                <span>
                  {calculateProgress(
                    trackerData.caloriesConsumed,
                    dailyGoals.caloriesConsumed
                  ).toFixed(1)}
                  %
                </span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(
                    calculateProgress(
                      trackerData.caloriesConsumed,
                      dailyGoals.caloriesConsumed
                    )
                  )}`}
                  style={{
                    width: `${calculateProgress(
                      trackerData.caloriesConsumed,
                      dailyGoals.caloriesConsumed
                    )}%`,
                  }}
                />
              </div>
              <p className="text-xs text-[#fff] mt-2">
                {getProgressText(
                  calculateProgress(
                    trackerData.caloriesConsumed,
                    dailyGoals.caloriesConsumed
                  )
                )}
              </p>
            </div>

            {isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleDecrement("caloriesConsumed", 100)}
                  className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                >
                  -100
                </button>
                <button
                  onClick={() => handleIncrement("caloriesConsumed", 100)}
                  className="flex-1 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
                >
                  +100
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Manual Input Section */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="bg-[#000] rounded-2xl border border-slate-700 p-6 mb-8"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FaEdit />
              Manual Input
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#fff] mb-2">
                  Steps
                </label>
                <input
                  type="number"
                  value={trackerData.steps}
                  onChange={(e) =>
                    handleInputChange("steps", parseInt(e.target.value) || 0)
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-green-500 text-white"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#fff] mb-2">
                  Water (Liters)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={trackerData.waterLiters}
                  onChange={(e) =>
                    handleInputChange(
                      "waterLiters",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-white"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#fff] mb-2">
                  Sleep (Hours)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={trackerData.sleepHours}
                  onChange={(e) =>
                    handleInputChange(
                      "sleepHours",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 text-white"
                  min="0"
                  max="24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#fff] mb-2">
                  Calories Consumed
                </label>
                <input
                  type="number"
                  value={trackerData.caloriesConsumed}
                  onChange={(e) =>
                    handleInputChange(
                      "caloriesConsumed",
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 text-white"
                  min="0"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Recent Activities */}
        {dashboardData?.recentActivities &&
          dashboardData.recentActivities.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-[#000] rounded-2xl border border-slate-700 p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Recent Activities
                </h2>
                <Link
                  to="/fitness-activity"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View All →
                </Link>
              </div>

              <div className="space-y-3">
                {dashboardData.recentActivities.slice(0, 5).map((activity) => (
                  <div
                    key={activity._id}
                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-xl">
                        {activity.type === "Running"
                          ? "🏃"
                          : activity.type === "Weightlifting"
                          ? "🏋️"
                          : activity.type === "Swimming"
                          ? "🏊"
                          : activity.type === "Cycling"
                          ? "🚴"
                          : "💪"}
                      </div>
                      <div>
                        <h3 className="font-bold text-white">
                          {activity.type}
                        </h3>
                        <p className="text-sm text-[#fff]">
                          {new Date(activity.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-[#fff]">Duration</p>
                        <p className="font-bold text-white">
                          {activity.durationMinutes} min
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#fff]">Calories</p>
                        <p className="font-bold text-orange-400 flex items-center gap-1">
                          <FaFire />
                          {activity.caloriesBurned}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
      </div>
    </div>
  );
}

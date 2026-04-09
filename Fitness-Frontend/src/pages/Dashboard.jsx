import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FaFire,
  FaHeartbeat,
  FaRunning,
  FaBed,
  FaChartLine,
  FaCalendarAlt,
  FaArrowRight,
  FaDumbbell,
  FaUserCircle,
  FaEdit,
  FaWeight,
  FaRulerVertical,
  FaTrophy,
} from "react-icons/fa";
import API from "../services/api";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    totalActivities: 0,
    totalWorkouts: 0,
    totalSteps: 0,
    totalCalories: 0,
    avgHeartRate: 0,
    sleepScore: 0,
    workoutStreak: 0,
    weeklyGoalProgress: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Dashboard useEffect running...");

    const token = localStorage.getItem("accessToken");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!token) {
      console.log("No token found, redirecting to login");
      navigate("/login");
      return;
    }

    // If we have token, fetch data
    console.log("User authenticated, fetching dashboard data...");
    fetchDashboardData();
    fetchUserData();
    fetchRecentActivities();
    fetchRecentBlogs();
  }, [navigate]);

  // ✅ CORRECT: Fetch user profile from /users/profile
  const fetchUserData = async () => {
    try {
      const response = await API.get("/users/profile"); // ✅ Correct endpoint
      setUserData(response.data?.data || {});
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Fallback to localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setUserData(user);
    }
  };

  // ✅ CORRECT: Fetch dashboard data from /dashboard
  const fetchDashboardData = async () => {
    try {
      // Try to get from dashboard endpoint first
      const response = await API.get("/dashboard"); // ✅ Correct endpoint
      const dashboardData = response.data?.data || {};

      if (
        dashboardData.user ||
        dashboardData.tracker ||
        dashboardData.recentActivities
      ) {
        // If dashboard endpoint returns data, use it
        setStats({
          totalActivities: dashboardData.recentActivities?.length || 0,
          totalWorkouts: dashboardData.recentActivities?.length || 0,
          totalSteps: dashboardData.tracker?.steps || 0,
          totalCalories: dashboardData.tracker?.caloriesConsumed || 0,
          avgHeartRate: 72,
          sleepScore: dashboardData.tracker?.sleepHours || 7.5,
          workoutStreak: 0,
          weeklyGoalProgress: 0,
          totalDuration: 0,
        });
        return;
      }
    } catch (error) {
      console.log("Dashboard endpoint not available, fetching separately...");
    }

    // Fallback: Fetch data separately from individual endpoints
    try {
      const [activitiesResponse, trackerResponse] = await Promise.all([
        API.get("/activities?limit=100"), // ✅ Correct endpoint
        API.get("/tracker"), // ✅ Correct endpoint
      ]);

      const activities = activitiesResponse.data?.data || [];
      const tracker = trackerResponse.data?.data || {};

      // Calculate stats from activities
      const totalActivities = activities.length;
      const totalWorkouts = activities.filter(
        (activity) =>
          activity.type && activity.type.toLowerCase().includes("workout")
      ).length;

      // Calculate totals
      let totalCalories = 0;
      let totalDuration = 0;

      activities.forEach((activity) => {
        if (activity.caloriesBurned) totalCalories += activity.caloriesBurned;
        if (activity.durationMinutes) totalDuration += activity.durationMinutes;
      });

      // Calculate workout streak (simplified - last 7 days)
      const today = new Date();
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const recentActivities = activities.filter((activity) => {
        const activityDate = new Date(activity.date || activity.createdAt);
        return activityDate > lastWeek;
      });
      const workoutStreak = Math.min(recentActivities.length, 7);

      // Calculate weekly goal progress (based on 5 workouts per week goal)
      const weeklyGoalProgress = Math.min(
        Math.round((workoutStreak / 5) * 100),
        100
      );

      setStats({
        totalActivities,
        totalWorkouts,
        totalSteps: tracker.steps || 0,
        totalCalories,
        avgHeartRate: 72,
        sleepScore: tracker.sleepHours || 7.5,
        workoutStreak,
        weeklyGoalProgress,
        totalDuration: Math.round(totalDuration / 60), // Convert to hours
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Set default stats
      setStats({
        totalActivities: 0,
        totalWorkouts: 0,
        totalSteps: 0,
        totalCalories: 0,
        avgHeartRate: 72,
        sleepScore: 7.5,
        workoutStreak: 0,
        weeklyGoalProgress: 0,
        totalDuration: 0,
      });
    }
  };

  // ✅ CORRECT: Fetch recent activities from /activities
  const fetchRecentActivities = async () => {
    try {
      const response = await API.get("/activities?limit=3"); // ✅ Correct endpoint
      const activities = response.data?.data || [];

      // Sort by date and get recent 3
      const sortedActivities = activities
        .sort(
          (a, b) =>
            new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
        )
        .slice(0, 3);

      setRecentActivities(sortedActivities);
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      setRecentActivities([]);
    }
  };

  // ✅ CORRECT: Fetch recent blogs from /blogs/all
  const fetchRecentBlogs = async () => {
    try {
      const response = await API.get("/blogs/all?limit=2"); // ✅ Correct endpoint
      const blogs = response.data?.data || [];

      // Sort by date and get recent 2
      const sortedBlogs = blogs
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 2);

      setRecentBlogs(sortedBlogs);
    } catch (error) {
      console.error("Error fetching recent blogs:", error);
      setRecentBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    const typeStr = (type || "").toLowerCase();
    if (typeStr.includes("yoga") || typeStr.includes("meditation")) return "🧘";
    if (typeStr.includes("running")) return "🏃";
    if (typeStr.includes("weight") || typeStr.includes("strength")) return "🏋️";
    if (typeStr.includes("cycling")) return "🚴";
    if (typeStr.includes("swim")) return "🏊";
    return "🏃";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff] flex items-center justify-center pt-24">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-t-orange-500 border-b-yellow-500 border-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff] text-[#000] overflow-hidden pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                {getGreeting()}, {userData?.name || "Fitness Enthusiast"}!
              </h1>
              <p className="text-[#000] mt-2">
                Your personalized fitness dashboard
                {userData?.fitnessGoal && ` • Goal: ${userData.fitnessGoal}`}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Profile Summary */}
              <div className="hidden md:flex items-center gap-3 bg-[#fff] rounded-xl p-3 border border-slate-700">
                {userData?.height && userData?.weight && (
                  <>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-sm">
                        <FaRulerVertical className="text-[#000]" />
                        <span>{userData.height} cm</span>
                      </div>
                      <div className="text-xs text-[#000]">Height</div>
                    </div>
                    <div className="h-8 w-px bg-[#000] "></div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-sm">
                        <FaWeight className="text-[#000]" />
                        <span>{userData.weight} kg</span>
                      </div>
                      <div className="text-xs text-[#000]">Weight</div>
                    </div>
                  </>
                )}
                <div className="h-8 w-px bg-[#000]"></div>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-orange-500 hover:text-orange-500 transition duration-300"
                >
                  <FaUserCircle className="text-xl" />
                  <span className="text-md">Profile</span>
                </Link>
              </div>

              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl rotate-45 flex items-center justify-center">
                <FaCalendarAlt className="text-[#fff] -rotate-45" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* Calories Burned */}
          <div className="bg-[#000] rounded-xl p-6 border border-slate-700 hover:border-orange-500/50 transition duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-500">
                <FaFire className="text-white text-xl" />
              </div>
              <span className="text-green-400 text-sm font-semibold">
                {stats.totalCalories > 0 ? "+" : ""}
                {stats.totalCalories > 1000
                  ? Math.round(stats.totalCalories / 100)
                  : 0}
                %
              </span>
            </div>
            <h3 className="text-3xl font-bold text-[#fff] mb-1">
              {stats.totalCalories.toLocaleString()}
            </h3>
            <p className="text-[#fff] text-sm">Calories Burned</p>
          </div>

          {/* Total Steps */}
          <div className="bg-[#000]  rounded-xl p-6 border border-slate-700 hover:border-green-500/50 transition duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-500">
                <FaRunning className="text-[#fff] text-xl" />
              </div>
              <span className="text-green-400 text-sm font-semibold">
                {stats.totalSteps > 10000 ? "+" : ""}
                {stats.totalSteps > 10000
                  ? Math.round(stats.totalSteps / 1000)
                  : 0}
                %
              </span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {stats.totalSteps.toLocaleString()}
            </h3>
            <p className="text-[#fff] text-sm">Total Steps</p>
          </div>

          {/* Total Activities */}
          <div className="bg-[#000]  rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500">
                <FaChartLine className="text-white text-xl" />
              </div>
              <span className="text-green-400 text-sm font-semibold">
                {stats.totalActivities > 0 ? "+" : ""}
                {stats.totalActivities > 0
                  ? Math.round(stats.totalActivities * 10)
                  : 0}
                %
              </span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {stats.totalActivities}
            </h3>
            <p className="text-[#fff] text-sm">Total Activities</p>
          </div>

          {/* Workout Streak */}
          <div className="bg-[#000]  rounded-xl p-6 border border-slate-700 hover:border-purple-500/50 transition duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                <FaTrophy className="text-white text-xl" />
              </div>
              <span className="text-yellow-400 text-sm font-semibold">
                {stats.workoutStreak} days
              </span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">
              {stats.workoutStreak}
            </h3>
            <p className="text-[#fff] text-sm">Workout Streak</p>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Activities */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Activities */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-[#000]  rounded-2xl border border-slate-700 p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <FaDumbbell className="text-orange-500" />
                  Recent Activities
                </h2>
                <Link
                  to="/activities"
                  className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-2"
                >
                  View All
                  <FaArrowRight />
                </Link>
              </div>

              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity, index) => (
                    <div
                      key={activity._id || index}
                      className="group bg-[#000]  rounded-xl p-4 border border-slate-700 hover:border-orange-500/50 transition duration-300 cursor-pointer"
                      onClick={() => navigate(`/activities/${activity._id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-orange-500/20 to-yellow-500/20">
                            <span className="text-2xl">
                              {getActivityIcon(activity.type)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-bold text-white">
                              {activity.type || "Workout"}
                            </h3>
                            <p className="text-sm text-[#fff]">
                              Duration: {activity.durationMinutes || 0} min •
                              Calories: {activity.caloriesBurned || 0} cal
                            </p>
                            {activity.notes && (
                              <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                                {activity.notes}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-[#fff]">
                            {formatDate(activity.date || activity.createdAt)}
                          </div>
                          <div className="text-xs text-[#fff]">
                            {activity.type || "Activity"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#000]  flex items-center justify-center">
                      <FaDumbbell className="text-[#fff] text-2xl" />
                    </div>
                    <p className="text-[#fff] mb-2">
                      No activities recorded yet.
                    </p>
                    <Link
                      to="/activities"
                      className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-500 mt-2"
                    >
                      <span>Add your first activity</span>
                      <FaArrowRight className="text-sm" />
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Recent Blogs */}
            {recentBlogs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-[#000] rounded-2xl border border-slate-700 p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="text-xl">📝</span>
                    Recent Blogs
                  </h2>
                  <Link
                    to="/blogs"
                    className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-2"
                  >
                    View All
                    <FaArrowRight />
                  </Link>
                </div>

                <div className="space-y-4">
                  {recentBlogs.map((blog, index) => (
                    <div
                      key={blog._id || index}
                      className="group bg-[#000]  rounded-xl p-4 border border-slate-700 hover:border-blue-500/50 transition duration-300 cursor-pointer"
                      onClick={() => navigate(`/blogs/${blog._id}`)}
                    >
                      <h3 className="font-bold text-white mb-2">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-[#fff] line-clamp-2 mb-3">
                        {blog.content || blog.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-[#fff]">
                          {formatDate(blog.createdAt)}
                        </div>
                        <div className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">
                          {blog.category || "Fitness"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Quick Stats & Actions */}
          <div className="space-y-8">
            {/* User Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-[#000]  rounded-2xl border border-slate-700 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Your Profile</h2>
                <Link
                  to="/profile"
                  className="text-orange-400 hover:text-orange-300 transition duration-300"
                >
                  <FaEdit />
                </Link>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                    <span className="text-xl">
                      {userData?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white">
                      {userData?.name || "User"}
                    </h3>
                    <p className="text-sm text-[#fff]">
                      {userData?.email || "user@example.com"}
                    </p>
                  </div>
                </div>

                {userData?.city && (
                  <div className="text-sm text-[#fff]">
                    <span className="text-[#fff]">Location:</span>{" "}
                    {userData.city}
                  </div>
                )}

                {userData?.fitnessGoal && (
                  <div className="text-sm text-[#fff]">
                    <span className="text-[#fff]">Goal:</span>{" "}
                    {userData.fitnessGoal}
                  </div>
                )}

                {userData?.sportsInterest && (
                  <div className="text-sm text-[#fff]">
                    <span className="text-[#fff]">Interest:</span>{" "}
                    {userData.sportsInterest}
                  </div>
                )}

                <div className="pt-4 border-t border-slate-700">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#fff]">Profile Completion</span>
                    <span className="text-white font-semibold">
                      {userData?.isProfileComplete ? "100%" : "60%"}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"
                      style={{
                        width: userData?.isProfileComplete ? "100%" : "50%",
                      }}
                    ></div>
                  </div>
                  {!userData?.isProfileComplete && (
                    <Link
                      to="/complete-profile"
                      className="text-xs text-orange-500 hover:text-orange-500 mt-2 inline-block"
                    >
                      Complete your profile →
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Weekly Progress */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-[#000]  rounded-2xl border border-slate-700 p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Weekly Progress
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#fff]">Workout Goal (5/week)</span>
                    <span className="text-white font-semibold">
                      {stats.weeklyGoalProgress}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"
                      style={{ width: `${stats.weeklyGoalProgress}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#fff]">Activity Streak</span>
                    <span className="text-white font-semibold">
                      {stats.workoutStreak} days
                    </span>
                  </div>
                  <div className="h-2 bg-[#000] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                      style={{
                        width: `${Math.min(stats.workoutStreak * 20, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#fff]">Steps Goal</span>
                    <span className="text-white font-semibold">
                      {Math.min(
                        Math.round((stats.totalSteps / 70000) * 100),
                        100
                      )}
                      %
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                      style={{
                        width: `${Math.min(
                          Math.round((stats.totalSteps / 70000) * 100),
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-[#000]  rounded-2xl border border-slate-700 p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/activities"
                  className="p-4 bg-amber-700 text-[#fff] rounded-xl border border-orange-500/20 hover:border-orange-500/50 transition duration-300"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">➕</div>
                    <div className="text-sm font-semibold">Log Activity</div>
                  </div>
                </Link>
                <Link
                  to="/tracker"
                  className="p-4 bg-amber-700 text-[#fff] rounded-xl border border-blue-500/20 hover:border-blue-500/50 transition duration-300"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📊</div>
                    <div className="text-sm font-semibold">Tracker</div>
                  </div>
                </Link>
                <Link
                  to="/products"
                  className="p-4 bg-amber-700 text-[#fff] rounded-xl border border-green-500/20 hover:border-green-500/50 transition duration-300"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🛍️</div>
                    <div className="text-sm font-semibold">Store</div>
                  </div>
                </Link>
                <Link
                  to="/blogs"
                  className="p-4 bg-amber-700 text-[#fff] rounded-xl border border-purple-500/20 hover:border-purple-500/50 transition duration-300"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">📝</div>
                    <div className="text-sm font-semibold">Blogs</div>
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaRunning,
  FaDumbbell,
  FaSwimmer,
  FaBicycle,
  FaHeartbeat,
  FaFire,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaChartLine,
  FaStopwatch,
  FaRegClock,
  FaListUl,
} from "react-icons/fa";
import api from "../services/api";

export default function FitnessActivity() {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [filters, setFilters] = useState({
    type: "all",
    fromDate: "",
    toDate: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });

  const [formData, setFormData] = useState({
    type: "",
    durationMinutes: "",
    caloriesBurned: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const activityTypes = [
    {
      value: "Running",
      label: "Running",
      icon: <FaRunning />,
      color: "from-red-500 to-pink-500",
    },
    {
      value: "Weightlifting",
      label: "Weight Training",
      icon: <FaDumbbell />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      value: "Swimming",
      label: "Swimming",
      icon: <FaSwimmer />,
      color: "from-blue-500 to-indigo-500",
    },
    {
      value: "Cycling",
      label: "Cycling",
      icon: <FaBicycle />,
      color: "from-green-500 to-emerald-500",
    },
    {
      value: "Yoga",
      label: "Yoga",
      icon: "🧘",
      color: "from-purple-500 to-pink-500",
    },
    {
      value: "Walking",
      label: "Walking",
      icon: "🚶",
      color: "from-orange-500 to-yellow-500",
    },
    {
      value: "HIIT",
      label: "HIIT",
      icon: "⚡",
      color: "from-red-500 to-orange-500",
    },
    {
      value: "Football",
      label: "Football",
      icon: "⚽",
      color: "from-green-500 to-blue-500",
    },
    {
      value: "Basketball",
      label: "Basketball",
      icon: "🏀",
      color: "from-orange-500 to-red-500",
    },
    {
      value: "Tennis",
      label: "Tennis",
      icon: "🎾",
      color: "from-green-500 to-yellow-500",
    },
  ];

  useEffect(() => {
    fetchActivities();
  }, [filters, pagination.page]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.type !== "all" && { type: filters.type }),
        ...(filters.fromDate && { from: filters.fromDate }),
        ...(filters.toDate && { to: filters.toDate }),
      };

      const response = await api.get("/activities", { params });
      const activitiesData = response.data?.data || [];

      setActivities(activitiesData);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (selectedActivity) {
        // Update existing activity
        await api.put(`/activities/${selectedActivity._id}`, formData);
      } else {
        // Create new activity
        await api.post("/activities", formData);
      }

      fetchActivities();
      resetForm();
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedActivity(null);
    } catch (error) {
      console.error("Error saving activity:", error);
      alert(error.response?.data?.message || "Failed to save activity");
    }
  };

  const handleEdit = (activity) => {
    setSelectedActivity(activity);
    setFormData({
      type: activity.type || "",
      durationMinutes: activity.durationMinutes || "",
      caloriesBurned: activity.caloriesBurned || "",
      date: activity.date
        ? new Date(activity.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      notes: activity.notes || "",
    });
    setShowEditModal(true);
  };

  const handleDelete = async (activityId) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        await api.delete(`/activities/${activityId}`);
        fetchActivities();
      } catch (error) {
        console.error("Error deleting activity:", error);
        alert("Failed to delete activity");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      type: "",
      durationMinutes: "",
      caloriesBurned: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setSelectedActivity(null);
  };

  const getActivityStats = () => {
    const stats = {
      totalActivities: activities.length,
      totalDuration: activities.reduce(
        (sum, a) => sum + (a.durationMinutes || 0),
        0
      ),
      totalCalories: activities.reduce(
        (sum, a) => sum + (a.caloriesBurned || 0),
        0
      ),
    };

    return stats;
  };

  const getActivityIcon = (type) => {
    const activityType = activityTypes.find((at) => at.value === type);
    return activityType?.icon || <FaRunning />;
  };

  const getActivityColor = (type) => {
    const activityType = activityTypes.find((at) => at.value === type);
    return activityType?.color || "from-slate-700 to-slate-800";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const resetFilters = () => {
    setFilters({
      type: "all",
      fromDate: "",
      toDate: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const stats = getActivityStats();

  if (loading && activities.length === 0) {
    return (
      <div className="min-h-screen bg-[#fff] flex items-center justify-center pt-24">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-t-orange-500 border-b-yellow-400 border-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff] text-white overflow-hidden pt-24">
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
                Fitness Activities
              </h1>
              <p className="text-[#fff] mt-2">
                Track and manage your workout sessions
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                to="/tracker"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 flex items-center gap-2"
              >
                <FaChartLine />
                View Tracker
              </Link>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 flex items-center gap-2"
              >
                <FaPlus />
                Log Activity
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-[#000] rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500">
                <FaListUl className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {stats.totalActivities}
                </h3>
                <p className="text-[#fff] text-sm">Total Activities</p>
              </div>
            </div>
          </div>

          <div className="bg-[#000] rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-500">
                <FaRegClock className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {stats.totalDuration}
                </h3>
                <p className="text-[#fff] text-sm">Total Minutes</p>
              </div>
            </div>
          </div>

          <div className="bg-[#000] rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-500">
                <FaFire className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {stats.totalCalories.toLocaleString()}
                </h3>
                <p className="text-[#fff] text-sm">Calories Burned</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-[#000] rounded-2xl border border-slate-700 p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <h2 className="text-xl font-bold text-white">Filter Activities</h2>
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#fff] mb-2">
                Activity Type
              </label>
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 text-white"
              >
                <option value="all">All Types</option>
                {activityTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={filters.fromDate}
                onChange={(e) =>
                  setFilters({ ...filters, fromDate: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 text-white"
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={filters.toDate}
                onChange={(e) =>
                  setFilters({ ...filters, toDate: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 text-white"
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
        </motion.div>

        {/* Activities List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-[#000] rounded-2xl border border-slate-700 p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              Your Activities ({activities.length})
            </h2>
            <div className="text-[#fff] text-sm">
              Showing {activities.length} activities
            </div>
          </div>

          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div
                  key={activity._id}
                  className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 hover:border-orange-500/50 transition duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-16 h-16 rounded-xl flex items-center justify-center bg-gradient-to-br ${getActivityColor(
                          activity.type
                        )}`}
                      >
                        <span className="text-2xl">
                          {getActivityIcon(activity.type)}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-white">
                            {activity.type}
                          </h3>
                          <span className="text-xs px-2 py-1 rounded-full bg-slate-700 text-slate-300">
                            {activity.durationMinutes || 0} min
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-[#fff]">
                              Calories Burned
                            </p>
                            <p className="font-semibold text-white flex items-center gap-1">
                              <FaFire className="text-orange-500" />
                              {activity.caloriesBurned || 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-[#fff]">Date & Time</p>
                            <p className="font-semibold text-white flex items-center gap-1">
                              <FaCalendarAlt className="text-blue-500" />
                              {formatDate(activity.date)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-[#fff]">Duration</p>
                            <p className="font-semibold text-white flex items-center gap-1">
                              <FaStopwatch className="text-green-500" />
                              {activity.durationMinutes} minutes
                            </p>
                          </div>
                        </div>

                        {activity.notes && (
                          <div className="mb-2">
                            <p className="text-sm text-[#fff]">Notes:</p>
                            <p className="text-sm text-[#fff]">
                              {activity.notes}
                            </p>
                          </div>
                        )}

                        <div className="text-xs text-[#fff]">
                          Added: {new Date(activity.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(activity)}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition duration-300 flex items-center gap-2"
                      >
                        <FaEdit />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(activity._id)}
                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition duration-300 flex items-center gap-2"
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <FaDumbbell className="text-[#fff] text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-300 mb-2">
                  No activities found
                </h3>
                <p className="text-[#fff] mb-6">
                  {filters.type !== "all" || filters.fromDate || filters.toDate
                    ? "Try changing your filters"
                    : "Log your first activity to get started"}
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-xl hover:shadow-lg transition duration-300"
                >
                  Log First Activity
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {activities.length > 0 && (
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-700">
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.max(1, prev.page - 1),
                  }))
                }
                disabled={pagination.page === 1}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Previous
              </button>
              <span className="text-[#fff]">Page {pagination.page}</span>
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={activities.length < pagination.limit}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[#000] rounded-2xl border border-slate-700 p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {selectedActivity ? "Edit Activity" : "Log New Activity"}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  resetForm();
                }}
                className="text-[#fff] hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Activity Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 text-white"
                  required
                >
                  <option value="">Select Activity Type</option>
                  {activityTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#fff] mb-2">
                  Duration (minutes) *
                </label>
                <input
                  type="number"
                  value={formData.durationMinutes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      durationMinutes: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 text-white"
                  placeholder="e.g., 45"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#fff] mb-2">
                  Calories Burned
                </label>
                <input
                  type="number"
                  value={formData.caloriesBurned}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      caloriesBurned: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 text-white"
                  placeholder="e.g., 300"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#fff] mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 text-white"
                  required
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#fff] mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 text-white resize-none"
                  placeholder="Add any notes about your workout..."
                  rows="3"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-xl hover:shadow-lg transition duration-300"
                >
                  {selectedActivity ? "Update Activity" : "Save Activity"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

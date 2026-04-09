import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaEdit,
  FaCalendarAlt,
  FaUser,
  FaArrowRight,
  FaPlus,
  FaTag,
  FaBookOpen,
  FaFire,
  FaTrash,
} from "react-icons/fa";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  const categories = [
    "all",
    "fitness",
    "nutrition",
    "yoga",
    "meditation",
    "sports",
    "recovery",
    "mindfulness",
    "ayurveda",
  ];

  const popularTags = [
    "Workout",
    "Diet",
    "Yoga",
    "Meditation",
    "HIIT",
    "Cardio",
    "Strength",
    "Wellness",
    "Recovery",
  ];

  // New blog state matching your backend schema
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    tags: "",
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    filterBlogs();
  }, [blogs, searchTerm, selectedCategory]);

  // ✅ CORRECT: Fetch blogs from /blogs/all
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await API.get("/blogs/all"); // ✅ Correct endpoint

      // Your backend returns data in response.data.data
      const blogsData = response.data?.data || [];

      console.log("Blogs fetched:", blogsData);

      // Add category and read time based on content
      const enrichedBlogs = blogsData.map((blog) => ({
        ...blog,
        category: getCategoryFromTags(blog.tags),
        readTime: calculateReadTime(blog.content),
        likes: blog.likes || Math.floor(Math.random() * 100),
        featured: blog.featured || Math.random() > 0.7,
        author: blog.author || "Anonymous",
      }));

      // Sort by date (newest first)
      const sortedBlogs = enrichedBlogs.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setBlogs(sortedBlogs);
      setFilteredBlogs(sortedBlogs);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Failed to load blogs. Please try again.");
      setBlogs([]);
      setFilteredBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryFromTags = (tags) => {
    if (!tags || tags.length === 0) return "fitness";

    const tagStr = tags.join(" ").toLowerCase();

    if (tagStr.includes("yoga")) return "yoga";
    if (tagStr.includes("meditation") || tagStr.includes("mindfulness"))
      return "meditation";
    if (tagStr.includes("nutrition") || tagStr.includes("diet"))
      return "nutrition";
    if (tagStr.includes("sports")) return "sports";
    if (tagStr.includes("recovery")) return "recovery";
    if (tagStr.includes("ayurveda")) return "ayurveda";

    return "fitness";
  };

  const calculateReadTime = (content) => {
    if (!content) return "2 min";
    const words = content.split(" ").length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const filterBlogs = () => {
    let filtered = [...blogs];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (blog.tags &&
            blog.tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase())
            ))
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (blog) =>
          blog.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredBlogs(filtered);
  };

  // ✅ CORRECT: Create blog using /blogs/create
  const handleCreateBlog = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("Please login to create a blog");
      navigate("/login");
      return;
    }

    if (!newBlog.title || !newBlog.content) {
      setError("Title and content are required");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Prepare tags array
      const tagsArray = newBlog.tags
        ? newBlog.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
        : [];

      const blogData = {
        title: newBlog.title,
        content: newBlog.content,
        tags: tagsArray,
      };

      console.log("Creating blog with data:", blogData);

      // ✅ CORRECT: Use /blogs/create endpoint
      const response = await API.post("/blogs/create", blogData);

      console.log("Blog created:", response.data);

      setSuccess("Blog created successfully!");

      // Reset form
      setNewBlog({
        title: "",
        content: "",
        tags: "",
      });

      // Close modal after delay
      setTimeout(() => {
        setShowCreateModal(false);
        setSuccess("");
      }, 1500);

      // Refresh blogs
      fetchBlogs();
    } catch (error) {
      console.error("Error creating blog:", error);

      if (error.response?.status === 401) {
        setError("Please login to create a blog");
        navigate("/login");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to create blog. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ CORRECT: Delete blog using /blogs/:id
  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    try {
      // ✅ CORRECT: Use /blogs/:id endpoint
      const response = await API.delete(`/blogs/${blogId}`);
      console.log("Blog deleted:", response.data);

      // Refresh blogs
      fetchBlogs();
      setSuccess("Blog deleted successfully!");

      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error deleting blog:", error);
      setError("Failed to delete blog. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      fitness: "from-orange-500 to-red-500",
      nutrition: "from-green-500 to-emerald-500",
      yoga: "from-purple-500 to-pink-500",
      meditation: "from-blue-500 to-cyan-500",
      sports: "from-red-500 to-orange-500",
      recovery: "from-indigo-500 to-purple-500",
      mindfulness: "from-teal-500 to-cyan-500",
      ayurveda: "from-amber-500 to-yellow-500",
    };
    return colors[category] || "from-gray-500 to-slate-500";
  };

  // Check if user can edit/delete blog (simplified check)
  const canUserModify = (blogAuthor) => {
    // For now, allow if user is logged in
    // In real app, check if user is admin or blog owner
    return user !== null;
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
    <div className="min-h-screen bg-[#fff] text-white overflow-hidden pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Success/Error Messages */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-900/30 border border-green-700/50 text-green-400 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <span>{success}</span>
              <button
                onClick={() => setSuccess("")}
                className="text-green-400 hover:text-green-300"
              >
                &times;
              </button>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-900/30 border border-red-700/50 text-red-400 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError("")}
                className="text-red-400 hover:text-red-300"
              >
                &times;
              </button>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
                Fitness Blogs
              </h1>
              <p className="text-[#000] mt-2">
                Knowledge, inspiration, and guidance for your wellness journey
              </p>
            </div>

            {user && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 flex items-center gap-2"
              >
                <FaPlus />
                Write a Blog
              </button>
            )}
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#000] rounded-2xl border border-slate-700 p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {/* Search */}
            <div className="relative">
              <div className="absolute left-4 top-1/5 transform -translate-y-1/2 text-[#fff]">
                <FaSearch />
              </div>
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 text-white"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <div className="absolute left-4 top-1/5 transform -translate-y-1/2 text-[#fff]">
                <FaFilter />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 text-[#fff] appearance-none"
              >
                <option value="all">All Categories</option>
                {categories
                  .filter((cat) => cat !== "all")
                  .map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
              </select>
            </div>

            {/* Popular Tags */}
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchTerm(tag)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-[#fff] rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                >
                  <FaTag className="text-xs" />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-[#000] rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-orange-500 to-red-500">
                <FaBookOpen className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {blogs.length}
                </h3>
                <p className="text-[#fff] text-sm">Total Blogs</p>
              </div>
            </div>
          </div>

          <div className="bg-[#000] rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-500">
                <FaEdit className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {blogs.filter((b) => b.featured).length}
                </h3>
                <p className="text-[#fff] text-sm">Featured</p>
              </div>
            </div>
          </div>

          <div className="bg-[#000] rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500">
                <FaUser className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {new Set(blogs.map((b) => b.author)).size}
                </h3>
                <p className="text-[#fff] text-sm">Authors</p>
              </div>
            </div>
          </div>

          <div className="bg-[#000] rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-red-500 to-pink-500">
                <FaFire className="text-white text-xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)}
                </h3>
                <p className="text-[#fff] text-sm">Total Likes</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Featured Blogs */}
        {filteredBlogs.filter((b) => b.featured).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-orange-500">🔥</span>
              Featured Blogs
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredBlogs
                .filter((blog) => blog.featured)
                .slice(0, 2)
                .map((blog) => (
                  <div
                    key={blog._id}
                    className="group bg-[#000] rounded-2xl border border-slate-700 p-6 hover:border-orange-500/50 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${getCategoryColor(
                          blog.category
                        )} text-white`}
                      >
                        {blog.category?.toUpperCase()}
                      </span>
                      <span className="text-sm text-[#fff] flex items-center gap-1">
                        <FaCalendarAlt />
                        {formatDate(blog.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                      {blog.title}
                    </h3>

                    <p className="text-[#fff] mb-4 line-clamp-3">
                      {blog.content}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {blog.author?.charAt(0) || "A"}
                          </span>
                        </div>
                        <span className="text-sm text-[#fff]">
                          {blog.author || "Anonymous"}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-sm text-[#fff] flex items-center gap-1">
                          <FaFire className="text-orange-500" />
                          {blog.likes || 0}
                        </span>
                        <span className="text-sm text-[#fff]">
                          {blog.readTime}
                        </span>
                        {canUserModify(blog.author) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteBlog(blog._id);
                            }}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        )}

        {/* All Blogs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-[#000] rounded-2xl border border-slate-700 p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {selectedCategory === "all"
                ? "All Blogs"
                : selectedCategory.charAt(0).toUpperCase() +
                  selectedCategory.slice(1) +
                  " Blogs"}
              <span className="text-orange-400 ml-2">
                ({filteredBlogs.length})
              </span>
            </h2>
            <div className="text-[#fff] text-sm">
              Showing {filteredBlogs.length} of {blogs.length}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-5 hover:border-orange-500/50 hover:shadow-lg transition-all duration-300 cursor-pointer relative"
                >
                  <div className="mb-4 flex justify-between items-start">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r ${getCategoryColor(
                        blog.category
                      )} text-white`}
                    >
                      {blog.category?.toUpperCase()}
                    </span>
                    {canUserModify(blog.author) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBlog(blog._id);
                        }}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg"
                        title="Delete blog"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>

                  <p className="text-[#fff] text-sm mb-4 line-clamp-3">
                    {blog.content}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center">
                        <span className="text-white text-xs">
                          {blog.author?.charAt(0) || "A"}
                        </span>
                      </div>
                      <span className="text-xs text-[#fff]">
                        {blog.author?.split(" ")[0] || "Author"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#fff]">
                      <FaCalendarAlt />
                      {formatDate(blog.createdAt)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {blog.tags?.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-slate-700 text-[#fff] rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                      {blog.tags?.length > 2 && (
                        <span className="px-2 py-0.5 bg-slate-800 text-[#fff] rounded text-xs">
                          +{blog.tags.length - 2}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#fff] flex items-center gap-1">
                        <FaFire className="text-orange-400" />
                        {blog.likes || 0}
                      </span>
                      <span className="text-xs text-[#fff]">
                        {blog.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <FaBookOpen className="text-[#fff] text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-300 mb-2">
                  No blogs found
                </h3>
                <p className="text-[#fff] mb-6">
                  {searchTerm || selectedCategory !== "all"
                    ? "Try changing your search or filter"
                    : "Be the first to write a blog!"}
                </p>
                {user ? (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-xl hover:shadow-lg transition duration-300"
                  >
                    Write First Blog
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-xl hover:shadow-lg transition duration-300 inline-block"
                  >
                    Login to Write
                  </Link>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Create Blog Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#000] rounded-2xl border border-slate-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Write a New Blog
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewBlog({
                    title: "",
                    content: "",
                    tags: "",
                  });
                  setError("");
                }}
                className="text-[#fff] hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-700/50 text-red-400 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateBlog} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#fff] mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={newBlog.title}
                  onChange={(e) =>
                    setNewBlog({ ...newBlog, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 text-white"
                  placeholder="Enter blog title"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#fff] mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={newBlog.tags}
                  onChange={(e) =>
                    setNewBlog({ ...newBlog, tags: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 text-white"
                  placeholder="e.g., fitness, nutrition, yoga"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-[#fff] mt-1">
                  Separate tags with commas
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#fff] mb-2">
                  Content *
                </label>
                <textarea
                  value={newBlog.content}
                  onChange={(e) =>
                    setNewBlog({ ...newBlog, content: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-orange-500 text-white resize-none"
                  placeholder="Write your blog content here..."
                  rows="8"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewBlog({
                      title: "",
                      content: "",
                      tags: "",
                    });
                    setError("");
                  }}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition duration-300 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-xl hover:shadow-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Publishing...
                    </span>
                  ) : (
                    "Publish Blog"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

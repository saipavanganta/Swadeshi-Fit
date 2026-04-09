import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaStar,
  FaFilter,
  FaSearch,
  FaFire,
  FaTag,
  FaTruck,
  FaShieldAlt,
  FaLeaf,
  FaBoxOpen,
} from "react-icons/fa";
import API from "../services/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "all",
    minPrice: "",
    maxPrice: "",
    sortBy: "newest",
    inStock: false,
  });

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "supplements", name: "Supplements", icon: "💊" },
    { id: "equipment", name: "Equipment", icon: "🏋️" },
    { id: "apparel", name: "Apparel", icon: "👕" },
    { id: "accessories", name: "Accessories", icon: "🎧" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
  ];

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, filters, searchQuery]);

  // ✅ CORRECT: Fetch products from /store/products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await API.get("/store/products");
      const productsData = response.data?.data || [];
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      // For demo - add sample products if API fails
      setProducts(getSampleProducts());
    } finally {
      setLoading(false);
    }
  };

  // ✅ CORRECT: Fetch cart from /store/cart
  const fetchCart = async () => {
    try {
      const response = await API.get("/store/cart");
      setCart(response.data?.data || { items: [], totalPrice: 0 });
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart({ items: [], totalPrice: 0 });
    }
  };

  // ✅ CORRECT: Add to cart using /store/cart/add
  const handleAddToCart = async (productId) => {
    try {
      await API.post("/store/cart/add", { productId, quantity: 1 });
      fetchCart(); // Refresh cart data

      // Show success feedback
      const product = products.find((p) => p._id === productId);
      if (product) {
        alert(`Added ${product.name} to cart!`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(
        (product) => product.category === filters.category
      );
    }

    // Price filters
    if (filters.minPrice) {
      filtered = filtered.filter(
        (product) => product.price >= parseFloat(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(
        (product) => product.price <= parseFloat(filters.maxPrice)
      );
    }

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter((product) => product.stock > 0);
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default: // newest
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilters({
      category: "all",
      minPrice: "",
      maxPrice: "",
      sortBy: "newest",
      inStock: false,
    });
  };

  const getProductInCart = (productId) => {
    return cart?.items?.find((item) => item.product?._id === productId);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`${
              i < fullStars
                ? "text-yellow-400"
                : i === fullStars && hasHalfStar
                ? "text-yellow-300"
                : "text-slate-600"
            } text-sm`}
          />
        ))}
        <span className="ml-2 text-sm text-slate-400">({rating})</span>
      </div>
    );
  };

  // Fallback sample products if API fails
  const getSampleProducts = () => [
    {
      _id: "1",
      name: "Protein Powder",
      description: "High-quality whey protein for muscle recovery",
      price: 39.99,
      category: "supplements",
      stock: 50,
      rating: 4.5,
      featured: true,
      createdAt: new Date(),
    },
    {
      _id: "2",
      name: "Yoga Mat",
      description: "Non-slip premium yoga mat",
      price: 29.99,
      category: "equipment",
      stock: 30,
      rating: 4.8,
      createdAt: new Date(),
    },
    {
      _id: "3",
      name: "Fitness Tracker",
      description: "Smart watch with heart rate monitoring",
      price: 129.99,
      category: "accessories",
      stock: 20,
      rating: 4.3,
      featured: true,
      createdAt: new Date(),
    },
    {
      _id: "4",
      name: "Workout Gloves",
      description: "Protective gloves for weight training",
      price: 24.99,
      category: "accessories",
      stock: 40,
      rating: 4.0,
      createdAt: new Date(),
    },
  ];

  const filteredProducts = filterAndSortProducts();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fff] flex items-center justify-center pt-24">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-t-green-500 border-b-emerald-400 border-transparent rounded-full animate-spin"></div>
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent">
                Fitness Store
              </h1>
              <p className="text-[#000] mt-2">
                Premium fitness products and equipment
              </p>
            </div>

            {/* ✅ CORRECT: Link to /cart (frontend page route) */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300"
            >
              <FaShoppingCart className="text-xl" />
              View Cart
              {cart?.items?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </Link>
          </div>
        </motion.div>

        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/40 rounded-2xl border border-green-700/30 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-green-600 to-emerald-600">
                <FaTruck className="text-white text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-[#000]">Free Shipping</h3>
                <p className="text-sm text-[#000]">On orders over $50</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-900/50 to-cyan-900/40 rounded-2xl border border-blue-700/30 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500">
                <FaShieldAlt className="text-white text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-[#000]">Secure Checkout</h3>
                <p className="text-sm text-[#000]">100% safe & encrypted</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/40 rounded-2xl border border-purple-700/30 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
                <FaLeaf className="text-white text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-[#000]">Quality Guarantee</h3>
                <p className="text-sm text-[#000]">30-day money back</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#000] rounded-2xl border border-slate-700 p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FaFilter />
              Filter Products
            </h2>
            <div className="flex gap-3">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
              <div className="text-[#fff]  text-sm">
                {filteredProducts.length} products found
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-[#fff] mb-2">
                Search Products
              </label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#fff] " />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, description..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-green-500 text-white"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-[#fff] mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-green-500 text-white"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-[#fff] mb-3">
                Price Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, minPrice: e.target.value })
                  }
                  placeholder="Min"
                  className="flex-1 px-2 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-green-500 text-white"
                  min="0"
                />
                <span className="text-[#fff] ">to</span>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, maxPrice: e.target.value })
                  }
                  placeholder="Max"
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-green-500 text-white"
                  min="0"
                />
              </div>
            </div>

            {/* Sort & Stock */}
            <div className="space-y-3 mt-20">
              <div>
                <label className="block text-sm font-medium text-[#fff]  mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters({ ...filters, sortBy: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-green-500 text-white"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) =>
                    setFilters({ ...filters, inStock: e.target.checked })
                  }
                  className="w-4 h-4 text-green-500 bg-slate-800 border-slate-700 rounded focus:ring-green-500"
                />
                <span className="text-sm text-[#fff] ">In Stock Only</span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Category Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <h3 className="text-lg font-bold text-white mb-4">
            Shop by Category
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories
              .filter((cat) => cat.id !== "all")
              .map((category) => (
                <button
                  key={category.id}
                  onClick={() =>
                    setFilters({ ...filters, category: category.id })
                  }
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    filters.category === category.id
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                      : "bg-[#000] hover:bg-slate-700 text-[#fff] "
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-[#000] rounded-2xl border border-slate-700 p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {filteredProducts.length} Products
            </h2>
            <div className="text-[#fff] text-sm">
              Showing {filteredProducts.length} of {products.length}
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => {
                const cartItem = getProductInCart(product._id);
                const isInCart = !!cartItem;

                return (
                  <div
                    key={product._id}
                    className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 hover:border-green-500/50 transition-all duration-300 overflow-hidden"
                  >
                    {/* Product Image */}
                    <div className="relative h-48 bg-slate-700 overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <FaBoxOpen className="text-[#fff]  text-2xl" />
                        )}
                      </div>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {product.featured && (
                          <span className="px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded">
                            <FaFire className="inline mr-1" />
                            Featured
                          </span>
                        )}
                        {product.stock <= 10 && product.stock > 0 && (
                          <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                            Low Stock
                          </span>
                        )}
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-slate-900/80 backdrop-blur-sm text-[#fff] text-xs rounded">
                          {product.category}
                        </span>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                        {product.name}
                      </h3>

                      <p className="text-sm text-[#fff]  mb-3 line-clamp-2">
                        {product.description || "No description available"}
                      </p>

                      {/* Rating */}
                      <div className="mb-3">
                        {renderStars(product.rating || 0)}
                      </div>

                      {/* Stock Status */}
                      <div className="mb-3">
                        {product.stock > 0 ? (
                          <span className="text-sm text-green-400">
                            ✓ In Stock ({product.stock} available)
                          </span>
                        ) : (
                          <span className="text-sm text-red-400">
                            ✗ Out of Stock
                          </span>
                        )}
                      </div>

                      {/* Price & Action */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-md font-bold text-green-400">
                            {formatPrice(product.price)}
                          </p>
                          {product.originalPrice && (
                            <p className="text-sm text-slate-500 line-through">
                              {formatPrice(product.originalPrice)}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => handleAddToCart(product._id)}
                          disabled={product.stock <= 0}
                          className={`px-2 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                            product.stock <= 0
                              ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                              : isInCart
                              ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                              : "bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg hover:shadow-green-500/30 text-white"
                          }`}
                        >
                          <FaShoppingCart />
                          {isInCart ? (
                            <>
                              Add More
                              <span className="text-xs bg-white/20 px-1 py-0.5 rounded">
                                {cartItem.quantity}
                              </span>
                            </>
                          ) : (
                            "Add to Cart"
                          )}
                        </button>
                      </div>

                      {/* Quick Actions */}
                      {isInCart && (
                        <div className="mt-3 pt-3 border-t border-slate-700">
                          <Link
                            to="/cart"
                            className="text-sm text-green-400 hover:text-green-300 transition-colors flex items-center gap-1"
                          >
                            <FaShoppingCart />
                            View in Cart →
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <FaBoxOpen className="text-slate-500 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-300 mb-2">
                No products found
              </h3>
              <p className="text-[#fff]  mb-6">
                {searchQuery ||
                filters.category !== "all" ||
                filters.minPrice ||
                filters.maxPrice
                  ? "Try adjusting your filters"
                  : "No products available at the moment"}
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition duration-300"
              >
                View All Products
              </button>
            </div>
          )}
        </motion.div>

        {/* Featured Products */}
        {products.filter((p) => p.featured).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold text-[#000] mb-6 flex items-center gap-2">
              <FaFire className="text-orange-500" />
              Featured Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products
                .filter((p) => p.featured)
                .slice(0, 3)
                .map((product) => (
                  <div
                    key={product._id}
                    className="bg-gradient-to-br from-orange-900/20 to-red-900/10 rounded-2xl border border-orange-700/30 p-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-16 rounded-xl bg-slate-800 flex items-center justify-center">
                        <FaBoxOpen className="text-[#fff] text-xl" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white">{product.name}</h3>
                        <p className="text-sm text-[#fff] line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-md font-bold text-orange-400">
                            {formatPrice(product.price)}
                          </p>
                          <button
                            onClick={() => handleAddToCart(product._id)}
                            disabled={product.stock <= 0}
                            className="px-3  py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm rounded-lg hover:shadow-lg transition-all duration-300"
                          >
                            Add to Cart
                          </button>
                        </div>
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

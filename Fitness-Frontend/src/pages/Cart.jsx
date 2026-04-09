import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaShoppingCart,
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowLeft,
  FaCreditCard,
  FaTruck,
  FaBox,
  FaTimes,
  FaLock,
} from "react-icons/fa";
import API from "../services/api";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  // ✅ CORRECT: Fetch cart from /store/cart
  const fetchCart = async () => {
    try {
      const response = await API.get("/store/cart");
      setCart(response.data?.data || { items: [], totalPrice: 0 });
    } catch (error) {
      console.error("Error fetching cart:", error);
      // For demo - create empty cart
      setCart({ items: [], totalPrice: 0 });
    } finally {
      setLoading(false);
    }
  };

  // ✅ CORRECT: Update quantity using /store/cart/add and /store/cart/remove
  const handleUpdateQuantity = async (itemId, change) => {
    try {
      setUpdating(itemId);

      const currentCart = await API.get("/store/cart");
      const item = currentCart.data?.data?.items?.find((i) => i._id === itemId);

      if (!item) return;

      const newQuantity = item.quantity + change;

      if (newQuantity < 1) {
        // Remove item if quantity becomes 0
        await API.delete(`/store/cart/remove/${itemId}`);
      } else {
        // Remove and re-add with new quantity
        await API.delete(`/store/cart/remove/${itemId}`);
        await API.post("/store/cart/add", {
          productId: item.product._id,
          quantity: newQuantity,
        });
      }

      // Refresh cart
      await fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity");
    } finally {
      setUpdating(null);
    }
  };

  // ✅ CORRECT: Remove item using /store/cart/remove/:id
  const handleRemoveItem = async (itemId) => {
    if (!window.confirm("Remove this item from cart?")) return;

    try {
      await API.delete(`/store/cart/remove/${itemId}`);
      fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item");
    }
  };

  // ✅ CORRECT: Clear entire cart
  const handleClearCart = async () => {
    if (!window.confirm("Clear all items from cart?")) return;

    try {
      if (cart?.items?.length > 0) {
        // Remove all items one by one
        for (const item of cart.items) {
          await API.delete(`/store/cart/remove/${item._id}`);
        }
      }
      fetchCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
      alert("Failed to clear cart");
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items || cart.items.length === 0) return 0;
    return (
      cart.totalPrice ||
      cart.items.reduce((sum, item) => {
        return sum + (item.product?.price || 0) * item.quantity;
      }, 0)
    );
  };

  const calculateTax = () => {
    return calculateTotal() * 0.1; // 10% tax
  };

  const calculateShipping = () => {
    const total = calculateTotal();
    return total >= 50 ? 0 : 5.99; // Free shipping over $50
  };

  const calculateGrandTotal = () => {
    const total = calculateTotal();
    const tax = calculateTax();
    const shipping = calculateShipping();
    return total + tax + shipping;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
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

  const total = calculateTotal();
  const tax = calculateTax();
  const shipping = calculateShipping();
  const grandTotal = calculateGrandTotal();

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
                Shopping Cart
              </h1>
              <p className="text-[#fff] mt-2">
                Review your items and proceed to checkout
              </p>
            </div>

            {/* ✅ CORRECT: Link to /products (frontend page route) */}
            <Link
              to="/products"
              className="px-6 py-3 bg-[#000] text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <FaArrowLeft />
              Continue Shopping
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-[#000] rounded-2xl border border-slate-700 p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <FaShoppingCart />
                  Your Cart ({cart?.items?.length || 0} items)
                </h2>
                {cart?.items?.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-2"
                  >
                    <FaTrash />
                    Clear Cart
                  </button>
                )}
              </div>

              {cart?.items?.length > 0 ? (
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div
                      key={item._id}
                      className="bg-slate-800/50 rounded-xl p-4 border border-slate-700"
                    >
                      <div className="flex items-start gap-4">
                        {/* Product Image */}
                        <div className="w-24 h-24 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.product?.image ? (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <FaBox className="text-2xl text-[#fff]" />
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-white text-lg">
                                {item.product?.name || "Product"}
                              </h3>
                              <p className="text-[#fff] text-sm">
                                {formatPrice(item.product?.price || 0)} each
                              </p>
                              {item.product?.description && (
                                <p className="text-xs text-[#fff] mt-1 line-clamp-1">
                                  {item.product.description}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item._id)}
                              className="text-red-400 hover:text-red-300 transition-colors p-2"
                              disabled={updating === item._id}
                            >
                              {updating === item._id ? (
                                <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <FaTimes />
                              )}
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(item._id, -1)
                                }
                                className="w-10 h-10 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50"
                                disabled={
                                  updating === item._id || item.quantity <= 1
                                }
                              >
                                {updating === item._id ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <FaMinus />
                                )}
                              </button>
                              <span className="font-bold text-white text-xl min-w-[40px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(item._id, 1)
                                }
                                className="w-10 h-10 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50"
                                disabled={
                                  updating === item._id ||
                                  item.product?.stock <= item.quantity
                                }
                              >
                                {updating === item._id ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <FaPlus />
                                )}
                              </button>
                            </div>

                            {/* Item Total */}
                            <div className="text-right">
                              <p className="text-2xl font-bold text-orange-400">
                                {formatPrice(
                                  (item.product?.price || 0) * item.quantity
                                )}
                              </p>
                              {item.product?.stock <= item.quantity && (
                                <p className="text-xs text-red-500">
                                  Max stock reached
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#000] flex items-center justify-center">
                    <FaShoppingCart className="text-slate-500 text-4xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#fff] mb-3">
                    Your cart is empty
                  </h3>
                  <p className="text-[#fff] mb-8 max-w-md mx-auto">
                    Looks like you haven't added any products to your cart yet.
                  </p>
                  <Link
                    to="/products"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 text-lg"
                  >
                    <FaArrowLeft />
                    Start Shopping Now
                  </Link>
                </div>
              )}
            </motion.div>

            {/* Shipping Info */}
            {cart?.items?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 bg-[#000] rounded-2xl border border-slate-700 p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <FaTruck />
                  Shipping Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <p className="text-sm text-[#fff] mb-1">
                      Standard Shipping
                    </p>
                    <p className="text-lg font-bold text-white">
                      {formatPrice(5.99)}
                    </p>
                    <p className="text-sm text-[#fff">3-5 business days</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/10 rounded-xl p-4 border border-green-700/30">
                    <p className="text-sm text-[#fff] mb-1">Free Shipping</p>
                    <p className="text-lg font-bold text-green-400">
                      {formatPrice(0)}
                    </p>
                    <p className="text-sm text-[#fff]">
                      On orders over $50
                      {total < 50 && (
                        <span className="block mt-1 text-green-300">
                          Add {formatPrice(50 - total)} more for free shipping
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-[#000] rounded-2xl border border-slate-700 p-6 sticky top-24"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between text-[#fff]">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <div className="flex justify-between text-[#fff]">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-400" : ""}>
                    {formatPrice(shipping)}
                  </span>
                </div>

                <div className="flex justify-between text-[#fff]">
                  <span>Tax (10%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>

                <div className="border-t border-slate-700 pt-4">
                  <div className="flex justify-between text-xl font-bold text-white">
                    <span>Total</span>
                    <span>{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {/* Free Shipping Progress */}
                {total < 50 && cart?.items?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="flex justify-between text-sm text-[#fff] mb-2">
                      <span>Free shipping at $50</span>
                      <span>{formatPrice(total)} / $50</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                        style={{ width: `${(total / 50) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-[#fff] mt-2">
                      Add {formatPrice(50 - total)} more for free shipping
                    </p>
                  </div>
                )}
              </div>

              {/* Checkout Button */}
              {cart?.items?.length > 0 ? (
                <>
                  <button className="w-full mt-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300 flex items-center justify-center gap-3 text-lg">
                    <FaCreditCard />
                    Proceed to Checkout
                  </button>

                  <p className="text-center text-sm text-[#fff] mt-4">
                    By continuing, you agree to our Terms & Conditions
                  </p>
                </>
              ) : (
                <Link
                  to="/products"
                  className="block w-full mt-8 py-4 bg-[#000] text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 text-center"
                >
                  Browse Products
                </Link>
              )}
            </motion.div>

            {/* Security Assurance */}
            {cart?.items?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-6 bg-gradient-to-br from-blue-900/20 to-cyan-900/30 rounded-2xl border border-blue-700/40 p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500">
                    <FaLock className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#000]">Secure Checkout</h3>
                    <p className="text-sm text-slate-400">
                      Your payment is safe with us
                    </p>
                  </div>
                </div>
                <div className="text-sm text-slate-500 space-y-1">
                  <div>• 256-bit SSL encryption</div>
                  <div>• No credit card fees</div>
                  <div>• 30-day money back guarantee</div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

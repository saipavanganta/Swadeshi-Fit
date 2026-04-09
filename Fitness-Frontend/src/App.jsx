// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Blogs from "./pages/Blogs";
import FitnessActivity from "./pages/FitnessActivity";
import FitnessTracker from "./pages/FitnessTracker";
import CompleteProfile from "./pages/Completeprofile";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-[#f1f1f1] text-[#000]">
          <Navbar />
          <main className="grow pt-24">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/complete-profile"
                element={
                  <ProtectedRoute>
                    <CompleteProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <Products />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/blogs"
                element={
                  <ProtectedRoute>
                    <Blogs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/activities"
                element={
                  <ProtectedRoute>
                    <FitnessActivity />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tracker"
                element={
                  <ProtectedRoute>
                    <FitnessTracker />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

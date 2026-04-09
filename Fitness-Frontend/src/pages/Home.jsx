import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaFire,
  FaHeartbeat,
  FaBrain,
  FaUsers,
  FaStar,
  FaArrowRight,
} from "react-icons/fa";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <FaFire />,
      title: "Personalised Workouts",
      desc: "Custom fitness plans designed to match your goals and lifestyle",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: <FaHeartbeat />,
      title: "Holistic Health",
      desc: "Traditional Indian wellness practices blended with modern science",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <FaBrain />,
      title: "Smart Tracking",
      desc: "Monitor your progress with easy-to-understand metrics and insights",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <FaUsers />,
      title: "Community Support",
      desc: "Connect, share, and grow with a supportive fitness community",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Software Engineer",
      text: "Lost 15kg in 3 months with personalized yoga and diet plans!",
      img: "👨‍💻",
    },
    {
      name: "Priya Sharma",
      role: "College Student",
      text: "The app fits my schedule perfectly and suggests workouts I can actually follow.",
      img: "👩‍🎓",
    },
    {
      name: "Amit Patel",
      role: "Business Owner",
      text: "Traditional Indian exercises combined with modern tracking — brilliant!",
      img: "👨‍💼",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f1f1] flex items-center justify-center">
        <div className="relative">
          <div className="w-10 h-10 border-4 my-10 border-t-orange-500 border-b-yellow-500 border-transparent rounded-full animate-spin"></div>
          <div
            className="absolute inset-0 w-16 h-16 border-4 border-transparent border-l-orange-500 border-r-yellow-500 rounded-full animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f1f1]  text-[#000000] overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-orange-500/10 to-transparent"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/5 to-yellow-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-red-500/5 to-orange-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-full border border-orange-500/30 mb-6">
                <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-orange-500">
                  🇮🇳 India's #1 Fitness Platform
                </span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold mb-6">
                <span className="block bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500  bg-clip-text text-transparent">
                  Transform Your
                </span>
                <span className="block bg-[#000000]  bg-clip-text text-transparent">
                  Fitness Journey
                </span>
              </h1>

              <p className="text-xl text-[#000000] mb-8 max-w-2xl">
                Where Ancient Indian Wisdom Meets Modern Fitness. Experience a
                natural, sustainable approach to wellness like never before.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/signup"
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                  Start Free Trial
                  <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link
                  to="/dashboard"
                  className="px-8 py-4 bg-[#000000] border border-gray-700 text-white font-bold rounded-xl hover:bg-gray-900/80 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <span>View Demo</span>
                  <span className="text-xs px-2 py-1 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded">
                    Free
                  </span>
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-8 mr-40">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                    50K+
                  </div>
                  <div className="text-sm text-gray-400">Active Members</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                    95%
                  </div>
                  <div className="text-sm text-gray-400">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                    24/7
                  </div>
                  <div className="text-sm text-[#fff]">AI Support</div>
                </div>
              </div>
            </motion.div>

            {/* Right Animation */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-96 lg:h-[500px]">
                {/* Main Rotating Logo */}
                <motion.div
                  className="absolute inset-0 m-auto w-64 h-64 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl rotate-45 shadow-2xl shadow-orange-500/30"
                  animate={{
                    rotate: [45, 405],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    rotate: { repeat: Infinity, duration: 20, ease: "linear" },
                    scale: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                  }}
                >
                  <div className="absolute inset-4 bg-gradient-to-tr from-transparent to-white/10 rounded-xl"></div>
                </motion.div>

                {/* Floating Particles */}
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2 + Math.random() * 2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Why Choose
              </span>{" "}
              <span className="text-[#000000]">SwadeshiFit?</span>
            </h2>
            <p className="text-[#000000] text-lg max-w-2xl mx-auto">
              We combine traditional Indian fitness wisdom with modern
              technology to create a truly personalized wellness experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="group relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-[#000000] rounded-xl p-6 border border-gray-700">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300`}
                  >
                    <div className="text-2xl text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
                Success Stories
              </span>
            </h2>
            <p className="text-[#fff] text-lg">
              Join thousands who transformed their lives
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-[#000000] rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.img}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-orange-500">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-300 italic">"{testimonial.text}"</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className="w-4 h-4 text-yellow-500 fill-current"
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-orange-500/10 rounded-3xl border border-orange-500/20 p-12 text-center overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:50px_50px]"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                  Ready to Transform
                </span>
                <span className="text-[#000000]"> Your Life?</span>
              </h2>
              <p className="text-xl text-[#000000] mb-8 max-w-2xl mx-auto">
                Start your 14-day free trial. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 transform hover:scale-105"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/blogs"
                  className="px-8 py-4 bg-[#000000] border border-gray-700 text-white font-bold rounded-xl hover:bg-gray-900/90 transition-all duration-300"
                >
                  Read Our Blog
                </Link>
                <Link
                  to="/blogs"
                  className="px-8 py-4 bg-[#000000] border border-gray-700 text-white font-bold rounded-xl hover:bg-gray-900/90 transition-all duration-300"
                >
                  Products
                </Link>
              </div>
              <p className="text-[#000000] text-sm mt-6">
                Already have an account?{" "}
                <Link
                  to="/"
                  className="text-orange-400 hover:text-orange-300 font-semibold"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer Note */}
      <div className="py-8 px-4 border-t border-gray-800">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          <p>
            © 2024 SwadeshiFit. All rights reserved. | स्वदेशी पथ पर स्वस्थ कदम
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <Link to="/blogs" className="hover:text-orange-400 transition">
              Blog
            </Link>
            <Link to="/cart" className="hover:text-orange-400 transition">
              Shop
            </Link>
            <a href="#" className="hover:text-orange-400 transition">
              Privacy
            </a>
            <a href="#" className="hover:text-orange-400 transition">
              Terms
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

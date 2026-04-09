import { motion } from "framer-motion";

export default function Preloader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-950 flex flex-col justify-center items-center z-50 overflow-hidden"
    >
      {/* Background Animated Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      {/* Main Loading Container */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Rotating Logo */}
        <div className="relative">
          <motion.div
            className="w-32 h-32 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl rotate-45 shadow-2xl shadow-orange-500/30"
            animate={{
              rotate: [45, 405],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { repeat: Infinity, duration: 3, ease: "linear" },
              scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
            }}
          >
            <div className="absolute inset-2 bg-gradient-to-tr from-transparent to-white/10 rounded-xl"></div>
          </motion.div>

          {/* Outer Ring */}
          <motion.div
            className="absolute -inset-4 border-2 border-transparent border-t-orange-500 border-b-yellow-400 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />

          {/* Inner Ring */}
          <motion.div
            className="absolute -inset-6 border border-transparent border-l-orange-400 border-r-yellow-300 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          />

          {/* Glowing Dot */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-2">
          <motion.h1
            className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            SwadeshiFit
          </motion.h1>

          <motion.p
            className="text-gray-400 font-mono text-sm tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            स्वदेशी पथ पर स्वस्थ कदम
          </motion.p>

          {/* Loading Dots */}
          <motion.div
            className="flex justify-center gap-2 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full"
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8,
                  delay: i * 0.1,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Progress Bar */}
        <motion.div
          className="w-64 h-1.5 bg-gray-800 rounded-full overflow-hidden mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Status Text */}
        <motion.div
          className="text-xs text-gray-500 font-mono mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            Loading AI-Powered Fitness Platform...
          </motion.span>
        </motion.div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-2 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent"
          animate={{ x: ["0%", "100%"] }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}

import { useState } from "react";

export default function Card({
  title,
  description,
  icon,
  gradient = "from-orange-500 to-yellow-500",
  tag,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group cursor-pointer transition-all duration-300 hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Glow */}
      <div
        className={`absolute -inset-1 bg-gradient-to-r ${gradient} rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500`}
      ></div>

      {/* Main Card */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 overflow-hidden">
        {/* Top Gradient Line */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`}
        ></div>

        {/* Tag */}
        {tag && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-orange-300 rounded-full border border-orange-500/30">
              {tag}
            </span>
          </div>
        )}

        {/* Icon */}
        <div className="mb-6">
          <div
            className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg`}
          >
            {icon ? (
              <span className="text-2xl">{icon}</span>
            ) : (
              <span className="text-xl font-bold text-white">#</span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold mb-4 relative">
          <span
            className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
          >
            {title}
          </span>
          <span
            className={`absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r ${gradient} rounded-full transition-all duration-300 ${
              isHovered ? "w-full" : "w-0"
            }`}
          ></span>
        </h3>

        {/* Description */}
        <p className="text-gray-300 mb-6 leading-relaxed">{description}</p>

        {/* CTA */}
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center gap-2 transition-all duration-300 ${
              isHovered ? "translate-x-1" : ""
            }`}
          >
            <span
              className={`text-sm font-semibold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
            >
              Learn More
            </span>
            <svg
              className={`w-4 h-4 transition-all duration-300 ${
                isHovered ? "translate-x-1" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>

          {/* Pulse Dot */}
          <div className="relative">
            <div
              className={`w-2 h-2 bg-gradient-to-r ${gradient} rounded-full`}
            >
              {isHovered && (
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-full animate-ping`}
                ></div>
              )}
            </div>
          </div>
        </div>

        {/* Corner Accents */}
        <div className="absolute top-4 left-4 w-2 h-2 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full opacity-50"></div>
        <div className="absolute bottom-4 right-4 w-2 h-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full opacity-50"></div>
      </div>
    </div>
  );
}

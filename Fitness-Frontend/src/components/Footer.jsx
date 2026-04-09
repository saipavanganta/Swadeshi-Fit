import { useState } from "react";

export default function Footer() {
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const socialLinks = [
    {
      label: "Twitter",
      emoji: "𝕏",
      color: "hover:text-gray-300",
      bgColor: "hover:bg-black/30",
      link: "#",
    },
    {
      label: "Instagram",
      emoji: "📷",
      color: "hover:text-pink-500",
      bgColor: "hover:bg-pink-500/20",
      link: "#",
    },
    {
      label: "YouTube",
      emoji: "▶️",
      color: "hover:text-red-500",
      bgColor: "hover:bg-red-500/20",
      link: "#",
    },
    {
      label: "LinkedIn",
      emoji: "💼",
      color: "hover:text-blue-600",
      bgColor: "hover:bg-blue-600/20",
      link: "#",
    },
  ];

  const footerLinks = [
    { label: "Privacy Policy", link: "#" },
    { label: "Terms of Service", link: "#" },
    { label: "About Us", link: "#" },
    { label: "Contact", link: "#" },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white pt-10 pb-6 border-t border-gray-800">
      {/* Top Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg rotate-45"></div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
                  SwadeshiFit
                </h2>
                <p className="text-sm text-gray-400 font-mono">
                  स्वदेशी पथ पर स्वस्थ कदम
                </p>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              Revolutionizing fitness with India's traditional wisdom and modern
              AI technology.
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span className="text-orange-500">✉️</span>
                <span>support@swadeshifit.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-orange-400">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.link}
                    className="group flex items-center text-gray-300 hover:text-white transition-all duration-300"
                  >
                    <span className="w-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full group-hover:w-4 mr-2 transition-all duration-300"></span>
                    <span className="group-hover:translate-x-2 transition-transform duration-300">
                      {item.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media & Newsletter */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-orange-400 mb-4">
                Connect With Us
              </h3>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    className={`relative p-3 rounded-xl bg-gray-800 border border-gray-700 ${social.color} ${social.bgColor} transition-all duration-300 group`}
                    onMouseEnter={() => setHoveredIcon(social.label)}
                    onMouseLeave={() => setHoveredIcon(null)}
                  >
                    <div className="text-xl transition-transform duration-300 group-hover:scale-110">
                      {social.emoji}
                    </div>
                    {hoveredIcon === social.label && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        {social.label}
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="pt-4">
              <h4 className="text-sm font-semibold text-gray-300 mb-3">
                Subscribe to our newsletter
              </h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 text-white placeholder-gray-500"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-6"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm flex items-center justify-center md:justify-start gap-2">
              © 2025 SwadeshiFit. All Rights Reserved.
              <span className="hidden md:inline">|</span>
              <span className="flex items-center gap-1">
                Made with <span className="text-red-500">❤️</span> in India
              </span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              <span className="text-orange-500 font-semibold">v2.1.4</span>
              <span className="mx-2">•</span>
              <span>AI-Powered Fitness</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../ui/Header';
import CartModal from '../ui/CartModal';
import AuthModal from '../ui/AuthModal';
import { Eye, Users, Award, Globe, TrendingUp, Shield, LayoutDashboard, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  const marketStats = [
    { value: "$10.4B", label: "India Eyewear Market (2024)" },
    { value: "30%", label: "Organized Market Share (2024)" },
    { value: "45%", label: "Expected Organized Share (2030)" },
    { value: "₹204.97L", label: "Projected 5-Year Profit" }
  ];

  const strategyPillars = [
    {
      icon: <TrendingUp size={28} />,
      title: "Strategic Positioning",
      description: "Targeting underserved Tier 2 & 3 cities where demand is rising, but quality is absent."
    },
    {
      icon: <LayoutDashboard size={28} />,
      title: "Omni-Channel Retail",
      description: "Combining e-commerce, AR tech, and physical stores to scale quickly and efficiently."
    },
    {
      icon: <Shield size={28} />,
      title: "Trust & Quality",
      description: "Built on premium, tested materials and imports — EyeLura is a brand you can trust."
    }
  ];

  const cityExpansion = [
    "Coimbatore", "Ludhiana", "Indore", "Surat", "Lucknow", "Vadodara", "Kochi", "Jaipur", "Bhubaneswar"
  ];

  const team = [
    {
      name: 'Saunak Mohan',
      role: 'CEO',
      bio: 'Former tech executive, building scalable retail ecosystems.'
    },
    {
      name: 'Saurabh Mohan',
      role: 'CMO',
      bio: '15+ years in fashion retail, brand-building specialist.'
    },
    {
      name: 'Abhilasha Mohan',
      role: 'Founder',
      bio: 'Visionary behind EyeLura, committed to accessible design.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative">
      <Header onCartClick={() => setIsCartOpen(true)} />

      {/* Background Glow (from Shop.jsx) */}
      <div className="absolute inset-0 opacity-10 -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      {/* HERO */}
      <section className="pt-32 pb-20 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
        >
          Revolutionizing India’s Vision Economy
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-xl max-w-3xl mx-auto text-gray-300"
        >
          EyeLura blends fashion, technology, and strategy to lead India's eyewear evolution — accessible, scalable, and data-driven.
        </motion.p>
        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => navigate('/faq')}
            className="px-6 py-3 bg-[#d4af37] text-black rounded-full hover:bg-[#e6c14d] transition flex items-center gap-2"
          >
            Explore FAQ's<ArrowRight size={18} />
          </button>
          <button
            onClick={() => navigate('/accessibility')}
            className="px-6 py-3 border border-[#d4af37] text-[#d4af37] rounded-full hover:bg-[#d4af37]/10 transition"
          >
            Accessibility
          </button>
        </div>
      </section>

      {/* MARKET STATS */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-semibold mb-4 text-white">India's Eyewear Market Landscape</h2>
          <p className="text-gray-400 text-lg">
            We're tapping into one of the most dynamic segments in modern retail. Here's how the numbers stack up:
          </p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {marketStats.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="rounded-xl bg-white/5 p-6 border border-[#d4af37]/20 shadow hover:shadow-xl transition"
            >
              <div className="text-3xl font-bold text-[#d4af37] mb-2">{item.value}</div>
              <div className="text-gray-300 text-sm">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* STRATEGIC MODEL */}
      <section id="model" className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-semibold mb-4 text-white">The EyeLura Model</h2>
          <p className="text-gray-400 text-lg">
            Our strategy combines product, platform, and place — built on solid financials and powerful customer insights.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {strategyPillars.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 rounded-xl p-6 border border-[#d4af37]/20 shadow hover:shadow-xl"
            >
              <div className="w-12 h-12 bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center rounded-md mb-4">
                {item.icon}
              </div>
              <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
              <p className="text-gray-300 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-10">
          <div className="p-6 bg-white/5 rounded-xl shadow border border-[#d4af37]/20">
            <h3 className="text-xl font-semibold mb-4 text-white">Tier 2 & 3 City Expansion</h3>
            <p className="text-gray-400 mb-4 text-sm">
              We're scaling into high-potential cities where demand is strong, but modern eyewear options are limited.
            </p>
            <div className="flex flex-wrap gap-2">
              {cityExpansion.map((city, idx) => (
                <span key={idx} className="text-sm bg-[#d4af37]/10 text-[#d4af37] px-3 py-1 rounded-full">
                  {city}
                </span>
              ))}
            </div>
          </div>
          <div className="p-6 bg-[#d4af37] text-black rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4">Financial Highlights</h3>
            <ul className="space-y-3 text-sm font-medium">
              <li>• Breakeven: 6 months</li>
              <li>• Year 1 Net Profit: ₹63.2L</li>
              <li>• 5-Year Profit: ₹204.97L</li>
              <li>• ROI by Year 3: 75–80%</li>
            </ul>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-semibold mb-4 text-white">Meet the Visionaries</h2>
          <p className="text-gray-400 text-lg">The minds and hearts behind EyeLura’s journey.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/5 p-6 rounded-xl text-center shadow hover:shadow-xl border border-[#d4af37]/20"
            >
              <div className="h-32 w-32 mx-auto rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 mb-4" />
              <h4 className="text-lg font-semibold text-white">{member.name}</h4>
              <p className="text-[#d4af37] font-medium">{member.role}</p>
              <p className="text-gray-400 text-sm mt-2">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#d4af37] text-black text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to See the Future?</h2>
        <p className="text-lg mb-8">Join the movement that’s redefining Indian eyewear — with trust, tech, and taste.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => navigate('/shop')}
            className="px-8 py-3 bg-black text-[#d4af37] rounded-full hover:bg-gray-900 transition"
          >
            Shop Now
          </button>
          <button
            onClick={() => navigate('/contact')}
            className="px-8 py-3 border border-black rounded-full hover:bg-black/10 transition"
          >
            Contact Us
          </button>
        </div>
      </section>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AuthModal />
    </div>
  );
}

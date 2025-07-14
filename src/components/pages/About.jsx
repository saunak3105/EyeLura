import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Users, Award, Globe } from 'lucide-react';

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { icon: <Users className="w-8 h-8" />, number: '50K+', label: 'Happy Customers' },
    { icon: <Eye className="w-8 h-8" />, number: '100K+', label: 'AR Try-Ons' },
    { icon: <Award className="w-8 h-8" />, number: '4.9/5', label: 'Customer Rating' },
    { icon: <Globe className="w-8 h-8" />, number: '25+', label: 'Countries Served' }
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b9e0e4d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Former tech executive with a passion for accessible eyewear'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Head of Design',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Award-winning designer with 15+ years in luxury fashion'
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Chief Optometrist',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      bio: 'Leading optometrist specializing in digital eye strain'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 pt-20">
      {/* Hero Section with Logo */}
      <div className={`py-20 px-4 sm:px-6 lg:px-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/')}
              className="text-3xl text-gray-900 hover:text-[#d4af37] transition-all duration-300 font-bold"
              style={{ fontFamily: "'Crimson Text', serif", fontWeight: '600' }}
            >
              EyeLura
            </button>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-sm text-[#d4af37] font-medium shadow-sm mb-6">
              <span className="w-2 h-2 bg-[#d4af37] rounded-full mr-2 animate-pulse"></span>
              Our Story
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Crimson Text', serif", fontWeight: '600' }}>
              Redefining <span className="text-[#d4af37]">Vision</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              At EyeLura, we believe that exceptional eyewear should be accessible to everyone. 
              Our mission is to combine cutting-edge technology with timeless design to create 
              the perfect pair of glasses for the modern generation.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className={`py-16 px-4 sm:px-6 lg:px-8 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-[#d4af37] rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '700' }}>
                  {stat.number}
                </div>
                <div className="text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className={`py-20 px-4 sm:px-6 lg:px-8 transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900" style={{ fontFamily: "'Crimson Text', serif", fontWeight: '600' }}>
                Our Journey
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                Founded in 2020 by a team of passionate designers and technologists, EyeLura emerged 
                from a simple observation: quality eyewear was either too expensive or lacked the 
                innovation that modern consumers deserved.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                We set out to change that by combining premium materials, cutting-edge AR technology, 
                and direct-to-consumer pricing to make exceptional eyewear accessible to students 
                and young professionals worldwide.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#d4af37] rounded-full"></div>
                  <span className="text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>Premium materials at affordable prices</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#d4af37] rounded-full"></div>
                  <span className="text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>Revolutionary AR try-on technology</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#d4af37] rounded-full"></div>
                  <span className="text-gray-700" style={{ fontFamily: "'Inter', sans-serif" }}>Student-focused pricing and discounts</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1556306535-38febf6782e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="EyeLura Workshop"
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className={`py-20 px-4 sm:px-6 lg:px-8 bg-white/30 transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Crimson Text', serif", fontWeight: '600' }}>
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
              The passionate individuals behind EyeLura's vision and innovation
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600' }}>
                    {member.name}
                  </h3>
                  <p className="text-[#d4af37] font-semibold mb-3" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600' }}>
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className={`py-20 px-4 sm:px-6 lg:px-8 transform transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-16" style={{ fontFamily: "'Crimson Text', serif", fontWeight: '600' }}>
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-[#d4af37] rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600' }}>
                Quality First
              </h3>
              <p className="text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                We never compromise on quality, using only premium materials and rigorous testing
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-[#d4af37] rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600' }}>
                Innovation
              </h3>
              <p className="text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                Constantly pushing boundaries with AR technology and modern design
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-[#d4af37] rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Inter', sans-serif", fontWeight: '600' }}>
                Accessibility
              </h3>
              <p className="text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
                Making premium eyewear accessible to students and young professionals
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
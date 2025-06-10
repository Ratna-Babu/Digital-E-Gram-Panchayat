import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  UserIcon,
  UsersIcon,
  UserCircleIcon,
  ArrowRightIcon,
  Bars3Icon,
  XMarkIcon,
  CheckCircleIcon,
  StarIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6 }
};

const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, currentUserRole } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <GlobeAltIcon className="w-6 h-6 text-white" />
            </div>
            <span className={`text-xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
              E-Gram Panchayat
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className={`font-medium transition-colors hover:text-green-600 ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                {item.name}
              </motion.a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              // Logged in user navigation
              <>
                <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-green-100">
                  <UserCircleIcon className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700 capitalize">
                    {currentUserRole || 'User'}
                  </span>
                </div>
                <motion.button
                  onClick={() => {
                    switch (currentUserRole) {
                      case 'user':
                        navigate('/user/dashboard');
                        break;
                      case 'staff':
                        navigate('/staff/dashboard');
                        break;
                      case 'admin':
                      case 'officer':
                        navigate('/admin/dashboard');
                        break;
                      default:
                        navigate('/login');
                    }
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Dashboard
                </motion.button>
              </>
            ) : (
              // Guest user navigation
              <>
                <motion.button
                  onClick={() => navigate('/login')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isScrolled 
                      ? 'text-gray-700 hover:bg-gray-100' 
                      : 'text-white hover:bg-white/10'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Login
                </motion.button>
                <motion.button
                  onClick={() => navigate('/register')}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign Up
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? (
              <XMarkIcon className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
            ) : (
              <Bars3Icon className={`w-6 h-6 ${isScrolled ? 'text-gray-900' : 'text-white'}`} />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white rounded-lg shadow-lg mt-2 py-4"
          >
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="border-t mt-4 pt-4 px-4 space-y-2">
              {user ? (
                <>
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-green-100 mb-2">
                    <UserCircleIcon className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700 capitalize">
                      {currentUserRole || 'User'}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      switch (currentUserRole) {
                        case 'user':
                          navigate('/user/dashboard');
                          break;
                        case 'staff':
                          navigate('/staff/dashboard');
                          break;
                        case 'admin':
                        case 'officer':
                          navigate('/admin/dashboard');
                          break;
                        default:
                          navigate('/login');
                      }
                      setIsMenuOpen(false);
                    }}
                    className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Dashboard
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full text-left py-2 text-gray-700 hover:text-green-600"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, currentUserRole } = useAuth();

  const features = [
    {
      title: "Apply for Schemes",
      description: "Citizens can apply for welfare schemes from home with just a few clicks",
      icon: DocumentTextIcon,
      color: "from-blue-500 to-blue-600",
      targetPath: "/user/apply",
      allowedRoles: ["user"],
    },
    {
      title: "Track Application Status",
      description: "Real-time updates and complete transparency throughout the process",
      icon: ClipboardDocumentCheckIcon,
      color: "from-green-500 to-green-600",
      targetPath: "/user/applications",
      allowedRoles: ["user"],
    },
    {
      title: "Admin & Staff Management",
      description: "Efficient management system for officers and staff to handle requests",
      icon: UserGroupIcon,
      color: "from-purple-500 to-purple-600",
      targetPath: "/admin/dashboard",
      allowedRoles: ["admin", "officer", "staff"],
    },
  ];

  const steps = [
    {
      title: "Register or Login",
      description: "Create your account in minutes with simple verification",
      icon: UserIcon,
    },
    {
      title: "Browse Services",
      description: "Explore available government schemes and services",
      icon: ClipboardDocumentCheckIcon,
    },
    {
      title: "Apply & Upload",
      description: "Submit applications with digital document upload",
      icon: DocumentTextIcon,
    },
    {
      title: "Track & Receive",
      description: "Monitor progress and receive updates instantly",
      icon: CheckCircleIcon,
    },
  ];

  const roles = [
    {
      title: "Citizens",
      description: "Apply for services, track applications, and receive updates",
      icon: UserIcon,
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Staff Members",
      description: "Review applications, update statuses, and assist citizens",
      icon: UsersIcon,
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Officers",
      description: "Manage services, oversee operations, and ensure efficiency",
      icon: UserCircleIcon,
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Farmer",
      content: "The application process for farming subsidies became so much easier. I can track everything from my phone.",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Village Resident",
      content: "No more long queues at the office. I applied for my pension scheme online and got approval within days.",
      rating: 5,
    },
    {
      name: "Amit Patel",
      role: "Small Business Owner",
      content: "The transparency in the application process gives me confidence. I always know exactly where my application stands.",
      rating: 5,
    },
  ];

  const stats = [
    { number: "50K+", label: "Applications Processed" },
    { number: "98%", label: "Customer Satisfaction" },
    { number: "24/7", label: "Service Availability" },
    { number: "15+", label: "Government Schemes" },
  ];

  const benefits = [
    {
      icon: ClockIcon,
      title: "Save Time",
      description: "Apply from anywhere, anytime without visiting offices",
    },
    {
      icon: ShieldCheckIcon,
      title: "Secure & Safe",
      description: "Your data is protected with bank-level security",
    },
    {
      icon: CheckCircleIcon,
      title: "Fast Processing",
      description: "Automated workflows ensure quick application processing",
    },
    {
      icon: GlobeAltIcon,
      title: "Always Accessible",
      description: "24/7 availability with mobile-friendly interface",
    },
  ];

  // Handle feature card click
  const handleFeatureClick = (feature) => {
    // If user is not logged in, redirect to login
    if (!user) {
      navigate('/login');
      return;
    }

    // Check if user has permission for this feature
    if (feature.allowedRoles.includes(currentUserRole)) {
      navigate(feature.targetPath);
    } else {
      // If user doesn't have permission, show role-specific navigation
      switch (currentUserRole) {
        case 'user':
          if (feature.title === "Admin & Staff Management") {
            // User trying to access admin features - redirect to login with admin options
            navigate('/login');
          } else {
            navigate('/user/dashboard');
          }
          break;
        case 'staff':
          navigate('/staff/dashboard');
          break;
        case 'admin':
        case 'officer':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/login');
      }
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-green-600 via-blue-600 to-purple-700 py-20 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center text-white"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent"
            >
              Digital Governance
              <span className="block text-4xl md:text-6xl mt-2">Made Simple</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-green-100"
            >
              Experience seamless access to Gram Panchayat services with our modern digital platform. Fast, transparent, and accessible for everyone.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <motion.button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-white text-green-600 rounded-xl hover:bg-green-50 transition-all duration-300 flex items-center justify-center gap-2 font-semibold text-lg shadow-xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Today
                <ArrowRightIcon className="w-6 h-6" />
              </motion.button>
              <motion.button
                onClick={() => navigate('/login')}
                className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl hover:bg-white hover:text-green-600 transition-all duration-300 font-semibold text-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Already a User?
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-green-100 text-sm md:text-base">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of government services with our innovative digital solutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="text-center p-6 rounded-2xl bg-gradient-to-b from-gray-50 to-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Click on any service to get started. {!user && "You'll need to login first."}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => handleFeatureClick(feature)}
                className="relative overflow-hidden p-8 rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer group"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-r ${feature.color} rounded-full -translate-y-16 translate-x-16 opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                
                {/* Click indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRightIcon className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-green-600 transition-colors duration-300">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                
                {/* Access indicator */}
                <div className="flex items-center text-sm text-gray-500">
                  {user && feature.allowedRoles.includes(currentUserRole) ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircleIcon className="w-4 h-4 mr-2" />
                      <span>You have access</span>
                    </div>
                  ) : user && !feature.allowedRoles.includes(currentUserRole) ? (
                    <div className="flex items-center text-yellow-600">
                      <ShieldCheckIcon className="w-4 h-4 mr-2" />
                      <span>Different role required</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-blue-600">
                      <UserIcon className="w-4 h-4 mr-2" />
                      <span>Login required</span>
                    </div>
                  )}
                </div>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
              </motion.div>
            ))}
          </div>
          
          {/* Additional service note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 mb-4">
              Want to access all services? 
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                <>
                  <motion.button
                    onClick={() => navigate('/register')}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Create Account
                  </motion.button>
                  <motion.button
                    onClick={() => navigate('/login')}
                    className="px-6 py-3 bg-white text-green-600 border-2 border-green-600 rounded-xl hover:bg-green-50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Login
                  </motion.button>
                </>
              ) : (
                <motion.button
                  onClick={() => {
                    switch (currentUserRole) {
                      case 'user':
                        navigate('/user/dashboard');
                        break;
                      case 'staff':
                        navigate('/staff/dashboard');
                        break;
                      case 'admin':
                      case 'officer':
                        navigate('/admin/dashboard');
                        break;
                      default:
                        navigate('/login');
                    }
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Go to Dashboard
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in just four simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative text-center"
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-green-300 to-blue-300 -z-10" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="about" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for Everyone</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform serves different user types with tailored experiences
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`p-8 rounded-3xl ${role.bgColor} shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                <role.icon className={`w-16 h-16 ${role.iconColor} mb-6`} />
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{role.title}</h3>
                <p className="text-gray-700 leading-relaxed">{role.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What People Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from citizens who have transformed their experience with government services
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl bg-gradient-to-b from-white to-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Join thousands of citizens who are already benefiting from our digital services
            </p>
            <motion.button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-white text-green-600 rounded-xl hover:bg-green-50 transition-all duration-300 flex items-center justify-center gap-2 font-semibold text-lg shadow-xl mx-auto"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Journey
              <ArrowRightIcon className="w-6 h-6" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer Section */}
      <footer id="contact" className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <GlobeAltIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">E-Gram Panchayat</span>
              </div>
              <p className="text-gray-400 mb-4">
                Transforming governance through digital innovation for a better tomorrow.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#home" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Welfare Schemes</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Birth Certificates</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Property Tax</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Business Licenses</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-gray-400">
                <li>📧 support@egram.gov.in</li>
                <li>📞 1800-XXX-XXXX</li>
                <li>🕒 24/7 Support Available</li>
                <li>📍 Government Complex, New Delhi</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 E-Services for Gram Panchayat. All rights reserved. | 
              <a href="#" className="text-green-400 hover:text-green-300 ml-2">Privacy Policy</a> | 
              <a href="#" className="text-green-400 hover:text-green-300 ml-2">Terms of Service</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 
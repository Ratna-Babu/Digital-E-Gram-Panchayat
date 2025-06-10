import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import {
  EyeIcon,
  EyeSlashIcon,
  UserCircleIcon,
  LockClosedIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminOptions, setShowAdminOptions] = useState(false);
  const [selectedRole, setSelectedRole] = useState('user');
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email format is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showToast = (message, type = 'success') => {
    // Create a toast notification
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } transform transition-all duration-300 translate-x-full`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.remove('translate-x-full'), 100);
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  const toggleAdminOptions = () => {
    setShowAdminOptions(!showAdminOptions);
    if (!showAdminOptions) {
      setSelectedRole('user');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Sign in user with Firebase Auth
      const userCredential = await login(formData.email, formData.password);
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }

      const userData = userDoc.data();

      // Check if user has permission for selected role
      if (showAdminOptions && selectedRole !== 'user') {
        if (userData.role !== selectedRole && userData.role !== 'admin' && 
            !(userData.role === 'officer' && selectedRole === 'officer')) {
          throw new Error('Unauthorized role access');
        }
      }

      // Set active role in Firestore
      const activeRole = showAdminOptions ? selectedRole : userData.role;
      await updateDoc(doc(db, 'users', userCredential.user.uid), {
        activeRole: activeRole,
        lastLoginAt: new Date().toISOString()
      });

      // Role-based redirection
      let redirectPath;
      switch (activeRole) {
        case 'user':
          redirectPath = '/user/dashboard';
          break;
        case 'staff':
          redirectPath = '/staff/dashboard';
          break;
        case 'officer':
        case 'admin':
          redirectPath = '/admin/dashboard';
          break;
        default:
          redirectPath = '/';
      }

      showToast(`Welcome back, ${userData.name}!`, 'success');
      
      // Clear form data
      setFormData({ email: '', password: '' });
      
      // Navigate to appropriate dashboard
      navigate(redirectPath);
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Failed to login. Please check your credentials.';

      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled. Please contact support.';
      } else if (error.message === 'User profile not found') {
        errorMessage = 'User profile not found. Please contact support.';
      } else if (error.message === 'Unauthorized role access') {
        errorMessage = 'You do not have permission to access this role.';
      }

      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-75"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-150"></div>
      </div>

      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="max-w-md w-full space-y-8 relative z-10"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center">
          <motion.div 
            className="flex justify-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <GlobeAltIcon className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <h2 className="mt-6 text-4xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-lg text-gray-600">Sign in to your account to continue</p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          variants={fadeInUp}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <motion.div variants={fadeInUp}>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <UserCircleIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-500"
                >
                  {errors.email}
                </motion.p>
              )}
            </motion.div>

            {/* Password Field */}
            <motion.div variants={fadeInUp}>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                    errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
                  }`}
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-500"
                >
                  {errors.password}
                </motion.p>
              )}
            </motion.div>

            {/* Admin Options Toggle */}
            <motion.div variants={fadeInUp} className="text-center">
              <button
                type="button"
                onClick={toggleAdminOptions}
                className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center justify-center mx-auto gap-2"
              >
                <ShieldCheckIcon className="w-4 h-4" />
                {showAdminOptions ? "Hide Admin Options" : "Staff/Admin Login"}
              </button>
            </motion.div>

            {/* Admin Role Selection */}
            {showAdminOptions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                variants={fadeInUp}
              >
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Login As
                </label>
                <select
                  id="role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  disabled={loading}
                >
                  <option value="user">User</option>
                  <option value="staff">Staff</option>
                  <option value="officer">Officer/Admin</option>
                </select>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div variants={fadeInUp}>
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Sign In
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </div>
                )}
              </motion.button>
            </motion.div>

            {/* Additional Links */}
            <motion.div variants={fadeInUp} className="text-center space-y-3">
              <div className="text-sm">
                <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                  Forgot your password?
                </a>
              </div>
              <div className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Sign up here
                </button>
              </div>
              <div className="text-sm text-gray-600">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ← Back to Home
                </button>
              </div>
            </motion.div>
          </form>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          variants={fadeInUp}
          className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20"
        >
          <div className="flex items-center justify-center mb-2">
            <ShieldCheckIcon className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Secure Login</span>
          </div>
          <p className="text-xs text-gray-600">
            Your information is protected with bank-level security and encryption.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login; 
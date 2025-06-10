import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { dataService } from '../../services/dataService';
import {
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  ArrowRightIcon,
  HomeIcon,
  PencilSquareIcon,
  EyeIcon,
  ChartBarIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
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

const StaffDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingReview: 0,
    processedToday: 0,
    pendingDocuments: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Fetch real data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch stats and recent applications
        const staffStats = await dataService.getStaffStats();
        setStats(staffStats);
        
        const recentApps = await dataService.getRecentApplications(3);
        
        // Format recent applications
        const formattedApps = recentApps.map(app => ({
          id: app.id,
          applicant: app.applicantName || 'Unknown User',
          service: app.serviceName || app.serviceType || 'Unknown Service',
          submittedAt: app.createdAt ? new Date(app.createdAt.toDate()).toLocaleDateString() : 'Recently',
          status: app.status
        }));
        
        setRecentApplications(formattedApps);
        
      } catch (error) {
        console.error('Error fetching staff data:', error);
        // Fallback to default values if there's an error
        setStats({
          totalApplications: 0,
          pendingReview: 0,
          processedToday: 0,
          pendingDocuments: 0
        });
        setRecentApplications([]);
      }
    };

    fetchData();
  }, []);

  const quickActions = [
    {
      title: "Review Applications",
      description: "Process pending application requests",
      icon: PencilSquareIcon,
      color: "from-blue-500 to-blue-600",
      action: () => navigate('/staff/review-applications'),
      badge: stats.pendingReview,
    },
    {
      title: "View All Applications",
      description: "Browse all submitted applications",
      icon: EyeIcon,
      color: "from-green-500 to-green-600",
      action: () => navigate('/staff/applications'),
    },
  ];

  const statCards = [
    {
      title: "Total Applications",
      value: stats.totalApplications,
      icon: DocumentTextIcon,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Pending Review",
      value: stats.pendingReview,
      icon: ClockIcon,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Processed Today",
      value: stats.processedToday,
      icon: CheckCircleIcon,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Pending Documents",
      value: stats.pendingDocuments,
      icon: ExclamationTriangleIcon,
      color: "bg-red-500",
      textColor: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <GlobeAltIcon className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold">E-Gram Panchayat</span>
              </motion.button>
              <div className="h-6 w-px bg-gray-300"></div>
              <span className="text-sm font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">Staff Portal</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <HomeIcon className="w-5 h-5" />
                <span>Home</span>
              </motion.button>
              
              <motion.button
                className="relative p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BellIcon className="w-6 h-6" />
                {stats.pendingReview > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {stats.pendingReview}
                  </span>
                )}
              </motion.button>
              
              <motion.button
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Cog6ToothIcon className="w-6 h-6" />
              </motion.button>
              
              <motion.button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="space-y-8"
        >
          {/* Welcome Section */}
          <motion.div variants={fadeInUp} className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Staff Dashboard
            </h1>
            <p className="text-xl text-gray-600">
              Welcome, {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Staff Member'}
            </p>
            <p className="text-gray-500">Review and process citizen applications efficiently</p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={fadeInUp}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Application Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`${stat.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                      <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                    </div>
                    <div className={`p-3 ${stat.color} rounded-xl`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={fadeInUp}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickActions.map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  onClick={action.action}
                  className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  {action.badge && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white text-sm font-bold rounded-full flex items-center justify-center">
                      {action.badge}
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className="w-8 h-8 text-white" />
                    </div>
                    <ArrowRightIcon className="w-6 h-6 text-gray-400 group-hover:text-green-600 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                    {action.title}
                  </h3>
                  <p className="text-gray-600">{action.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Applications */}
          <motion.div variants={fadeInUp}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Applications</h2>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Latest Submissions</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {recentApplications.map((application, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                    onClick={() => navigate('/staff/applications')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-lg font-semibold text-gray-900">{application.applicant}</h4>
                          <span className="text-sm text-gray-500">#{application.id}</span>
                        </div>
                        <p className="text-gray-600">{application.service}</p>
                        <p className="text-sm text-gray-500 mt-1">Submitted {application.submittedAt}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        application.status === 'approved' ? 'bg-green-100 text-green-800' :
                        application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {application.status.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="px-6 py-4 bg-gray-50 text-center">
                <motion.button
                  onClick={() => navigate('/staff/applications')}
                  className="text-green-600 hover:text-green-700 font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View All Applications →
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Performance Section */}
          <motion.div variants={fadeInUp}>
            <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold mb-4">Today's Performance</h2>
                <p className="text-green-100 mb-6">
                  You've processed {stats.processedToday} applications today. Great work! 
                  {stats.pendingReview > 0 && ` ${stats.pendingReview} applications are still pending your review.`}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    onClick={() => navigate('/staff/applications')}
                    className="px-6 py-3 bg-white text-green-600 rounded-xl hover:bg-green-50 transition-colors font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Review Pending Applications
                  </motion.button>
                  <motion.button
                    className="px-6 py-3 bg-transparent text-white border-2 border-white rounded-xl hover:bg-white hover:text-green-600 transition-colors font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Reports
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default StaffDashboard; 
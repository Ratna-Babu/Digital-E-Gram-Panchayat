import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { dataService } from '../../services/dataService';
import {
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  UserCircleIcon,
  ArrowRightIcon,
  HomeIcon,
  PlusCircleIcon,
  EyeIcon,
  ChartBarIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

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

const UserDashboard = () => {
  const { currentUser, logout, currentUserRole } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);

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
      console.log('UserDashboard: Starting data fetch...');
      console.log('UserDashboard: currentUser:', currentUser);
      console.log('UserDashboard: currentUser.uid:', currentUser?.uid);
      
      if (!currentUser?.uid) {
        console.error('UserDashboard: No user ID available');
        return;
      }
      
      try {
        console.log('UserDashboard: Fetching data for user:', currentUser.uid);
        
        // Test basic Firebase connection first
        console.log('UserDashboard: Testing Firebase connection...');
        const testRef = collection(db, 'applications');
        const testSnapshot = await getDocs(testRef);
        console.log('UserDashboard: Firebase connection test successful, found', testSnapshot.size, 'total applications');
        
        // Fetch user-specific stats and recent applications
        console.log('UserDashboard: Calling getUserStats...');
        const userStats = await dataService.getUserStats(currentUser.uid);
        console.log('UserDashboard: Received user stats:', userStats);
        setStats(userStats);
        
        console.log('UserDashboard: Calling getUserRecentApplications...');
        const recentApps = await dataService.getUserRecentApplications(currentUser.uid, 3);
        console.log('UserDashboard: Received recent apps:', recentApps);
        
        // Format recent applications for activities display
        const formattedActivities = recentApps.map(app => ({
          title: `Application ${app.status === 'approved' ? 'Approved' : app.status === 'rejected' ? 'Rejected' : 'Submitted'}`,
          description: `${app.serviceName || app.serviceType || 'Service'} application`,
          time: app.createdAt ? new Date(app.createdAt.toDate()).toLocaleDateString() : 'Recently',
          status: app.status
        }));
        
        setRecentActivities(formattedActivities);
        console.log('UserDashboard: Data fetch completed successfully');
        
      } catch (error) {
        console.error('UserDashboard: Error fetching user data:', error);
        console.error('UserDashboard: Error name:', error.name);
        console.error('UserDashboard: Error message:', error.message);
        console.error('UserDashboard: Error code:', error.code);
        console.error('UserDashboard: Error stack:', error.stack);
        // Fallback to default values if there's an error
        setStats({
          totalApplications: 0,
          pendingApplications: 0,
          approvedApplications: 0,
          rejectedApplications: 0
        });
        setRecentActivities([]);
      }
    };

    fetchData();
  }, [currentUser]);

  const quickActions = [
    {
      title: "Apply for Service",
      description: "Submit a new service application",
      icon: PlusCircleIcon,
      color: "from-blue-500 to-blue-600",
      action: () => navigate('/user/apply'),
    },
    {
      title: "View Applications",
      description: "Track your application status",
      icon: EyeIcon,
      color: "from-green-500 to-green-600",
      action: () => navigate('/user/applications'),
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
      value: stats.pendingApplications,
      icon: ClipboardDocumentCheckIcon,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Approved",
      value: stats.approvedApplications,
      icon: CheckCircleIcon,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Rejected",
      value: stats.rejectedApplications,
      icon: XCircleIcon,
      color: "bg-red-500",
      textColor: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
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
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BellIcon className="w-6 h-6" />
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
              Welcome back, {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User'}!
            </h1>
            <p className="text-xl text-gray-600">
              Manage your applications and access government services
            </p>
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
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
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

          {/* Recent Activities */}
          <motion.div variants={fadeInUp}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activities</h2>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      activity.status === 'approved' ? 'bg-green-500' :
                      activity.status === 'pending' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}></div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">{activity.title}</h4>
                      <p className="text-gray-600">{activity.description}</p>
                      <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'approved' ? 'bg-green-100 text-green-800' :
                      activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {activity.status.replace('_', ' ').toUpperCase()}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {recentActivities.length === 0 && (
                <div className="text-center py-8">
                  <ChartBarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No recent activities</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Help Section */}
          <motion.div variants={fadeInUp}>
            <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
                <p className="text-green-100 mb-6">
                  Our support team is here to assist you with any questions about government services and applications.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    className="px-6 py-3 bg-white text-green-600 rounded-xl hover:bg-green-50 transition-colors font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Contact Support
                  </motion.button>
                  <motion.button
                    className="px-6 py-3 bg-transparent text-white border-2 border-white rounded-xl hover:bg-white hover:text-green-600 transition-colors font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View FAQ
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

export default UserDashboard; 
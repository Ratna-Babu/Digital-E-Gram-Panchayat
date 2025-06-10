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
  Cog6ToothIcon,
  EyeIcon,
  ChartBarIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  UsersIcon,
  BuildingOfficeIcon,
  DocumentChartBarIcon,
  ShieldCheckIcon,
  ServerStackIcon,
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

const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    totalUsers: 0,
    totalServices: 0,
    staffMembers: 0
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
      try {
        // First, try to initialize sample data if collections are empty
        await dataService.initializeSampleData();
        
        // Fetch stats and recent applications in parallel
        const [adminStats, recentApps] = await Promise.all([
          dataService.getAdminStats(),
          dataService.getRecentApplications(4)
        ]);
        
        setStats(adminStats);
        
        // Format recent applications for activities display
        const formattedActivities = recentApps.map(app => ({
          title: `${app.status === 'approved' ? 'Application Approved' : 'New Application'}`,
          description: `${app.serviceName || app.serviceType} application by ${app.applicantName}`,
          time: app.createdAt ? new Date(app.createdAt.toDate()).toLocaleDateString() : 'Recently',
          type: 'application',
          icon: DocumentTextIcon,
          status: app.status
        }));
        
        setRecentActivities(formattedActivities);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        // Fallback to default values if there's an error
        setStats({
          totalApplications: 0,
          pendingApplications: 0,
          approvedApplications: 0,
          totalUsers: 0,
          totalServices: 0,
          staffMembers: 0
        });
        setRecentActivities([]);
      }
    };

    fetchData();
  }, []);

  const quickActions = [
    {
      title: "Manage Services",
      description: "Create, update, and configure available services",
      icon: Cog6ToothIcon,
      color: "from-blue-500 to-blue-600",
      action: () => navigate('/admin/services'),
    },
    {
      title: "View Applications",
      description: "Monitor and oversee all application submissions",
      icon: EyeIcon,
      color: "from-green-500 to-green-600",
      action: () => navigate('/admin/applications'),
    },
    {
      title: "User Management",
      description: "Manage user accounts and permissions",
      icon: UsersIcon,
      color: "from-purple-500 to-purple-600",
      action: () => navigate('/admin/users'),
    },
    {
      title: "Database Setup",
      description: "Initialize database collections and security rules",
      icon: ServerStackIcon,
      color: "from-red-500 to-red-600",
      action: () => navigate('/admin/database-setup'),
    },
    {
      title: "Generate Reports",
      description: "View comprehensive system analytics and reports",
      icon: DocumentChartBarIcon,
      color: "from-orange-500 to-orange-600",
      action: () => navigate('/admin/reports'),
    },
  ];

  const statCards = [
    {
      title: "Total Applications",
      value: stats.totalApplications,
      icon: DocumentTextIcon,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12%",
      changeType: "positive"
    },
    {
      title: "Pending Review",
      value: stats.pendingApplications,
      icon: ClockIcon,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
      bgColor: "bg-yellow-50",
      change: "-5%",
      changeType: "positive"
    },
    {
      title: "Approved Today",
      value: stats.approvedApplications,
      icon: CheckCircleIcon,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
      change: "+8%",
      changeType: "positive"
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: UsersIcon,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+15%",
      changeType: "positive"
    },
    {
      title: "Active Services",
      value: stats.totalServices,
      icon: BuildingOfficeIcon,
      color: "bg-indigo-500",
      textColor: "text-indigo-600",
      bgColor: "bg-indigo-50",
      change: "+2",
      changeType: "positive"
    },
    {
      title: "Staff Members",
      value: stats.staffMembers,
      icon: ShieldCheckIcon,
      color: "bg-teal-500",
      textColor: "text-teal-600",
      bgColor: "bg-teal-50",
      change: "+1",
      changeType: "positive"
    }
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
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
              <span className="text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">Admin Portal</span>
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
                {stats.pendingApplications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {stats.pendingApplications}
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
              Admin Dashboard
            </h1>
            <p className="text-xl text-gray-600">
              Welcome, {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Administrator'}
            </p>
            <p className="text-gray-500">Oversee and manage the entire E-Gram Panchayat system</p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={fadeInUp}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">System Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {statCards.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`${stat.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                      <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
                    </div>
                    <div className={`p-3 ${stat.color} rounded-xl`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">from last month</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={fadeInUp}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Management Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  onClick={action.action}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{action.description}</p>
                  <ArrowRightIcon className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors duration-300 mt-3" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activities & Quick Stats */}
          <div className="grid lg:grid-cols-2 gap-8">
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
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'service' ? 'bg-blue-100' :
                        activity.type === 'user' ? 'bg-green-100' :
                        activity.type === 'system' ? 'bg-purple-100' :
                        'bg-orange-100'
                      }`}>
                        <activity.icon className={`w-5 h-5 ${
                          activity.type === 'service' ? 'text-blue-600' :
                          activity.type === 'user' ? 'text-green-600' :
                          activity.type === 'system' ? 'text-purple-600' :
                          'text-orange-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900">{activity.title}</h4>
                        <p className="text-gray-600">{activity.description}</p>
                        <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* System Health */}
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">System Health</h2>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">Server Performance</span>
                      <span className="text-sm font-bold text-green-600">98%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">Database Health</span>
                      <span className="text-sm font-bold text-green-600">95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">User Satisfaction</span>
                      <span className="text-sm font-bold text-blue-600">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <CheckCircleIcon className="w-5 h-5" />
                      <span className="text-sm font-medium">All systems operational</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Administrative Actions */}
          <motion.div variants={fadeInUp}>
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-8 text-white">
              <div className="max-w-4xl">
                <h2 className="text-2xl font-bold mb-4">Administrative Control Center</h2>
                <p className="text-purple-100 mb-6">
                  Manage the entire E-Gram Panchayat ecosystem with powerful administrative tools. 
                  Monitor performance, configure services, and ensure optimal citizen experience.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    onClick={() => navigate('/admin/services')}
                    className="px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-colors font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Configure Services
                  </motion.button>
                  <motion.button
                    onClick={() => navigate('/admin/reports')}
                    className="px-6 py-3 bg-transparent text-white border-2 border-white rounded-xl hover:bg-white hover:text-purple-600 transition-colors font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Generate Reports
                  </motion.button>
                  <motion.button
                    onClick={() => navigate('/admin/users')}
                    className="px-6 py-3 bg-transparent text-white border-2 border-white rounded-xl hover:bg-white hover:text-purple-600 transition-colors font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Manage Users
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

export default AdminDashboard; 
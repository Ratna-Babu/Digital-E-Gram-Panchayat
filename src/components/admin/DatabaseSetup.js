import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { dataService } from '../../services/dataService';
import {
  ServerStackIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  CircleStackIcon,
  DocumentTextIcon,
  UsersIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const DatabaseSetup = () => {
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(false);
  const [initializationResult, setInitializationResult] = useState(null);
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { message, type, timestamp }]);
  };

  const handleInitializeDatabase = async () => {
    setIsInitializing(true);
    setInitializationResult(null);
    setLogs([]);
    
    addLog('Starting database initialization...', 'info');
    
    try {
      // Override console.log to capture logs
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;
      
      console.log = (...args) => {
        addLog(args.join(' '), 'info');
        originalLog(...args);
      };
      
      console.error = (...args) => {
        addLog(args.join(' '), 'error');
        originalError(...args);
      };
      
      console.warn = (...args) => {
        addLog(args.join(' '), 'warning');
        originalWarn(...args);
      };
      
      const result = await dataService.initializeSampleData();
      
      // Restore original console methods
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
      
      if (result) {
        setInitializationResult('success');
        addLog('Database initialization completed successfully!', 'success');
      } else {
        setInitializationResult('error');
        addLog('Database initialization failed. Please check the logs above.', 'error');
      }
    } catch (error) {
      setInitializationResult('error');
      addLog(`Error during initialization: ${error.message}`, 'error');
    } finally {
      setIsInitializing(false);
    }
  };

  const getLogIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />;
      default:
        return <CircleStackIcon className="w-4 h-4 text-blue-500" />;
    }
  };

  const getLogTextColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-gray-700';
    }
  };

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
                onClick={() => navigate('/admin')}
                className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="space-y-8"
        >
          {/* Title */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Database Setup
            </h1>
            <p className="text-xl text-gray-600">
              Initialize your E-Gram Panchayat database with sample data
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Applications</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Sample applications for testing the system with different statuses and services.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Users</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Sample user accounts with different roles (user, staff, admin) for testing.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CogIcon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Services</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Common panchayat services like birth certificates, ration cards, etc.
              </p>
            </div>
          </div>

          {/* Initialize Button */}
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <div className="mb-6">
              <ServerStackIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Initialize Database
              </h2>
              <p className="text-gray-600">
                This will create sample data if your database collections are empty. 
                Existing data will not be affected.
              </p>
            </div>

            <motion.button
              onClick={handleInitializeDatabase}
              disabled={isInitializing}
              className={`px-8 py-3 rounded-lg font-medium text-white transition-all duration-300 ${
                isInitializing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
              }`}
              whileHover={!isInitializing ? { scale: 1.05 } : {}}
              whileTap={!isInitializing ? { scale: 0.95 } : {}}
            >
              {isInitializing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Initializing...</span>
                </div>
              ) : (
                'Initialize Database'
              )}
            </motion.button>

            {initializationResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-4 rounded-lg ${
                  initializationResult === 'success'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {initializationResult === 'success' ? (
                    <CheckCircleIcon className="w-5 h-5" />
                  ) : (
                    <ExclamationTriangleIcon className="w-5 h-5" />
                  )}
                  <span className="font-medium">
                    {initializationResult === 'success'
                      ? 'Database initialized successfully!'
                      : 'Initialization failed. Check the logs below.'}
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Logs */}
          {logs.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Initialization Logs</h3>
              </div>
              <div className="p-6">
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {logs.map((log, index) => (
                    <div key={index} className="flex items-start space-x-3 text-sm">
                      {getLogIcon(log.type)}
                      <span className="text-gray-500 font-mono text-xs w-16 flex-shrink-0">
                        {log.timestamp}
                      </span>
                      <span className={`flex-1 ${getLogTextColor(log.type)}`}>
                        {log.message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DatabaseSetup; 
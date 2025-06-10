import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, doc, getDoc, orderBy } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ArrowLeftIcon,
  HomeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarDaysIcon,
  PaperClipIcon,
  ArrowTopRightOnSquareIcon,
  ChartBarIcon,
  ArrowPathIcon,
  ChatBubbleLeftEllipsisIcon,
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

const UserApplicationManagement = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${
      type === 'success' ? 'bg-green-500' : 
      type === 'error' ? 'bg-red-500' : 
      'bg-blue-500'
    } transform transition-all duration-300 translate-x-full`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.remove('translate-x-full'), 100);
    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  const fetchApplications = useCallback(async () => {
    if (!currentUser || !currentUser.uid) {
      console.log('User not authenticated yet');
      setFetchLoading(false);
      return;
    }

    try {
      setFetchLoading(true);
      console.log('Fetching applications for user:', currentUser.uid);
      
      // Query only current user's applications
      // Note: Removed orderBy to avoid composite index requirement
      // We'll sort client-side instead
      const q = query(
        collection(db, 'applications'), 
        where('userId', '==', currentUser.uid)
      );
      
      const querySnapshot = await getDocs(q);
      console.log('Found user applications:', querySnapshot.size);
      
      const applicationsData = [];
      
      for (const docSnapshot of querySnapshot.docs) {
        const appData = docSnapshot.data();
        console.log('Processing user application:', docSnapshot.id, appData);
        
        // We don't need to fetch user details since it's the current user
        const userData = {
          name: currentUser.displayName || currentUser.email?.split('@')[0] || 'You',
          email: currentUser.email || 'N/A',
          phone: 'N/A' // User phone would come from user profile if available
        };
        
        // Fetch service details
        let serviceData = { title: 'Unknown Service', description: 'N/A' };
        try {
          if (appData.serviceId) {
            const serviceDoc = await getDoc(doc(db, 'services', appData.serviceId));
            if (serviceDoc.exists()) {
              serviceData = serviceDoc.data();
            }
          }
        } catch (error) {
          console.error('Error fetching service:', error);
        }
        
        // Parse notes to get description and documents
        let description = '';
        let documents = [];
        try {
          if (appData.notes) {
            const notesData = JSON.parse(appData.notes);
            description = notesData.description || '';
            documents = notesData.documents || [];
          }
        } catch (error) {
          // If notes is not JSON, treat it as a plain description
          description = appData.notes || '';
          documents = [];
        }
        
        applicationsData.push({
          id: docSnapshot.id,
          ...appData,
          user: userData,
          service: serviceData,
          description: description,
          documents: documents
        });
      }
      
      // Sort client-side by submittedAt (newest first)
      // This avoids the need for a composite Firestore index
      applicationsData.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
      
      console.log('Processed user applications:', applicationsData);
      setApplications(applicationsData);
      setFilteredApplications(applicationsData);
    } catch (error) {
      console.error('Error fetching user applications:', error);
      showToast('Error fetching applications: ' + error.message, 'error');
    } finally {
      setFetchLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  useEffect(() => {
    let filtered = applications;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.service?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.status?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter]);

  const getStatusInfo = (status) => {
    const statusMap = {
      submitted: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: ClockIcon,
        iconColor: 'text-yellow-600',
        label: 'Submitted',
        description: 'Your application has been received and is pending review'
      },
      in_review: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: ExclamationTriangleIcon,
        iconColor: 'text-blue-600',
        label: 'In Review',
        description: 'Your application is currently being reviewed by our staff'
      },
      approved: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircleIcon,
        iconColor: 'text-green-600',
        label: 'Approved',
        description: 'Your application has been approved! Check for next steps'
      },
      rejected: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircleIcon,
        iconColor: 'text-red-600',
        label: 'Rejected',
        description: 'Your application was not approved. Contact support for details'
      }
    };
    return statusMap[status] || statusMap.submitted;
  };

  const getApplicationStats = () => {
    const stats = {
      total: applications.length,
      submitted: applications.filter(app => app.status === 'submitted').length,
      inReview: applications.filter(app => app.status === 'in_review').length,
      approved: applications.filter(app => app.status === 'approved').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
    };
    return stats;
  };

  const handleViewDetails = (application) => {
    setSelectedApp(application);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApp(null);
  };

  const handleRefresh = () => {
    fetchApplications();
    showToast('Applications refreshed', 'success');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  // Show loading state while user authentication is being checked
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  const stats = getApplicationStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
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
                onClick={() => navigate('/user/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Back to Dashboard</span>
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
                onClick={handleRefresh}
                disabled={fetchLoading}
                className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowPathIcon className={`w-5 h-5 ${fetchLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </motion.button>
              
              <motion.button
                onClick={() => navigate('/user/apply')}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlusIcon className="w-5 h-5" />
                <span>New Application</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="space-y-8"
        >
          {/* Title */}
          <motion.div variants={fadeInUp} className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Applications</h1>
            <p className="text-xl text-gray-600">Track and manage your service applications</p>
          </motion.div>

          {/* Statistics */}
          <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <ChartBarIcon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-gray-600">Total</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <ClockIcon className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.submitted}</p>
              <p className="text-gray-600">Submitted</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <ExclamationTriangleIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.inReview}</p>
              <p className="text-gray-600">In Review</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <CheckCircleIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              <p className="text-gray-600">Approved</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <XCircleIcon className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
              <p className="text-gray-600">Rejected</p>
            </div>
          </motion.div>

          {/* Search and Filter */}
          <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div className="relative">
                <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white min-w-[150px]"
                >
                  <option value="all">All Status</option>
                  <option value="submitted">Submitted</option>
                  <option value="in_review">In Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Applications List */}
          <motion.div variants={fadeInUp}>
            {fetchLoading ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading your applications...</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {applications.length === 0 ? 'No Applications Yet' : 'No Matching Applications'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {applications.length === 0 
                    ? "You haven't submitted any applications yet. Start by applying for a service."
                    : 'Try adjusting your search or filter criteria.'
                  }
                </p>
                {applications.length === 0 && (
                  <motion.button
                    onClick={() => navigate('/user/apply')}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Apply for Service
                  </motion.button>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Your Applications ({filteredApplications.length})
                  </h3>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {filteredApplications.map((app, index) => {
                    const statusInfo = getStatusInfo(app.status);
                    return (
                      <motion.div
                        key={app.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleViewDetails(app)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-semibold text-gray-900">
                                {app.service?.title || 'Unknown Service'}
                              </h3>
                              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${statusInfo.color}`}>
                                <statusInfo.icon className={`w-4 h-4 ${statusInfo.iconColor}`} />
                                <span className="text-sm font-medium">{statusInfo.label}</span>
                              </div>
                            </div>
                            
                            <p className="text-gray-600 mb-3 line-clamp-2">{app.description}</p>
                            
                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <DocumentTextIcon className="w-4 h-4" />
                                <span>ID: {app.id.slice(0, 8)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <CalendarDaysIcon className="w-4 h-4" />
                                <span>Submitted: {formatDate(app.submittedAt)}</span>
                              </div>
                              {app.documents && app.documents.length > 0 && (
                                <div className="flex items-center space-x-1">
                                  <PaperClipIcon className="w-4 h-4" />
                                  <span>{app.documents.length} document{app.documents.length > 1 ? 's' : ''}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="ml-6">
                            <EyeIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                    {(() => {
                      const statusInfo = getStatusInfo(selectedApp.status);
                      return (
                        <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border ${statusInfo.color}`}>
                          <statusInfo.icon className={`w-5 h-5 ${statusInfo.iconColor}`} />
                          <span className="font-medium">{statusInfo.label}</span>
                        </div>
                      );
                    })()}
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <XCircleIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Application Overview */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Information</h3>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-xl font-medium text-green-600 mb-2">{selectedApp.service?.title || 'Unknown Service'}</p>
                      <p className="text-gray-600 text-sm">{selectedApp.service?.description || 'No description available'}</p>
                      {selectedApp.service?.fee && (
                        <p className="text-sm text-gray-500 mt-2">Fee: ₹{selectedApp.service.fee}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Status</h3>
                    {(() => {
                      const statusInfo = getStatusInfo(selectedApp.status);
                      return (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl border ${statusInfo.color} mb-3`}>
                            <statusInfo.icon className={`w-6 h-6 ${statusInfo.iconColor}`} />
                            <div>
                              <p className="font-medium">{statusInfo.label}</p>
                              <p className="text-sm opacity-75">{statusInfo.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Application Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Application Description</h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-700">{selectedApp.description || 'No description provided'}</p>
                  </div>
                </div>

                {/* Application Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Application Details</h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium text-gray-700">Application ID:</span>
                        <span className="ml-2 font-mono text-gray-900 text-sm">{selectedApp.id}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Status:</span>
                        <span className="ml-2 text-gray-900">{selectedApp.status}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Submitted:</span>
                        <span className="ml-2 text-gray-900 text-sm">{formatDate(selectedApp.submittedAt)}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Last Updated:</span>
                        <span className="ml-2 text-gray-900 text-sm">{formatDate(selectedApp.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Documents ({selectedApp.documents?.length || 0})
                  </h3>
                  {selectedApp.documents && selectedApp.documents.length > 0 ? (
                    <div className="space-y-3">
                      {selectedApp.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <PaperClipIcon className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                              {doc.size && (
                                <p className="text-xs text-gray-500">{(doc.size / 1024).toFixed(1)} KB</p>
                              )}
                            </div>
                          </div>
                          {doc.url && doc.url !== '#' && (
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-700 text-sm"
                            >
                              View
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 bg-gray-50 rounded-xl p-4">No documents uploaded</p>
                  )}
                </div>

                {/* Staff Remarks (if any) */}
                {selectedApp.staffRemarks && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Staff Remarks</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start space-x-2">
                        <ChatBubbleLeftEllipsisIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                        <p className="text-blue-800">{selectedApp.staffRemarks}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">Application Submitted</p>
                        <p className="text-sm text-gray-500">{formatDate(selectedApp.submittedAt)}</p>
                      </div>
                    </div>
                    
                    {selectedApp.updatedAt && selectedApp.updatedAt !== selectedApp.submittedAt && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900">Status Updated</p>
                          <p className="text-sm text-gray-500">{formatDate(selectedApp.updatedAt)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserApplicationManagement; 
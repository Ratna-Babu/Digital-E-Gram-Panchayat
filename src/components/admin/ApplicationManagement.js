import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { db } from '../../config/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  updateDoc,
  addDoc,
  query,
  orderBy
} from 'firebase/firestore';
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
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarDaysIcon,
  PaperClipIcon,
  UserIcon,
  ArrowPathIcon,
  ChartBarIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ChatBubbleLeftEllipsisIcon,
} from '@heroicons/react/24/outline';
import { auth } from '../../config/firebase';

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

const AdminApplicationManagement = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [remarks, setRemarks] = useState('');

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
    try {
      setFetchLoading(true);
      console.log('Fetching applications...');
      
      const q = query(collection(db, 'applications'), orderBy('submittedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      console.log('Found applications:', querySnapshot.size);
      
      const applicationsData = [];
      
      for (const docSnapshot of querySnapshot.docs) {
        const appData = docSnapshot.data();
        console.log('Processing application:', docSnapshot.id, appData);
        
        // Fetch user details
        let userData = { name: 'Unknown User', email: 'N/A' };
        try {
          if (appData.userId) {
            const userDoc = await getDoc(doc(db, 'users', appData.userId));
            if (userDoc.exists()) {
              userData = userDoc.data();
            }
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
        
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
      
      console.log('Processed applications:', applicationsData);
      setApplications(applicationsData);
      setFilteredApplications(applicationsData);
    } catch (error) {
      console.error('Error fetching applications:', error);
      showToast('Error fetching applications: ' + error.message, 'error');
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  useEffect(() => {
    let filtered = applications;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        label: 'Submitted'
      },
      in_review: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: ExclamationTriangleIcon,
        iconColor: 'text-blue-600',
        label: 'In Review'
      },
      approved: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircleIcon,
        iconColor: 'text-green-600',
        label: 'Approved'
      },
      rejected: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircleIcon,
        iconColor: 'text-red-600',
        label: 'Rejected'
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
    setRemarks('');
  };

  const handleStatusUpdate = async (applicationId, newStatus, remarks = '') => {
    console.log('=== STATUS UPDATE DEBUG ===');
    console.log('applicationId:', applicationId);
    console.log('newStatus:', newStatus);
    console.log('remarks:', remarks);
    console.log('user from useAuth:', currentUser);
    console.log('auth.currentUser:', auth?.currentUser);
    console.log('========================');
    
    if (!applicationId) {
      console.error('Missing applicationId');
      showToast('Missing application ID', 'error');
      return;
    }

    if (!newStatus) {
      console.error('Missing newStatus');
      showToast('Missing status information', 'error');
      return;
    }

    // Use fallback for user - either from useAuth or Firebase auth
    const authUser = currentUser || auth?.currentUser;
    if (!authUser) {
      console.error('No authenticated user found');
      showToast('Authentication required. Please log in again.', 'error');
      return;
    }

    console.log('Using user:', authUser);

    setActionLoading(true);
    try {
      const application = applications.find(app => app.id === applicationId);
      if (!application) {
        console.error('Application not found in local state');
        throw new Error('Application not found');
      }

      console.log('Current application:', application);
      const oldStatus = application.status;
      
      // Update application status
      const updateData = {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };
      
      if (remarks) {
        updateData.staffRemarks = remarks;
      }
      
      console.log('Updating application with data:', updateData);
      await updateDoc(doc(db, 'applications', applicationId), updateData);
      console.log('Application updated successfully');

      // Create status log for audit trail
      const statusLogData = {
        applicationId: applicationId,
        changedBy: authUser.uid,
        changedByName: authUser.displayName || authUser.email || 'Unknown User',
        oldStatus: oldStatus,
        newStatus: newStatus,
        timestamp: new Date().toISOString(),
        remarks: remarks || ''
      };
      
      console.log('Creating status log with data:', statusLogData);
      await addDoc(collection(db, 'status_logs'), statusLogData);
      console.log('Status log created successfully');

      // Update local state
      setApplications(prevApps => 
        prevApps.map(app => 
          app.id === applicationId 
            ? { 
                ...app, 
                status: newStatus, 
                updatedAt: new Date().toISOString(),
                staffRemarks: remarks || app.staffRemarks
              }
            : app
        )
      );

      // Update filtered applications as well
      setFilteredApplications(prevApps => 
        prevApps.map(app => 
          app.id === applicationId 
            ? { 
                ...app, 
                status: newStatus, 
                updatedAt: new Date().toISOString(),
                staffRemarks: remarks || app.staffRemarks
              }
            : app
        )
      );

      const statusLabels = {
        'in_review': 'moved to review',
        'approved': 'approved',
        'rejected': 'rejected'
      };

      showToast(`Application ${statusLabels[newStatus] || 'updated'} successfully!`, 'success');
      
      // Update selected app for modal
      if (selectedApp && selectedApp.id === applicationId) {
        setSelectedApp({
          ...selectedApp,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          staffRemarks: remarks || selectedApp.staffRemarks
        });
      }
      
      setRemarks('');
    } catch (error) {
      console.error('Error updating application status:', error);
      console.error('Error details:', error.message, error.code);
      showToast(`Error updating application status: ${error.message}`, 'error');
    } finally {
      setActionLoading(false);
    }
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

  const stats = getApplicationStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
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
                onClick={() => navigate('/admin/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
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
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Application Management</h1>
            <p className="text-xl text-gray-600">Review and manage citizen applications</p>
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
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div className="relative">
                <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white min-w-[150px]"
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading applications...</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {applications.length === 0 ? 'No Applications Yet' : 'No Matching Applications'}
                </h3>
                <p className="text-gray-600">
                  {applications.length === 0 
                    ? "No applications have been submitted yet."
                    : 'Try adjusting your search or filter criteria.'
                  }
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Applications ({filteredApplications.length})
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
                              <h4 className="text-lg font-semibold text-gray-900">
                                {app.service?.title || 'Unknown Service'}
                              </h4>
                              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${statusInfo.color}`}>
                                <statusInfo.icon className={`w-4 h-4 ${statusInfo.iconColor}`} />
                                <span className="text-sm font-medium">{statusInfo.label}</span>
                              </div>
                            </div>
                            
                            <p className="text-gray-600 mb-3 line-clamp-2">{app.description}</p>
                            
                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <UserIcon className="w-4 h-4" />
                                <span>{app.user?.name || 'Unknown User'}</span>
                              </div>
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

      {/* Simple Modal */}
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
                  <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
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
                      <p className="text-xl font-medium text-purple-600 mb-2">{selectedApp.service?.title || 'Unknown Service'}</p>
                      <p className="text-gray-600 text-sm">{selectedApp.service?.description || 'No description available'}</p>
                      {selectedApp.service?.fee && (
                        <p className="text-sm text-gray-500 mt-2">Fee: ₹{selectedApp.service.fee}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Applicant Information</h3>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-lg font-medium text-gray-900 mb-1">{selectedApp.user?.name || 'Unknown User'}</p>
                      <p className="text-gray-600 mb-2">{selectedApp.user?.email || 'No email available'}</p>
                      {selectedApp.user?.phone && (
                        <p className="text-gray-600">{selectedApp.user.phone}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-2">Role: {selectedApp.user?.role || 'user'}</p>
                    </div>
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
                              className="text-purple-600 hover:text-purple-700 text-sm"
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

                {/* Action Section - Only show if status can be changed */}
                {(selectedApp.status === 'submitted' || selectedApp.status === 'in_review') && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Take Action</h3>
                    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                      {/* Remarks Input */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Remarks (Optional)
                        </label>
                        <textarea
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                          placeholder="Add remarks for this decision..."
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        {selectedApp.status === 'submitted' && (
                          <motion.button
                            onClick={() => handleStatusUpdate(selectedApp.id, 'in_review', remarks)}
                            disabled={actionLoading}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                            whileHover={!actionLoading ? { scale: 1.02 } : {}}
                            whileTap={!actionLoading ? { scale: 0.98 } : {}}
                          >
                            {actionLoading ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                              <>
                                <ExclamationTriangleIcon className="w-4 h-4" />
                                <span>Move to Review</span>
                              </>
                            )}
                          </motion.button>
                        )}

                        <motion.button
                          onClick={() => handleStatusUpdate(selectedApp.id, 'approved', remarks)}
                          disabled={actionLoading}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                          whileHover={!actionLoading ? { scale: 1.02 } : {}}
                          whileTap={!actionLoading ? { scale: 0.98 } : {}}
                        >
                          {actionLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <HandThumbUpIcon className="w-4 h-4" />
                              <span>Approve</span>
                            </>
                          )}
                        </motion.button>

                        <motion.button
                          onClick={() => handleStatusUpdate(selectedApp.id, 'rejected', remarks)}
                          disabled={actionLoading}
                          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                          whileHover={!actionLoading ? { scale: 1.02 } : {}}
                          whileTap={!actionLoading ? { scale: 0.98 } : {}}
                        >
                          {actionLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <HandThumbDownIcon className="w-4 h-4" />
                              <span>Reject</span>
                            </>
                          )}
                        </motion.button>
                      </div>

                      <div className="text-xs text-gray-500 mt-2">
                        <strong>Note:</strong> Your action will be logged for audit purposes.
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Information for completed applications */}
                {(selectedApp.status === 'approved' || selectedApp.status === 'rejected') && (
                  <div className={`rounded-xl p-4 ${
                    selectedApp.status === 'approved' 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center space-x-2">
                      {selectedApp.status === 'approved' ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircleIcon className="w-5 h-5 text-red-600" />
                      )}
                      <span className={`font-medium ${
                        selectedApp.status === 'approved' ? 'text-green-900' : 'text-red-900'
                      }`}>
                        This application has been {selectedApp.status}.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminApplicationManagement; 
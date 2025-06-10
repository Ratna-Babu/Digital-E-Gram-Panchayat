import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { db } from '../../config/firebase';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import {
  UsersIcon,
  UserIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowLeftIcon,
  HomeIcon,
  EyeIcon,
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserCircleIcon,
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

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [updateData, setUpdateData] = useState({
    role: '',
    name: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});

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

  const fetchUsers = useCallback(async () => {
    try {
      setFetchLoading(true);
      const q = query(collection(db, 'users'), orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      showToast('Error fetching users: ' + error.message, 'error');
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  const getRoleInfo = (role) => {
    const roleMap = {
      user: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: UserIcon,
        iconColor: 'text-green-600',
        label: 'User'
      },
      staff: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: ShieldCheckIcon,
        iconColor: 'text-blue-600',
        label: 'Staff'
      },
      officer: {
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: ShieldCheckIcon,
        iconColor: 'text-purple-600',
        label: 'Officer'
      }
    };
    return roleMap[role] || roleMap.user;
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setUpdateData({
      role: user.role || '',
      name: user.name || '',
      phone: user.phone || '',
    });
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!updateData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!updateData.role) {
      newErrors.role = 'Role is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateData(prev => ({
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

  const handleUpdateUser = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const userData = {
        name: updateData.name.trim(),
        role: updateData.role,
        phone: updateData.phone.trim(),
      };

      await updateDoc(doc(db, 'users', selectedUser.id), userData);
      showToast('User updated successfully!', 'success');
      closeModal();
      fetchUsers();
    } catch (error) {
      showToast('Error updating user: ' + error.message, 'error');
    }
    setLoading(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setUpdateData({
      role: '',
      name: '',
      phone: '',
    });
    setErrors({});
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getUserStats = () => {
    const stats = {
      total: users.length,
      users: users.filter(u => u.role === 'user').length,
      staff: users.filter(u => u.role === 'staff').length,
      officers: users.filter(u => u.role === 'officer').length,
    };
    return stats;
  };

  const stats = getUserStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
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
                className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors"
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
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <HomeIcon className="w-5 h-5" />
                <span>Home</span>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-xl text-gray-600">Manage system users and their roles</p>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <UsersIcon className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-gray-600">Total Users</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <UserIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.users}</p>
              <p className="text-gray-600">Citizens</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <ShieldCheckIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.staff}</p>
              <p className="text-gray-600">Staff</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <ShieldCheckIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.officers}</p>
              <p className="text-gray-600">Officers</p>
            </div>
          </motion.div>

          {/* Search and Filter */}
          <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div className="relative">
                <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white min-w-[150px]"
                >
                  <option value="all">All Roles</option>
                  <option value="user">Citizens</option>
                  <option value="staff">Staff</option>
                  <option value="officer">Officers</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Users List */}
          <motion.div variants={fadeInUp}>
            {fetchLoading ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading users...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {users.length === 0 ? 'No Users Yet' : 'No Matching Users'}
                </h3>
                <p className="text-gray-600">
                  {users.length === 0 
                    ? "No users have registered yet."
                    : 'Try adjusting your search or filter criteria.'
                  }
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredUsers.map((user, index) => {
                  const roleInfo = getRoleInfo(user.role);
                  return (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01, y: -2 }}
                      className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300"
                      onClick={() => handleViewDetails(user)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <UserCircleIcon className="w-6 h-6 text-indigo-600" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-semibold text-gray-900">
                                {user.name || 'No Name'}
                              </h3>
                              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${roleInfo.color}`}>
                                <roleInfo.icon className={`w-4 h-4 ${roleInfo.iconColor}`} />
                                <span className="text-sm font-medium">{roleInfo.label}</span>
                              </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                                <span>{user.email || 'No email'}</span>
                              </div>
                              {user.phone && (
                                <div className="flex items-center space-x-2">
                                  <PhoneIcon className="w-4 h-4 text-gray-400" />
                                  <span>{user.phone}</span>
                                </div>
                              )}
                            </div>
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
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedUser && (
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
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                  <button
                    onClick={closeModal}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <XCircleIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* User Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">User Information</h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">User ID:</span>
                      <span className="ml-2 font-mono text-gray-900">{selectedUser.id}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <span className="ml-2 text-gray-900">{selectedUser.email}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Current Role:</span>
                      <span className="ml-2">
                        {(() => {
                          const roleInfo = getRoleInfo(selectedUser.role);
                          return (
                            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full border text-sm ${roleInfo.color}`}>
                              <roleInfo.icon className={`w-4 h-4 ${roleInfo.iconColor}`} />
                              <span>{roleInfo.label}</span>
                            </span>
                          );
                        })()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Edit Form */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Edit User</h3>
                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={updateData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter full name"
                      />
                      {errors.name && (
                        <div className="flex items-center space-x-2 text-red-600 mt-2">
                          <ExclamationTriangleIcon className="w-4 h-4" />
                          <span className="text-sm">{errors.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={updateData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter phone number"
                      />
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role *
                      </label>
                      <select
                        name="role"
                        value={updateData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                      >
                        <option value="">Select role</option>
                        <option value="user">Citizen</option>
                        <option value="staff">Staff</option>
                        <option value="officer">Officer</option>
                      </select>
                      {errors.role && (
                        <div className="flex items-center space-x-2 text-red-600 mt-2">
                          <ExclamationTriangleIcon className="w-4 h-4" />
                          <span className="text-sm">{errors.role}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-4 pt-4">
                  <motion.button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleUpdateUser}
                    disabled={loading}
                    className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    whileHover={!loading ? { scale: 1.05 } : {}}
                    whileTap={!loading ? { scale: 0.95 } : {}}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-5 h-5" />
                        <span>Update User</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserManagement; 
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { db, auth, storage } from '../../config/firebase';
import {
  collection,
  addDoc,
  getDocs,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  DocumentTextIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  PaperClipIcon,
  TrashIcon,
  InformationCircleIcon,
  HomeIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { checkUserPermissions } from '../../utils/setupFirestore';

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

const ServiceApplication = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [formData, setFormData] = useState({
    description: '',
    documents: [],
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [serviceDetails, setServiceDetails] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
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

  const fetchServices = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'services'));
      const servicesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setServices(servicesData);
    } catch (error) {
      showToast('Error fetching services: ' + error.message, 'error');
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Debug user permissions
  useEffect(() => {
    if (auth.currentUser) {
      checkUserPermissions(auth.currentUser.uid).then(result => {
        console.log('Permission check result:', result);
        if (!result.success) {
          showToast(result.message, 'error');
        }
      });
    }
  }, [auth.currentUser]);

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1 && !selectedService) {
      newErrors.service = 'Please select a service';
    }
    
    if (step === 2 && !formData.description.trim()) {
      newErrors.description = 'Please provide a description for your application';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleServiceChange = (serviceId) => {
    setSelectedService(serviceId);
    const service = services.find(s => s.id === serviceId);
    setServiceDetails(service);
    setErrors({ ...errors, service: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors({ ...errors, [name]: '' });
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        // Check file size (limit to 10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`File ${file.name} is too large. Maximum size is 10MB.`);
        }

        const storageRef = ref(storage, `applications/${auth.currentUser.uid}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return {
          name: file.name,
          url: downloadURL,
          size: file.size,
          type: file.type
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...uploadedFiles]
      }));

      showToast(`${uploadedFiles.length} file(s) uploaded successfully!`, 'success');
    } catch (error) {
      showToast('Error uploading files: ' + error.message, 'error');
    }
    setUploading(false);
    
    // Reset file input
    e.target.value = '';
  };

  const removeDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
    showToast('Document removed', 'info');
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;

    setLoading(true);
    try {
      console.log('Submitting application...');
      console.log('Current user:', auth.currentUser);
      console.log('Selected service:', selectedService);
      
      // Prepare notes with description and documents info
      const notesData = {
        description: formData.description,
        documentsCount: formData.documents.length,
        documents: formData.documents
      };

      const applicationData = {
        userId: auth.currentUser.uid,
        serviceId: selectedService,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: JSON.stringify(notesData)
      };

      console.log('Application data to submit:', applicationData);

      await addDoc(collection(db, 'applications'), applicationData);

      console.log('Application submitted successfully');
      showToast('Application submitted successfully!', 'success');
      
      // Reset form
      setFormData({
        description: '',
        documents: [],
      });
      setSelectedService('');
      setServiceDetails(null);
      setCurrentStep(1);
      
      // Navigate to applications page after delay
      setTimeout(() => {
        navigate('/user/applications');
      }, 2000);
    } catch (error) {
      console.error('Error submitting application:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      
      let errorMessage = 'Error submitting application: ' + error.message;
      
      if (error.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please make sure you are logged in and have the correct permissions. Try refreshing the page and logging in again.';
      } else if (error.code === 'unauthenticated') {
        errorMessage = 'Authentication required. Please log in again.';
      }
      
      showToast(errorMessage, 'error');
    }
    setLoading(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const steps = [
    { number: 1, title: 'Select Service', description: 'Choose the service you want to apply for' },
    { number: 2, title: 'Application Details', description: 'Provide application information and documents' },
    { number: 3, title: 'Review & Submit', description: 'Review your application before submission' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b border-gray-200"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => navigate('/user/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
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
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <HomeIcon className="w-5 h-5" />
                <span>Home</span>
              </motion.button>
              
              <motion.button
                onClick={() => navigate('/user/applications')}
                className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <EyeIcon className="w-5 h-5" />
                <span>My Applications</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="space-y-8"
        >
          {/* Title */}
          <motion.div variants={fadeInUp} className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Apply for Service</h1>
            <p className="text-xl text-gray-600">Submit your application in just a few steps</p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-8">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    currentStep >= step.number
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {currentStep > step.number ? (
                      <CheckCircleIcon className="w-6 h-6" />
                    ) : (
                      <span className="font-semibold">{step.number}</span>
                    )}
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-4 transition-all duration-300 ${
                      currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {steps[currentStep - 1]?.title}
              </h3>
              <p className="text-gray-600">
                {steps[currentStep - 1]?.description}
              </p>
            </div>
          </motion.div>

          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              {/* Step 1: Select Service */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose a Service</h2>
                  
                  {services.length === 0 ? (
                    <div className="text-center py-8">
                      <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Loading services...</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {services.map((service) => (
                        <motion.div
                          key={service.id}
                          onClick={() => handleServiceChange(service.id)}
                          className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            selectedService === service.id
                              ? 'border-blue-500 bg-blue-50 shadow-lg'
                              : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                            {selectedService === service.id && (
                              <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                          <div className="text-xs text-gray-500">
                            Processing Time: {service.processingTime || 'N/A'}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  
                  {errors.service && (
                    <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                      <ExclamationTriangleIcon className="w-5 h-5" />
                      <span className="text-sm">{errors.service}</span>
                    </div>
                  )}

                  {selectedService && serviceDetails && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-blue-50 border border-blue-200 rounded-xl p-6"
                    >
                      <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                        <InformationCircleIcon className="w-5 h-5 mr-2" />
                        Service Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="font-medium">Requirements:</span> {serviceDetails.requirements || 'Standard documents required'}</div>
                        <div><span className="font-medium">Processing Time:</span> {serviceDetails.processingTime || '7-10 business days'}</div>
                        {serviceDetails.fee && (
                          <div><span className="font-medium">Fee:</span> ₹{serviceDetails.fee}</div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Step 2: Application Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Application Details</h2>
                  
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Application Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Please describe your application request in detail..."
                    />
                    {errors.description && (
                      <div className="flex items-center space-x-2 text-red-600 mt-2">
                        <ExclamationTriangleIcon className="w-4 h-4" />
                        <span className="text-sm">{errors.description}</span>
                      </div>
                    )}
                  </div>

                  {/* Document Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supporting Documents
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        id="fileUpload"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                      <label htmlFor="fileUpload" className="cursor-pointer">
                        <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-700">Click to upload files</p>
                        <p className="text-sm text-gray-500 mt-2">PDF, DOC, DOCX, JPG, PNG (Max 10MB each)</p>
                      </label>
                      
                      {uploading && (
                        <div className="mt-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                          <p className="text-sm text-blue-600 mt-2">Uploading...</p>
                        </div>
                      )}
                    </div>

                    {/* Uploaded Documents */}
                    {formData.documents.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-medium text-gray-700 mb-3">Uploaded Documents</h4>
                        <div className="space-y-3">
                          {formData.documents.map((doc, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <PaperClipIcon className="w-5 h-5 text-gray-400" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                                  <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                                </div>
                              </div>
                              <motion.button
                                onClick={() => removeDocument(index)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <TrashIcon className="w-4 h-4" />
                              </motion.button>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Review & Submit */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Application</h2>
                  
                  <div className="space-y-6">
                    {/* Service Details */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Selected Service</h3>
                      <p className="text-lg text-blue-600 font-medium">{serviceDetails?.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{serviceDetails?.description}</p>
                    </div>

                    {/* Application Description */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-900 mb-3">Application Description</h3>
                      <p className="text-gray-700">{formData.description}</p>
                    </div>

                    {/* Documents */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Documents ({formData.documents.length})
                      </h3>
                      {formData.documents.length > 0 ? (
                        <div className="space-y-2">
                          {formData.documents.map((doc, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                              <PaperClipIcon className="w-4 h-4" />
                              <span>{doc.name}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">No documents uploaded</p>
                      )}
                    </div>

                    {/* Confirmation */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-start space-x-3">
                        <InformationCircleIcon className="w-6 h-6 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-2">Before you submit</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Ensure all information is accurate and complete</li>
                            <li>• Required documents are uploaded and clear</li>
                            <li>• You will receive email updates on your application status</li>
                            <li>• Processing time may vary based on service type</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <motion.div 
            variants={fadeInUp}
            className="flex justify-between items-center"
          >
            <motion.button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-200 ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              whileHover={currentStep > 1 ? { scale: 1.05 } : {}}
              whileTap={currentStep > 1 ? { scale: 0.95 } : {}}
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Previous</span>
            </motion.button>

            {currentStep < 3 ? (
              <motion.button
                onClick={handleNext}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Next</span>
                <ArrowRightIcon className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center space-x-2 px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
                whileHover={!loading ? { scale: 1.05 } : {}}
                whileTap={!loading ? { scale: 0.95 } : {}}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Application</span>
                    <CheckCircleIcon className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ServiceApplication; 
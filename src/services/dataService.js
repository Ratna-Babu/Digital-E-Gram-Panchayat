import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc,
  orderBy,
  limit,
  Timestamp,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const dataService = {
  // Initialize database with sample data if collections are empty
  async initializeSampleData() {
    try {
      console.log('Checking if sample data initialization is needed...');
      
      // Check if we have any applications
      const applicationsRef = collection(db, 'applications');
      const applicationsSnapshot = await getDocs(applicationsRef);
      
      if (applicationsSnapshot.empty) {
        console.log('No applications found, creating sample data...');
        
        // Create sample applications with more variety
        const sampleApplications = [
          {
            userId: 'sample-user-1',
            serviceName: 'Birth Certificate',
            serviceType: 'certificate',
            status: 'pending',
            createdAt: serverTimestamp(),
            lastUpdated: serverTimestamp(),
            applicantDetails: {
              name: 'Rajesh Kumar',
              phone: '9876543210',
              email: 'rajesh@example.com'
            }
          },
          {
            userId: 'sample-user-2', 
            serviceName: 'Ration Card',
            serviceType: 'card',
            status: 'approved',
            createdAt: serverTimestamp(),
            lastUpdated: serverTimestamp(),
            applicantDetails: {
              name: 'Priya Sharma',
              phone: '9876543211',
              email: 'priya@example.com'
            }
          },
          {
            userId: 'sample-user-3',
            serviceName: 'Property Tax Assessment',
            serviceType: 'tax',
            status: 'rejected',
            createdAt: serverTimestamp(),
            lastUpdated: serverTimestamp(),
            applicantDetails: {
              name: 'Amit Patel',
              phone: '9876543212',
              email: 'amit@example.com'
            }
          },
          {
            userId: 'sample-user-1',
            serviceName: 'Death Certificate',
            serviceType: 'certificate',
            status: 'pending_documents',
            createdAt: serverTimestamp(),
            lastUpdated: serverTimestamp(),
            applicantDetails: {
              name: 'Rajesh Kumar',
              phone: '9876543210',
              email: 'rajesh@example.com'
            }
          },
          {
            userId: 'sample-user-4',
            serviceName: 'Marriage Certificate',
            serviceType: 'certificate',
            status: 'under_review',
            createdAt: serverTimestamp(),
            lastUpdated: serverTimestamp(),
            applicantDetails: {
              name: 'Sunita Devi',
              phone: '9876543213',
              email: 'sunita@example.com'
            }
          },
          {
            userId: 'sample-user-2',
            serviceName: 'Building Permit',
            serviceType: 'permit',
            status: 'approved',
            createdAt: serverTimestamp(),
            lastUpdated: serverTimestamp(),
            applicantDetails: {
              name: 'Priya Sharma',
              phone: '9876543211',
              email: 'priya@example.com'
            }
          }
        ];

        for (const app of sampleApplications) {
          await addDoc(applicationsRef, app);
        }
        console.log('Sample applications created');
      }

      // Check if we have any users
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      if (usersSnapshot.empty) {
        console.log('No users found, creating sample users...');
        
        // Create sample users
        const sampleUsers = [
          {
            uid: 'sample-user-1',
            fullName: 'Rajesh Kumar',
            email: 'rajesh@example.com',
            role: 'user',
            createdAt: serverTimestamp()
          },
          {
            uid: 'sample-user-2',
            fullName: 'Priya Sharma', 
            email: 'priya@example.com',
            role: 'user',
            createdAt: serverTimestamp()
          },
          {
            uid: 'sample-user-3',
            fullName: 'Amit Patel',
            email: 'amit@example.com',
            role: 'user',
            createdAt: serverTimestamp()
          },
          {
            uid: 'sample-user-4',
            fullName: 'Sunita Devi',
            email: 'sunita@example.com',
            role: 'user',
            createdAt: serverTimestamp()
          },
          {
            uid: 'sample-staff-1',
            fullName: 'Staff Member',
            email: 'staff@example.com',
            role: 'staff',
            createdAt: serverTimestamp()
          }
        ];

        for (const user of sampleUsers) {
          await addDoc(usersRef, user);
        }
        console.log('Sample users created');
      }

      // Check if we have any services
      const servicesRef = collection(db, 'services');
      const servicesSnapshot = await getDocs(servicesRef);
      
      if (servicesSnapshot.empty) {
        console.log('No services found, creating sample services...');
        
        // Create sample services
        const sampleServices = [
          {
            name: 'Birth Certificate',
            description: 'Apply for birth certificate',
            category: 'certificates',
            isActive: true,
            requiredDocuments: ['Identity Proof', 'Address Proof'],
            createdAt: serverTimestamp()
          },
          {
            name: 'Ration Card',
            description: 'Apply for ration card',
            category: 'cards',
            isActive: true,
            requiredDocuments: ['Income Certificate', 'Address Proof'],
            createdAt: serverTimestamp()
          },
          {
            name: 'Property Tax Assessment',
            description: 'Property tax assessment service',
            category: 'tax',
            isActive: true,
            requiredDocuments: ['Property Documents', 'Identity Proof'],
            createdAt: serverTimestamp()
          },
          {
            name: 'Death Certificate',
            description: 'Apply for death certificate',
            category: 'certificates',
            isActive: true,
            requiredDocuments: ['Medical Certificate', 'Identity Proof'],
            createdAt: serverTimestamp()
          },
          {
            name: 'Marriage Certificate',
            description: 'Apply for marriage certificate',
            category: 'certificates',
            isActive: true,
            requiredDocuments: ['Marriage Proof', 'Identity Proof'],
            createdAt: serverTimestamp()
          }
        ];

        for (const service of sampleServices) {
          await addDoc(servicesRef, service);
        }
        console.log('Sample services created');
      }

      console.log('Sample data initialization completed');
      return true;
    } catch (error) {
      console.error('Error initializing sample data:', error);
      return false;
    }
  },

  // Create sample applications for current user
  async createUserSampleApplications(userId, userName = 'Current User', userEmail = '') {
    try {
      console.log('Creating sample applications for current user:', userId);
      
      const applicationsRef = collection(db, 'applications');
      
      // Check if user already has applications
      console.log('Checking if user already has applications...');
      const userAppsQuery = query(applicationsRef, where('userId', '==', userId));
      const userAppsSnapshot = await getDocs(userAppsQuery);
      
      if (userAppsSnapshot.empty) {
        console.log('No applications found for current user, creating sample applications...');
        
        const userSampleApplications = [
          {
            userId: userId,
            serviceName: 'Birth Certificate',
            serviceType: 'certificate',
            status: 'approved',
            createdAt: serverTimestamp(),
            lastUpdated: serverTimestamp(),
            applicantDetails: {
              name: userName,
              phone: '9876543999',
              email: userEmail
            }
          },
          {
            userId: userId,
            serviceName: 'Ration Card',
            serviceType: 'card',
            status: 'pending',
            createdAt: serverTimestamp(),
            lastUpdated: serverTimestamp(),
            applicantDetails: {
              name: userName,
              phone: '9876543999',
              email: userEmail
            }
          },
          {
            userId: userId,
            serviceName: 'Property Tax Assessment',
            serviceType: 'tax',
            status: 'rejected',
            createdAt: serverTimestamp(),
            lastUpdated: serverTimestamp(),
            applicantDetails: {
              name: userName,
              phone: '9876543999',
              email: userEmail
            }
          }
        ];

        console.log('Adding', userSampleApplications.length, 'sample applications...');
        for (let i = 0; i < userSampleApplications.length; i++) {
          const app = userSampleApplications[i];
          console.log(`Adding application ${i + 1}:`, app.serviceName, 'with status:', app.status);
          await addDoc(applicationsRef, app);
        }
        console.log('All sample applications created successfully for current user');
        return true;
      } else {
        console.log('User already has', userAppsSnapshot.size, 'applications, not creating samples');
        return false;
      }
      
    } catch (error) {
      console.error('Error in createUserSampleApplications:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      throw error;
    }
  },

  // Get statistics for admin dashboard
  async getAdminStats() {
    try {
      console.log('Fetching admin stats...');
      
      const stats = {
        totalApplications: 0,
        pendingApplications: 0,
        approvedApplications: 0,
        totalUsers: 0,
        totalServices: 0,
        staffMembers: 0
      };

      // Get total applications
      const applicationsRef = collection(db, 'applications');
      const applicationsSnapshot = await getDocs(applicationsRef);
      stats.totalApplications = applicationsSnapshot.size;
      console.log('Total applications:', stats.totalApplications);

      // Get pending applications
      const pendingQuery = query(applicationsRef, where('status', '==', 'pending'));
      const pendingSnapshot = await getDocs(pendingQuery);
      stats.pendingApplications = pendingSnapshot.size;

      // Get approved applications
      const approvedQuery = query(applicationsRef, where('status', '==', 'approved'));
      const approvedSnapshot = await getDocs(approvedQuery);
      stats.approvedApplications = approvedSnapshot.size;

      // Get total users
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      stats.totalUsers = usersSnapshot.size;

      // Get total services
      const servicesRef = collection(db, 'services');
      const servicesSnapshot = await getDocs(servicesRef);
      stats.totalServices = servicesSnapshot.size;

      // Get staff members
      const staffQuery = query(usersRef, where('role', 'in', ['staff', 'admin']));
      const staffSnapshot = await getDocs(staffQuery);
      stats.staffMembers = staffSnapshot.size;

      console.log('Admin stats fetched successfully:', stats);
      return stats;
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      // If there's an error, try to initialize sample data
      await this.initializeSampleData();
      throw error;
    }
  },

  // Get statistics for staff dashboard
  async getStaffStats() {
    try {
      console.log('Fetching staff stats...');
      
      // First ensure we have sample data
      await this.initializeSampleData();
      
      const stats = {
        totalApplications: 0,
        pendingReview: 0,
        processedToday: 0,
        pendingDocuments: 0
      };

      const applicationsRef = collection(db, 'applications');

      // Get total applications
      const applicationsSnapshot = await getDocs(applicationsRef);
      stats.totalApplications = applicationsSnapshot.size;

      // Get pending review applications (including both 'pending' and 'under_review' statuses)
      const pendingQuery = query(applicationsRef, where('status', 'in', ['pending', 'under_review']));
      const pendingSnapshot = await getDocs(pendingQuery);
      stats.pendingReview = pendingSnapshot.size;

      // Get applications pending documents
      const pendingDocsQuery = query(applicationsRef, where('status', '==', 'pending_documents'));
      const pendingDocsSnapshot = await getDocs(pendingDocsQuery);
      stats.pendingDocuments = pendingDocsSnapshot.size;

      // Get processed applications (approved + rejected)
      const approvedQuery = query(applicationsRef, where('status', '==', 'approved'));
      const approvedSnapshot = await getDocs(approvedQuery);
      
      const rejectedQuery = query(applicationsRef, where('status', '==', 'rejected'));
      const rejectedSnapshot = await getDocs(rejectedQuery);
      
      stats.processedToday = approvedSnapshot.size + rejectedSnapshot.size;

      console.log('Staff stats:', stats);
      return stats;
    } catch (error) {
      console.error('Error fetching staff stats:', error);
      throw error;
    }
  },

  // Get statistics for user dashboard
  async getUserStats(userId) {
    try {
      console.log('Fetching user stats for:', userId);
      
      const stats = {
        totalApplications: 0,
        pendingApplications: 0,
        approvedApplications: 0,
        rejectedApplications: 0
      };

      const applicationsRef = collection(db, 'applications');
      console.log('Querying applications for userId:', userId);
      
      const userAppsQuery = query(applicationsRef, where('userId', '==', userId));
      const userAppsSnapshot = await getDocs(userAppsQuery);
      
      console.log('User applications query completed, found:', userAppsSnapshot.size, 'applications');

      // If user has no applications, create some sample ones
      if (userAppsSnapshot.empty) {
        console.log('No applications found for user, creating sample applications...');
        
        try {
          await this.createUserSampleApplications(userId, 'Current User', '');
          console.log('Sample applications created successfully');
          
          // Re-fetch after creating sample data
          console.log('Re-fetching applications after creating samples...');
          const newUserAppsSnapshot = await getDocs(userAppsQuery);
          stats.totalApplications = newUserAppsSnapshot.size;
          console.log('After creating samples, found:', stats.totalApplications, 'applications');
          
          // Count applications by status
          newUserAppsSnapshot.forEach((doc) => {
            const app = doc.data();
            console.log('Processing new user app:', app.serviceName, 'Status:', app.status);
            switch (app.status) {
              case 'pending':
              case 'under_review':
                stats.pendingApplications++;
                break;
              case 'approved':
                stats.approvedApplications++;
                break;
              case 'rejected':
                stats.rejectedApplications++;
                break;
              default:
                console.log('Unknown status:', app.status);
                break;
            }
          });
        } catch (createError) {
          console.error('Error creating sample applications:', createError);
          throw new Error(`Failed to create sample applications: ${createError.message}`);
        }
      } else {
        stats.totalApplications = userAppsSnapshot.size;
        console.log('Found existing applications for user:', stats.totalApplications);

        // Count applications by status
        userAppsSnapshot.forEach((doc) => {
          const app = doc.data();
          console.log('Processing existing user app:', app.serviceName, 'Status:', app.status);
          switch (app.status) {
            case 'pending':
            case 'under_review':
              stats.pendingApplications++;
              break;
            case 'approved':
              stats.approvedApplications++;
              break;
            case 'rejected':
              stats.rejectedApplications++;
              break;
            default:
              console.log('Unknown status:', app.status);
              break;
          }
        });
      }

      console.log('Final user stats calculated:', stats);
      return stats;
    } catch (error) {
      console.error('Error in getUserStats:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      throw error;
    }
  },

  // Get recent applications for admin/staff
  async getRecentApplications(limitCount = 5) {
    try {
      console.log('Fetching recent applications...');
      
      const applicationsRef = collection(db, 'applications');
      const recentQuery = query(
        applicationsRef,
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(recentQuery);

      const applications = [];
      for (const docSnapshot of snapshot.docs) {
        const appData = docSnapshot.data();
        
        // Get user data for applicant name
        let applicantName = 'Unknown User';
        if (appData.userId) {
          try {
            const userDocRef = doc(db, 'users', appData.userId);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              const userData = userDoc.data();
              applicantName = userData.fullName || userData.name || userData.email;
            }
          } catch (error) {
            console.warn('Error fetching user data:', error);
            // Use applicant details from the application if available
            if (appData.applicantDetails?.name) {
              applicantName = appData.applicantDetails.name;
            }
          }
        } else if (appData.applicantDetails?.name) {
          applicantName = appData.applicantDetails.name;
        }

        applications.push({
          id: docSnapshot.id,
          ...appData,
          applicantName
        });
      }

      console.log('Recent applications fetched successfully:', applications.length, 'items');
      return applications;
    } catch (error) {
      console.error('Error fetching recent applications:', error);
      throw error;
    }
  },

  // Get recent applications for specific user
  async getUserRecentApplications(userId, limitCount = 5) {
    try {
      console.log('Fetching user recent applications for:', userId);
      
      const applicationsRef = collection(db, 'applications');
      const userRecentQuery = query(
        applicationsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const snapshot = await getDocs(userRecentQuery);

      // If user has no applications, ensure they have some sample ones
      if (snapshot.empty) {
        console.log('No recent applications found for user, checking if user has any applications...');
        
        // Check if user has any applications at all
        const userAppsQuery = query(applicationsRef, where('userId', '==', userId));
        const userAppsSnapshot = await getDocs(userAppsQuery);
        
        if (userAppsSnapshot.empty) {
          console.log('User has no applications, creating sample ones...');
          await this.createUserSampleApplications(userId, 'Current User', '');
          
          // Re-fetch recent applications after creating sample data
          const newSnapshot = await getDocs(userRecentQuery);
          const applications = [];
          newSnapshot.forEach((docSnapshot) => {
            applications.push({
              id: docSnapshot.id,
              ...docSnapshot.data()
            });
          });
          
          console.log('User recent applications fetched successfully after creation:', applications.length, 'items');
          return applications;
        }
      }

      const applications = [];
      snapshot.forEach((docSnapshot) => {
        applications.push({
          id: docSnapshot.id,
          ...docSnapshot.data()
        });
      });

      console.log('User recent applications fetched successfully:', applications.length, 'items');
      return applications;
    } catch (error) {
      console.error('Error fetching user recent applications:', error);
      throw error;
    }
  }
}; 
import { db } from '../config/firebase';
import { collection, doc, setDoc, getDocs, addDoc, getDoc } from 'firebase/firestore';

// Function to set up the database collections
export const setupDatabase = async () => {
  try {
    console.log('Setting up database collections...');

    // Check if services collection exists
    const servicesSnapshot = await getDocs(collection(db, 'services'));
    if (servicesSnapshot.empty) {
      // Create sample services
      const sampleServices = [
        {
          title: 'Birth Certificate',
          description: 'Official birth certificate issuance for citizens',
          requirements: 'Hospital birth certificate, Parent ID proof, Address proof',
          processingTime: '7-10 business days',
          fee: '50',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'system'
        },
        {
          title: 'Property Tax Certificate',
          description: 'Property tax payment certificate and verification',
          requirements: 'Property documents, Previous tax receipts, Owner ID proof',
          processingTime: '5-7 business days',
          fee: '100',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'system'
        },
        {
          title: 'Trade License',
          description: 'Business trade license for commercial activities',
          requirements: 'Business plan, Shop agreement, Owner ID proof, NOC from neighbors',
          processingTime: '15-20 business days',
          fee: '500',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'system'
        }
      ];

      for (const service of sampleServices) {
        const serviceRef = doc(collection(db, 'services'));
        await setDoc(serviceRef, service);
        console.log(`Created service: ${service.title}`);
      }
    } else {
      console.log('Services collection already exists with data');
    }

    // Check if applications collection exists (create empty collection marker)
    const applicationsSnapshot = await getDocs(collection(db, 'applications'));
    if (applicationsSnapshot.empty) {
      // Create a placeholder document that will be deleted
      const placeholderRef = doc(collection(db, 'applications'), 'placeholder');
      await setDoc(placeholderRef, {
        placeholder: true,
        createdAt: new Date().toISOString()
      });
      console.log('Created applications collection');
    }

    // Check if status_logs collection exists (create empty collection marker)
    const statusLogsSnapshot = await getDocs(collection(db, 'status_logs'));
    if (statusLogsSnapshot.empty) {
      // Create a placeholder document that will be deleted
      const placeholderRef = doc(collection(db, 'status_logs'), 'placeholder');
      await setDoc(placeholderRef, {
        placeholder: true,
        createdAt: new Date().toISOString()
      });
      console.log('Created status_logs collection');
    }

    console.log('Database setup completed successfully!');
    return { success: true, message: 'Database setup completed successfully!' };
  } catch (error) {
    console.error('Error setting up database:', error);
    return { success: false, message: `Error setting up database: ${error.message}` };
  }
};

// Function to create an admin user
export const createAdminUser = async (userId, userData) => {
  try {
    const adminData = {
      ...userData,
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'users', userId), adminData);
    console.log('Admin user created successfully');
    return { success: true, message: 'Admin user created successfully!' };
  } catch (error) {
    console.error('Error creating admin user:', error);
    return { success: false, message: `Error creating admin user: ${error.message}` };
  }
};

// Function to check database status
export const checkDatabaseStatus = async () => {
  try {
    const collections = ['users', 'services', 'applications', 'status_logs'];
    const status = {};

    for (const collectionName of collections) {
      const snapshot = await getDocs(collection(db, collectionName));
      status[collectionName] = {
        exists: !snapshot.empty,
        count: snapshot.size,
        documents: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      };
    }

    return { success: true, status };
  } catch (error) {
    console.error('Error checking database status:', error);
    return { success: false, message: error.message };
  }
};

// Function to create test applications for debugging
export const createTestApplications = async () => {
  try {
    console.log('Creating test applications...');
    
    // Get all users and services first
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const servicesSnapshot = await getDocs(collection(db, 'services'));
    
    if (usersSnapshot.empty) {
      throw new Error('No users found. Please create users first.');
    }
    
    if (servicesSnapshot.empty) {
      throw new Error('No services found. Please create services first.');
    }
    
    const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const services = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Filter only regular users (not admin/staff)
    const regularUsers = users.filter(user => user.role === 'user');
    
    if (regularUsers.length === 0) {
      throw new Error('No regular users found. Please create users with role "user" first.');
    }
    
    const testApplications = [
      {
        userId: regularUsers[0].id,
        serviceId: services[0].id,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        notes: JSON.stringify({
          description: 'I need to obtain a birth certificate for my newborn child. All required documents are attached.',
          documents: [
            { name: 'hospital_certificate.pdf', url: '#', size: 245760, type: 'application/pdf' },
            { name: 'parent_id.pdf', url: '#', size: 189440, type: 'application/pdf' }
          ]
        })
      },
      {
        userId: regularUsers[0].id,
        serviceId: services[Math.min(1, services.length - 1)].id,
        status: 'in_review',
        submittedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        notes: JSON.stringify({
          description: 'Applying for property tax assessment for my residential property.',
          documents: [
            { name: 'property_deed.pdf', url: '#', size: 512000, type: 'application/pdf' },
            { name: 'previous_tax_receipt.pdf', url: '#', size: 128000, type: 'application/pdf' }
          ]
        })
      }
    ];
    
    // Add more test applications if there are more users
    if (regularUsers.length > 1 && services.length > 0) {
      testApplications.push({
        userId: regularUsers[1].id,
        serviceId: services[0].id,
        status: 'approved',
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        notes: JSON.stringify({
          description: 'Request for income certificate for educational purposes.',
          documents: [
            { name: 'income_proof.pdf', url: '#', size: 384000, type: 'application/pdf' },
            { name: 'education_admission_letter.pdf', url: '#', size: 256000, type: 'application/pdf' }
          ]
        }),
        staffRemarks: 'Application approved. Please collect your certificate from the office.'
      });
    }
    
    // Create the test applications
    for (const appData of testApplications) {
      await addDoc(collection(db, 'applications'), appData);
    }
    
    console.log(`Created ${testApplications.length} test applications successfully!`);
    return { success: true, message: `Created ${testApplications.length} test applications successfully!` };
  } catch (error) {
    console.error('Error creating test applications:', error);
    return { success: false, message: `Error creating test applications: ${error.message}` };
  }
};

// Function to check and fix user permissions
export const checkUserPermissions = async (userId) => {
  try {
    console.log('Checking user permissions for:', userId);
    
    // Check if user exists in the users collection
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      console.log('User not found in database, this might cause permission issues');
      return { 
        success: false, 
        message: 'User not found in database. Please register again or contact support.',
        userExists: false
      };
    }
    
    const userData = userDoc.data();
    console.log('User data:', userData);
    
    if (!userData.role) {
      console.log('User has no role assigned');
      return {
        success: false,
        message: 'User has no role assigned. Please contact admin to assign a role.',
        userExists: true,
        hasRole: false
      };
    }
    
    console.log('User permissions check passed');
    return {
      success: true,
      message: 'User permissions are correctly set up',
      userExists: true,
      hasRole: true,
      role: userData.role,
      userData: userData
    };
    
  } catch (error) {
    console.error('Error checking user permissions:', error);
    return {
      success: false,
      message: `Error checking permissions: ${error.message}`,
      error: error
    };
  }
}; 